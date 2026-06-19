"use client";

import { Code, CodeXml, Loader2, Mic, Paperclip, Send, Smile, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { EmojiPickerPanel } from "@/components/chat/emoji-picker-panel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  formatFileSize,
  MAX_ATTACHMENTS_PER_MESSAGE,
  MAX_ATTACHMENT_SIZE,
  type MessageAttachment,
} from "@/lib/chat/attachments";
import {
  insertAtCursor,
  insertCodeBlock,
  wrapSelection,
  type FormatResult,
} from "@/lib/chat/markdown-format";
import { cn } from "@/lib/utils";

export type SendMessagePayload = {
  content: string;
  attachments?: MessageAttachment[];
};

type PendingFile = {
  id: string;
  file: File;
};

type MessageInputProps = {
  channelId: string;
  onSend: (payload: SendMessagePayload) => Promise<void>;
  onAlsoSendToChannel?: (payload: SendMessagePayload) => Promise<void>;
  channelName?: string;
  isThread?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  buttonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
};

function ToolbarButton({
  label,
  onClick,
  children,
  active,
  buttonRef,
  disabled,
}: ToolbarButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg text-gray-400 transition-smooth hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-white/10 text-white",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-white/10" />;
}

export function MessageInput({
  channelId,
  onSend,
  onAlsoSendToChannel,
  channelName,
  isThread = false,
  placeholder = "Message…",
  disabled,
  className,
}: MessageInputProps) {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [content, setContent] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [alsoSendToChannel, setAlsoSendToChannel] = useState(false);

  const canSend =
    content.trim().length > 0 || pendingFiles.length > 0;

  const applyFormat = useCallback((result: FormatResult) => {
    setContent(result.value);
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }, []);

  const withTextarea = useCallback(
    (fn: (textarea: HTMLTextAreaElement) => FormatResult) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      applyFormat(fn(textarea));
    },
    [applyFormat],
  );

  const insertEmoji = (emoji: string) => {
    withTextarea((textarea) => insertAtCursor(textarea, emoji));
    setShowEmojiPicker(false);
  };

  const uploadAttachments = async (files: PendingFile[]) => {
    const uploaded: MessageAttachment[] = [];

    for (const { file } of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("channelId", channelId);

      const res = await fetch("/api/attachments", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as MessageAttachment & { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? `Failed to upload ${file.name}`);
      }

      uploaded.push(data);
    }

    return uploaded;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (selected.length === 0) return;

    const next = [...pendingFiles];
    const errors: string[] = [];

    for (const file of selected) {
      if (next.length >= MAX_ATTACHMENTS_PER_MESSAGE) {
        errors.push(`Maximum ${MAX_ATTACHMENTS_PER_MESSAGE} files per message`);
        break;
      }

      if (file.size > MAX_ATTACHMENT_SIZE) {
        errors.push(`${file.name} exceeds 50 MB`);
        continue;
      }

      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
      });
    }

    setPendingFiles(next);

    if (errors.length > 0) {
      toast({
        title: "Some files were skipped",
        description: errors.join(". "),
        variant: "destructive",
      });
    }
  };

  const removePendingFile = (id: string) => {
    setPendingFiles((files) => files.filter((file) => file.id !== id));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSend || isSending || disabled) return;

    setIsSending(true);
    try {
      const attachments =
        pendingFiles.length > 0 ? await uploadAttachments(pendingFiles) : undefined;

      const payload: SendMessagePayload = {
        content: content.trim(),
        attachments,
      };

      await onSend(payload);

      if (isThread && alsoSendToChannel && onAlsoSendToChannel) {
        await onAlsoSendToChannel(payload);
      }

      setContent("");
      setPendingFiles([]);
      setAlsoSendToChannel(false);
      setShowEmojiPicker(false);
    } catch (err) {
      toast({
        title: "Could not send message",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const showComingSoon = (feature: string) => {
    toast({
      title: "Coming soon",
      description: `${feature} will be available in a future update.`,
    });
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className={cn(
        "relative shrink-0 border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {showEmojiPicker && (
        <EmojiPickerPanel
          onSelect={insertEmoji}
          onClose={() => setShowEmojiPicker(false)}
          anchorRef={emojiButtonRef}
          className="absolute bottom-full left-3 mb-2 sm:left-4"
        />
      )}

      <div className="liquid-glass overflow-hidden rounded-xl">
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-white/10 px-3 py-2">
            {pendingFiles.map(({ id, file }) => (
              <div
                key={id}
                className="flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-200"
              >
                <Paperclip className="size-3.5 shrink-0 text-gray-400" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-gray-500">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  className="rounded-md p-0.5 text-gray-400 transition-smooth hover:bg-white/10 hover:text-white"
                  onClick={() => removePendingFile(id)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          placeholder={placeholder}
          rows={2}
          className="max-h-40 min-h-[4.5rem] w-full resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />

        {isThread && channelName && onAlsoSendToChannel && (
          <label className="flex cursor-pointer items-center gap-2 border-t border-white/10 px-3 py-2 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={alsoSendToChannel}
              onChange={(e) => setAlsoSendToChannel(e.target.checked)}
              className="size-3.5 rounded border-white/20 bg-white/5 accent-white"
            />
            <span>
              Also send to <span className="text-gray-300">#{channelName}</span>
            </span>
          </label>
        )}

        <div className="flex items-center justify-between border-t border-white/10 px-2 py-1.5">
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              label="Attach file"
              disabled={disabled || isSending || pendingFiles.length >= MAX_ATTACHMENTS_PER_MESSAGE}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Voice message"
              onClick={() => showComingSoon("Voice messages")}
            >
              <Mic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Emoji"
              active={showEmojiPicker}
              buttonRef={emojiButtonRef}
              onClick={() => setShowEmojiPicker((v) => !v)}
            >
              <Smile className="size-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              label="Inline code"
              onClick={() => withTextarea((t) => wrapSelection(t, "`", "`", "code"))}
            >
              <Code className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Code block"
              onClick={() => withTextarea(insertCodeBlock)}
            >
              <CodeXml className="size-4" />
            </ToolbarButton>
          </div>

          <Button
            type="submit"
            size="icon"
            className="btn-brand size-8 rounded-lg"
            disabled={disabled || isSending || !canSend}
            title="Send message"
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
