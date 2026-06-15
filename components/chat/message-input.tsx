"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MessageInputProps = {
  onSend: (content: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function MessageInput({
  onSend,
  placeholder = "Message… (Markdown supported)",
  disabled,
  className,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      await onSend(trimmed);
      setContent("");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className={cn(
        "flex items-end gap-2 border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4",
        className,
      )}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSending}
        placeholder={placeholder}
        rows={1}
        className="max-h-32 min-h-[2.5rem] flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/20"
      />
      <Button
        type="submit"
        size="icon"
        className="btn-brand shrink-0"
        disabled={disabled || isSending || !content.trim()}
      >
        {isSending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </form>
  );
}
