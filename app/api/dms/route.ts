import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDmKey } from "@/lib/chat/sidebar";
import { getDisplayName } from "@/lib/profile/display";
import { createClient } from "@/lib/supabase/server";

const startDmSchema = z.object({
  userId: z.string().uuid(),
});

async function ensureDmMembership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  channelId: string,
  userId: string,
) {
  const { data: existing } = await supabase
    .from("channel_members")
    .select("id")
    .eq("channel_id", channelId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return;

  await supabase.from("channel_members").insert({
    channel_id: channelId,
    user_id: userId,
    role: "member",
  });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: dmChannels, error } = await supabase
    .from("channels")
    .select("id, dm_key, created_by, channel_members(user_id)")
    .eq("kind", "dm");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const dms = [];

  for (const dm of dmChannels ?? []) {
    const members = (dm as { channel_members?: { user_id: string }[] })
      .channel_members;
    if (!members?.some((m) => m.user_id === user.id)) continue;

    const peerId = members.find((m) => m.user_id !== user.id)?.user_id;
    if (!peerId) continue;

    const { data: peer } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url")
      .eq("id", peerId)
      .single();

    if (!peer) continue;

    dms.push({
      id: dm.id,
      dm_key: dm.dm_key,
      created_by: (dm as { created_by: string }).created_by,
      peer,
    });
  }

  return NextResponse.json(dms);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = startDmSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  if (parsed.data.userId === user.id) {
    return NextResponse.json({ error: "Cannot DM yourself" }, { status: 400 });
  }

  const { data: peer } = await supabase
    .from("profiles")
    .select("id, email, display_name, avatar_url")
    .eq("id", parsed.data.userId)
    .single();

  if (!peer) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const dmKey = buildDmKey(user.id, peer.id);

  const { data: existing } = await supabase
    .from("channels")
    .select("id")
    .eq("kind", "dm")
    .eq("dm_key", dmKey)
    .maybeSingle();

  if (existing) {
    await ensureDmMembership(supabase, existing.id, user.id);
    await ensureDmMembership(supabase, existing.id, peer.id);
    return NextResponse.json({ id: existing.id, peer });
  }

  const peerName = getDisplayName(peer);

  const { data: channel, error: createError } = await supabase
    .from("channels")
    .insert({
      name: peerName,
      description: null,
      visibility: "private",
      kind: "dm",
      dm_key: dmKey,
      created_by: user.id,
    })
    .select()
    .single();

  if (createError || !channel) {
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create DM" },
      { status: 500 },
    );
  }

  const { error: memberError } = await supabase.from("channel_members").insert({
    channel_id: channel.id,
    user_id: peer.id,
    role: "member",
  });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ id: channel.id, peer }, { status: 201 });
}
