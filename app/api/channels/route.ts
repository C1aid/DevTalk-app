import { NextResponse } from "next/server";
import { z } from "zod";
import { type DmConversation, type SidebarData } from "@/lib/chat/sidebar";
import { countUserChannels } from "@/lib/chat/queries";
import { createClient } from "@/lib/supabase/server";
import { canCreateChannel, type Channel, type Workspace } from "@/lib/types/database";

const createChannelSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().max(200).optional(),
  visibility: z.enum(["public", "private"]).default("public"),
  sectionId: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
});

async function getWorkspaceForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  workspaceSlug?: string | null,
): Promise<Workspace | null> {
  if (workspaceSlug) {
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("*")
      .eq("slug", workspaceSlug)
      .single();

    if (!workspace) return null;

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("user_id", userId)
      .maybeSingle();

    return membership ? (workspace as Workspace) : null;
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspaces(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const ws = (membership as { workspaces: Workspace | null } | null)?.workspaces;
  return ws ?? null;
}

async function loadSidebarData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  workspace: Workspace,
): Promise<SidebarData> {
  const [{ data: sections }, { data: channels }, { data: dmChannels }] =
    await Promise.all([
      supabase
        .from("channel_sections")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("sort_order"),
      supabase
        .from("channels")
        .select("*")
        .eq("kind", "channel")
        .eq("workspace_id", workspace.id)
        .order("name"),
      supabase
        .from("channels")
        .select("id, dm_key, created_by, channel_members(user_id)")
        .eq("kind", "dm"),
    ]);

  const dms: DmConversation[] = [];

  for (const dm of dmChannels ?? []) {
    const members = (dm as { channel_members?: { user_id: string }[] })
      .channel_members;
    if (!members?.some((m) => m.user_id === userId)) continue;

    const peerId = members.find((m) => m.user_id !== userId)?.user_id;
    if (!peerId) continue;

    const { data: peer } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url")
      .eq("id", peerId)
      .single();

    if (!peer) continue;

    dms.push({
      id: dm.id,
      dm_key: dm.dm_key ?? "",
      created_by: (dm as { created_by: string }).created_by,
      peer: peer as DmConversation["peer"],
    });
  }

  return {
    workspace,
    sections: sections ?? [],
    channels: (channels ?? []) as Channel[],
    dms,
  };
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceSlug = new URL(request.url).searchParams.get("workspace");

  try {
    const workspace = await getWorkspaceForUser(supabase, user.id, workspaceSlug);

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const data = await loadSidebarData(supabase, user.id, workspace);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load channels";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
  const parsed = createChannelSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", parsed.data.workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const channelCount = await countUserChannels(supabase, user.id);

  if (!canCreateChannel(profile.subscription_tier, channelCount)) {
    return NextResponse.json(
      {
        error: "Free plan is limited to 10 channels. Upgrade to Pro for unlimited channels.",
      },
      { status: 403 },
    );
  }

  let sectionId = parsed.data.sectionId ?? null;

  if (!sectionId) {
    const { data: defaultSection } = await supabase
      .from("channel_sections")
      .select("id")
      .eq("workspace_id", parsed.data.workspaceId)
      .eq("name", "Channels")
      .maybeSingle();
    sectionId = defaultSection?.id ?? null;
  }

  const { data, error } = await supabase
    .from("channels")
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      visibility: parsed.data.visibility,
      kind: "channel",
      section_id: sectionId,
      workspace_id: parsed.data.workspaceId,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
