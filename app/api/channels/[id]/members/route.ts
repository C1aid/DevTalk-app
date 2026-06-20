import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: channel, error: channelError } = await supabase
    .from("channels")
    .select("id, visibility, workspace_id, kind")
    .eq("id", params.id)
    .single();

  if (channelError || !channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  if (channel.kind === "dm") {
    const { data: members, error } = await supabase
      .from("channel_members")
      .select(
        `
        role,
        profile:profiles!channel_members_user_id_fkey(
          id,
          email,
          display_name,
          avatar_url,
          presence_status,
          last_active_at
        )
      `,
      )
      .eq("channel_id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ members: members ?? [], scope: "dm" });
  }

  if (channel.visibility === "private") {
    const { data: membership } = await supabase
      .from("channel_members")
      .select("id")
      .eq("channel_id", params.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: members, error } = await supabase
      .from("channel_members")
      .select(
        `
        role,
        profile:profiles!channel_members_user_id_fkey(
          id,
          email,
          display_name,
          avatar_url,
          presence_status,
          last_active_at
        )
      `,
      )
      .eq("channel_id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ members: members ?? [], scope: "channel" });
  }

  if (!channel.workspace_id) {
    return NextResponse.json({ members: [], scope: "workspace" });
  }

  const { data: workspaceMembership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", channel.workspace_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!workspaceMembership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .select(
      `
      role,
      profile:profiles!workspace_members_user_id_fkey(
        id,
        email,
        display_name,
        avatar_url,
        presence_status,
        last_active_at
      )
    `,
    )
    .eq("workspace_id", channel.workspace_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    members: data ?? [],
    scope: "workspace",
    currentUserRole: workspaceMembership.role,
  });
}
