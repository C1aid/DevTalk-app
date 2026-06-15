import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: { id: string } };

export async function POST(_request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: channel, error: fetchError } = await supabase
    .from("channels")
    .select("id, created_by, kind, name")
    .eq("id", params.id)
    .single();

  if (fetchError || !channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  const { data: membership } = await supabase
    .from("channel_members")
    .select("id")
    .eq("channel_id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "You are not a member" }, { status: 400 });
  }

  if (channel.kind === "channel" && channel.created_by === user.id) {
    return NextResponse.json(
      { error: "Channel owners must delete the channel instead of leaving" },
      { status: 400 },
    );
  }

  const { error: leaveError } = await supabase
    .from("channel_members")
    .delete()
    .eq("channel_id", params.id)
    .eq("user_id", user.id);

  if (leaveError) {
    return NextResponse.json({ error: leaveError.message }, { status: 500 });
  }

  if (channel.kind === "dm") {
    const { count } = await supabase
      .from("channel_members")
      .select("*", { count: "exact", head: true })
      .eq("channel_id", params.id);

    if (count === 0) {
      await supabase.from("channels").delete().eq("id", params.id);
    }
  }

  return NextResponse.json({ ok: true });
}
