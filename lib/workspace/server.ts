import { createClient } from "@/lib/supabase/server";
import type { Workspace } from "@/lib/types/database";

export async function getFirstUserWorkspace(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<Workspace | null> {
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspaces(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (membership as { workspaces: Workspace | null } | null)?.workspaces ?? null;
}

export async function getWorkspaceBySlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
  userId: string,
): Promise<Workspace | null> {
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", slug)
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
