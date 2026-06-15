import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFirstUserWorkspace } from "@/lib/workspace/server";
import { workspacePath } from "@/lib/workspace/paths";

export default async function WorkspacesEntryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspace = await getFirstUserWorkspace(supabase, user.id);

  if (workspace) {
    redirect(workspacePath(workspace.slug));
  }

  redirect("/w/new");
}
