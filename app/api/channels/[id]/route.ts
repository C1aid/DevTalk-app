import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: { id: string } };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: channel, error: fetchError } = await supabase
    .from("channels")
    .select("id, created_by, name, kind")
    .eq("id", params.id)
    .single();

  if (fetchError || !channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  if (channel.kind !== "dm" && channel.created_by !== user.id) {
    return NextResponse.json(
      { error: "Only the channel owner can delete it" },
      { status: 403 },
    );
  }

  if (channel.kind === "dm") {
    const { data: membership } = await supabase
      .from("channel_members")
      .select("id")
      .eq("channel_id", params.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { error } = await supabase.from("channels").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
