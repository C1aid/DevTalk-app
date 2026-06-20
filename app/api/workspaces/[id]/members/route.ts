import { NextResponse } from "next/server";
import { z } from "zod";
import { isWorkspaceAdmin } from "@/lib/chat/permissions";
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

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .select(
      `
      role,
      created_at,
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
    .eq("workspace_id", params.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const members = (data ?? []).map((row) => ({
    role: row.role,
    joined_at: row.created_at,
    profile: row.profile,
  }));

  return NextResponse.json({
    members,
    currentUserRole: membership.role,
    canManageRoles: membership.role === "owner",
  });
}

const updateMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "member"]),
});

export async function PATCH(request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: actor } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (actor?.role !== "owner") {
    return NextResponse.json({ error: "Only the workspace owner can change roles" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateMemberSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  if (parsed.data.userId === user.id) {
    return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
  }

  const { data: target } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", params.id)
    .eq("user_id", parsed.data.userId)
    .maybeSingle();

  if (!target) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (target.role === "owner") {
    return NextResponse.json({ error: "Cannot change the owner role" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .update({ role: parsed.data.role })
    .eq("workspace_id", params.id)
    .eq("user_id", parsed.data.userId)
    .select("role, user_id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
