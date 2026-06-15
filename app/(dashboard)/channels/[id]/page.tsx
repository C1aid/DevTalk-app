import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { workspaceChannelPath } from "@/lib/workspace/paths";

type PageProps = { params: { id: string } };

export default async function LegacyChannelPage({ params }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: channel } = await supabase
    .from("channels")
    .select("id, kind, workspace_id")
    .eq("id", params.id)
    .maybeSingle();

  if (!channel) {
    redirect("/channels");
  }

  if (channel.kind === "dm") {
    redirect(`/channels/${params.id}/chat`);
  }

  if (channel.workspace_id) {
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("slug")
      .eq("id", channel.workspace_id)
      .single();

    if (workspace?.slug) {
      redirect(workspaceChannelPath(workspace.slug, params.id));
    }
  }

  redirect("/channels");
}
