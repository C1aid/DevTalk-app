import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, Profile, Reaction } from "@/lib/types/database";
import { getHistoryCutoff, isProTier, type SubscriptionTier } from "@/lib/types/database";

export type MessageWithAuthor = Message & {
  author: Pick<Profile, "id" | "email" | "display_name" | "avatar_url">;
  reactions: (Reaction & { user_email?: string })[];
  reply_count?: number;
};

export async function countUserChannels(supabase: SupabaseClient, userId: string) {
  const { count, error } = await supabase
    .from("channels")
    .select("*", { count: "exact", head: true })
    .eq("created_by", userId)
    .eq("kind", "channel");

  if (error) throw error;
  return count ?? 0;
}

export async function fetchChannelMessages(
  supabase: SupabaseClient,
  channelId: string,
  tier: SubscriptionTier,
  options?: { parentId?: string | null; search?: string },
) {
  let query = supabase
    .from("messages")
    .select(
      `
      *,
      author:profiles!messages_user_id_fkey(id, email, display_name, avatar_url),
      reactions(*)
    `,
    )
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

  if (options?.parentId) {
    query = query.eq("parent_message_id", options.parentId);
  } else {
    query = query.is("parent_message_id", null);
  }

  const cutoff = getHistoryCutoff(tier);
  if (cutoff) {
    query = query.gte("created_at", cutoff.toISOString());
  }

  if (options?.search?.trim()) {
    query = query.textSearch("content", options.search.trim(), {
      type: "websearch",
      config: "english",
    });
    if (!isProTier(tier) && cutoff) {
      query = query.gte("created_at", cutoff.toISOString());
    }
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as unknown as MessageWithAuthor[];
}
