"use client";

import { MessageSquare, MoreHorizontal, Pencil, Smile, Trash2 } from "lucide-react";
import { useState } from "react";
import { MessageContent } from "@/components/chat/message-content";
import { MessageAttachments } from "@/components/chat/message-attachments";
import { ThreadSummaryBar } from "@/components/chat/thread-summary-bar";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import type { MessageWithAuthor } from "@/lib/chat/queries";
import type { UserProfileSummary } from "@/components/chat/user-profile-panel";
import { formatMessageTime, isMessageEdited } from "@/lib/chat/format";
import { getDisplayName } from "@/lib/profile/display";
import { cn } from "@/lib/utils";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "🚀"];

type MessageItemProps = {
  message: MessageWithAuthor;
  currentUserId?: string;
  onOpenThread?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onAuthorClick?: (author: UserProfileSummary) => void;
  onEdit?: (messageId: string, content: string) => Promise<void>;
  onDelete?: (messageId: string) => Promise<void>;
  compact?: boolean;
};

export function MessageItem({
  message,
  currentUserId,
  onOpenThread,
  onToggleReaction,
  onAuthorClick,
  onEdit,
  onDelete,
  compact = false,
}: MessageItemProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);

  const author = message.author ?? {
    id: "",
    email: "unknown@devtalk.app",
    display_name: null,
    avatar_url: null,
  };
  const displayName = getDisplayName(author);
  const edited = isMessageEdited(message.created_at, message.updated_at);
  const isOwn = message.user_id === currentUserId;
  const isDeleted = Boolean(message.deleted_at);
  const hasAttachments = (message.attachments ?? []).length > 0;
  const canEdit = isOwn && !isDeleted && !hasAttachments && onEdit;
  const canDelete = isOwn && !isDeleted && onDelete;

  const grouped = (message.reactions ?? []).reduce<
    Record<string, { count: number; reacted: boolean }>
  >((acc, r) => {
    const entry = acc[r.emoji] ?? { count: 0, reacted: false };
    entry.count += 1;
    if (r.user_id === currentUserId) entry.reacted = true;
    acc[r.emoji] = entry;
    return acc;
  }, {});

  const saveEdit = async () => {
    if (!onEdit || !editValue.trim()) return;
    setIsSaving(true);
    try {
      await onEdit(message.id, editValue.trim());
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-lg px-2 py-1.5 transition-smooth hover:bg-white/[0.03] sm:px-3",
        compact && "py-1",
      )}
    >
      <button
        type="button"
        onClick={() => onAuthorClick?.(author)}
        className={cn(
          "mt-0.5 shrink-0 rounded-lg transition-smooth",
          onAuthorClick && "hover:opacity-80",
        )}
        disabled={!onAuthorClick}
      >
        <UserAvatar
          profile={author}
          showPresence
          className="size-9 rounded-lg"
        />
      </button>

      <div className="min-w-0 flex-1 pr-8 sm:pr-10">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <button
            type="button"
            onClick={() => onAuthorClick?.(author)}
            disabled={!onAuthorClick}
            className={cn(
              "text-[15px] font-bold text-white",
              onAuthorClick && "cursor-pointer hover:underline",
            )}
          >
            {displayName}
          </button>
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.created_at)}
          </span>
          {edited && !isDeleted && (
            <span className="text-xs text-gray-500">(edited)</span>
          )}
        </div>

        <div className="mt-0.5 text-[15px] leading-relaxed text-gray-100">
          {isDeleted ? (
            <p className="italic text-gray-500">This message was deleted.</p>
          ) : isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(event) => setEditValue(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="btn-brand h-8"
                  disabled={isSaving || !editValue.trim()}
                  onClick={() => void saveEdit()}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-gray-300"
                  onClick={() => {
                    setIsEditing(false);
                    setEditValue(message.content);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {message.content.trim() ? (
                <MessageContent content={message.content} />
              ) : null}
              <MessageAttachments attachments={message.attachments ?? []} />
            </>
          )}
        </div>

        {!isDeleted && Object.keys(grouped).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(grouped).map(([emoji, { count, reacted }]) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onToggleReaction?.(message.id, emoji)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-smooth",
                  reacted
                    ? "border-sky-500/40 bg-sky-500/15 text-white"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20",
                )}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        )}

        {!compact && !isDeleted && onOpenThread && message.thread && (
          <ThreadSummaryBar
            thread={message.thread}
            onOpen={() => onOpenThread(message.id)}
          />
        )}

        {!compact && !isDeleted && onOpenThread && !message.thread && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-7 rounded-lg px-2 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10 hover:text-white"
            onClick={() => onOpenThread(message.id)}
          >
            <MessageSquare className="mr-1 size-3.5" />
            Reply in thread
          </Button>
        )}
      </div>

      <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:right-2 sm:top-2">
        {(canEdit || canDelete) && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"
              onClick={() => setShowActions((value) => !value)}
            >
              <MoreHorizontal className="size-4" />
            </Button>
            {showActions && (
              <div className="glass-card absolute right-0 top-9 z-20 min-w-36 p-1">
                {canEdit && (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-200 hover:bg-white/10"
                    onClick={() => {
                      setShowActions(false);
                      setIsEditing(true);
                      setEditValue(message.content);
                    }}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-white/10"
                    onClick={() => {
                      setShowActions(false);
                      void onDelete(message.id);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"
          onClick={() => setShowPicker((v) => !v)}
        >
          <Smile className="size-4" />
        </Button>
        {showPicker && (
          <div className="glass-card absolute right-0 top-9 z-10 flex gap-0.5 p-1.5">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="rounded-lg p-1.5 text-base transition-smooth hover:bg-white/10"
                onClick={() => {
                  onToggleReaction?.(message.id, emoji);
                  setShowPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
