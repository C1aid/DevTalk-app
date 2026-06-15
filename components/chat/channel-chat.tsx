"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Hash, Loader2, Lock, MessageSquare, Search, User, X } from "lucide-react";
import { MessageInput } from "@/components/chat/message-input";
import { MessageItem } from "@/components/chat/message-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MessageWithAuthor } from "@/lib/chat/queries";
import type { Channel, Profile } from "@/lib/types/database";
import { getDisplayName } from "@/lib/profile/display";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

type ChannelPageProps = {
  channelId: string;
};

export function ChannelChat({ channelId }: ChannelPageProps) {
  const profile = useUserStore((s) => s.profile);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [dmPeer, setDmPeer] = useState<Pick<
    Profile,
    "id" | "email" | "display_name" | "avatar_url"
  > | null>(null);
  const [messages, setMessages] = useState<MessageWithAuthor[]>([]);
  const [threadParentId, setThreadParentId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<MessageWithAuthor[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadChannel = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("channels")
      .select("*")
      .eq("id", channelId)
      .single();
    const ch = data as Channel | null;
    setChannel(ch);

    if (ch?.kind === "dm" && profile?.id) {
      const { data: members } = await supabase
        .from("channel_members")
        .select("user_id")
        .eq("channel_id", channelId);

      const peerId = members?.find((m) => m.user_id !== profile.id)?.user_id;
      if (peerId) {
        const { data: peer } = await supabase
          .from("profiles")
          .select("id, email, display_name, avatar_url")
          .eq("id", peerId)
          .single();
        setDmPeer(peer);
      }
    } else {
      setDmPeer(null);
    }
  }, [channelId, profile?.id]);

  const loadMessages = useCallback(async () => {
    const params = new URLSearchParams({ channelId });
    if (search.trim()) params.set("q", search.trim());

    const res = await fetch(`/api/messages?${params}`);
    if (res.ok) {
      const data = (await res.json()) as MessageWithAuthor[];
      setMessages(data);
    }
    setIsLoading(false);
  }, [channelId, search]);

  const loadThread = useCallback(async (parentId: string) => {
    const params = new URLSearchParams({ channelId, parentId });
    const res = await fetch(`/api/messages?${params}`);
    if (res.ok) {
      setThreadMessages((await res.json()) as MessageWithAuthor[]);
    }
  }, [channelId]);

  useEffect(() => {
    void loadChannel();
    void loadMessages();
  }, [loadChannel, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();

    const channelSub = supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        () => {
          void loadMessages();
          if (threadParentId) void loadThread(threadParentId);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reactions",
        },
        () => {
          void loadMessages();
          if (threadParentId) void loadThread(threadParentId);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channelSub);
    };
  }, [channelId, loadMessages, loadThread, threadParentId]);

  const sendMessage = async (content: string, parentMessageId?: string) => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId, content, parentMessageId }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? "Failed to send");
    }
    await loadMessages();
    if (parentMessageId) await loadThread(parentMessageId);
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    const message = [...messages, ...threadMessages].find((m) => m.id === messageId);
    const existing = message?.reactions?.find(
      (r) => r.user_id === profile?.id && r.emoji === emoji,
    );

    if (existing) {
      await fetch(
        `/api/reactions?messageId=${messageId}&emoji=${encodeURIComponent(emoji)}`,
        { method: "DELETE" },
      );
    } else {
      await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, emoji }),
      });
    }

    await loadMessages();
    if (threadParentId) await loadThread(threadParentId);
  };

  const openThread = async (parentId: string) => {
    setThreadParentId(parentId);
    await loadThread(parentId);
  };

  if (!channel && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 text-center text-muted-foreground">
        Channel not found
      </div>
    );
  }

  const parentMessage = messages.find((m) => m.id === threadParentId);

  const isDm = channel?.kind === "dm";
  const headerTitle = isDm && dmPeer ? getDisplayName(dmPeer) : channel?.name;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-black/40 lg:rounded-xl lg:border lg:border-white/10">
      <div className="hidden shrink-0 border-b border-white/10 px-4 py-3 lg:flex lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          {isDm ? (
            <User className="size-4 shrink-0 text-muted-foreground" />
          ) : channel?.visibility === "private" ? (
            <Lock className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <Hash className="size-4 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <h1 className="truncate font-semibold text-white">
              {isDm ? headerTitle : `#${headerTitle}`}
            </h1>
            {channel?.description && !isDm && (
              <p className="truncate text-xs text-muted-foreground">
                {channel.description}
              </p>
            )}
            {isDm && dmPeer && (
              <p className="truncate text-xs text-muted-foreground">{dmPeer.email}</p>
            )}
          </div>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages"
            className="h-9 pl-8 text-sm"
          />
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-4 sm:py-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
                <p className="text-lg font-medium text-white">
                  {isDm
                    ? `Message ${headerTitle}`
                    : `Welcome to #${channel?.name}`}
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  This is the start of the channel. Say hello — Markdown and code
                  blocks are supported.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUserId={profile?.id}
                  onOpenThread={openThread}
                  onToggleReaction={toggleReaction}
                />
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <MessageInput onSend={(content) => sendMessage(content)} />
        </div>

        {threadParentId && parentMessage && (
          <div className="fixed inset-0 z-30 flex flex-col bg-black pt-[3.75rem] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:relative lg:inset-auto lg:z-0 lg:w-80 lg:border-l lg:border-white/10 lg:bg-black/60 lg:pb-0 lg:pt-0">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2.5">
              <span className="text-sm font-medium text-white">Thread</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setThreadParentId(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              <MessageItem
                message={parentMessage}
                currentUserId={profile?.id}
                onToggleReaction={toggleReaction}
                compact
              />
              <div className="my-2 border-t border-white/10" />
              {threadMessages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  currentUserId={profile?.id}
                  onToggleReaction={toggleReaction}
                  compact
                />
              ))}
            </div>
            <MessageInput
              placeholder="Reply in thread…"
              onSend={(content) => sendMessage(content, threadParentId)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
