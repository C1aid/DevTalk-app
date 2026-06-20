import { NextResponse } from "next/server";
import { z } from "zod";
import { isWorkspaceAdmin } from "@/lib/chat/permissions";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: { id: string } };

const updateChannelSchema = z.object({
  posting_permission: z.enum(["all_members", "admins_only"]).optional(),
  description: z.string().max(500).nullable().optional(),
});

export async function PATCH(request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateChannelSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { data: channel, error: fetchError } = await supabase
    .from("channels")
    .select("id, created_by, workspace_id, kind")
    .eq("id", params.id)
    .single();

  if (fetchError || !channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  if (channel.kind === "dm") {
    return NextResponse.json({ error: "DM settings are not editable" }, { status: 400 });
  }

  let workspaceRole: string | null = null;
  if (channel.workspace_id) {
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", channel.workspace_id)
      .eq("user_id", user.id)
      .maybeSingle();
    workspaceRole = membership?.role ?? null;
  }

  const canManage =
    isWorkspaceAdmin(workspaceRole) || channel.created_by === user.id;

  if (!canManage) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, string | null> = {};
  if (parsed.data.posting_permission !== undefined) {
    updates.posting_permission = parsed.data.posting_permission;
  }
  if (parsed.data.description !== undefined) {
    updates.description = parsed.data.description;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("channels")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

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
