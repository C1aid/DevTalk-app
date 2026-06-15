import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceBySlug } from "@/lib/workspace/server";
import { workspaceChannelPath } from "@/lib/workspace/paths";

type PageProps = { params: { slug: string } };

export default async function WorkspaceHomePage({ params }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspace = await getWorkspaceBySlug(supabase, params.slug, user.id);

  if (!workspace) {
    redirect("/w/new");
  }

  const { data: channels } = await supabase
    .from("channels")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("kind", "channel")
    .order("created_at", { ascending: true })
    .limit(1);

  if (channels?.[0]?.id) {
    redirect(workspaceChannelPath(params.slug, channels[0].id));
  }

  redirect(`/w/${params.slug}/new`);
}
