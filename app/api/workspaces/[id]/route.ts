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

  const { data: workspace, error: fetchError } = await supabase
    .from("workspaces")
    .select("id, created_by, name")
    .eq("id", params.id)
    .single();

  if (fetchError || !workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  if (workspace.created_by !== user.id) {
    return NextResponse.json(
      { error: "Only the workspace owner can delete it" },
      { status: 403 },
    );
  }

  const { error } = await supabase.from("workspaces").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
