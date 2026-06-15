"use client";

import { MessageSquare, Smile } from "lucide-react";
import { useState } from "react";
import { MessageContent } from "@/components/chat/message-content";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import type { MessageWithAuthor } from "@/lib/chat/queries";
import { getDisplayName } from "@/lib/profile/display";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "🚀"];

type MessageItemProps = {
  message: MessageWithAuthor;
  currentUserId?: string;
  onOpenThread?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  compact?: boolean;
};

export function MessageItem({
  message,
  currentUserId,
  onOpenThread,
  onToggleReaction,
  compact = false,
}: MessageItemProps) {
  const [showPicker, setShowPicker] = useState(false);
  const author = message.author ?? {
    id: "",
    email: "unknown@devtalk.app",
    display_name: null,
    avatar_url: null,
  };
  const displayName = getDisplayName(author);

  const grouped = (message.reactions ?? []).reduce<
    Record<string, { count: number; reacted: boolean }>
  >((acc, r) => {
    const entry = acc[r.emoji] ?? { count: 0, reacted: false };
    entry.count += 1;
    if (r.user_id === currentUserId) entry.reacted = true;
    acc[r.emoji] = entry;
    return acc;
  }, {});

  return (
    <div
      className={cn(
        "group relative flex gap-2 rounded-lg px-1 py-2 transition-smooth hover:bg-white/5 sm:gap-3 sm:px-2",
        compact && "py-1.5",
      )}
    >
      <UserAvatar profile={author} className="size-9 rounded-lg" />

      <div className="min-w-0 flex-1 pr-8 sm:pr-10">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold text-white">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(new Date(message.created_at))}
          </span>
        </div>

        <MessageContent content={message.content} />

        {Object.keys(grouped).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(grouped).map(([emoji, { count, reacted }]) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onToggleReaction?.(message.id, emoji)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-smooth",
                  reacted
                    ? "border-primary/40 bg-primary/15 text-white"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20",
                )}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        )}

        {!compact && onOpenThread && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-7 px-2 text-xs text-muted-foreground opacity-100 sm:opacity-100"
            onClick={() => onOpenThread(message.id)}
          >
            <MessageSquare className="mr-1 size-3.5" />
            Reply in thread
          </Button>
        )}
      </div>

      <div className="absolute right-1 top-1 opacity-100 sm:right-2 sm:top-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => setShowPicker((v) => !v)}
        >
          <Smile className="size-4" />
        </Button>
        {showPicker && (
          <div className="absolute right-0 top-8 z-10 flex gap-1 rounded-lg border border-white/10 bg-black p-1 shadow-lg">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="rounded p-1 text-base hover:bg-white/10"
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
