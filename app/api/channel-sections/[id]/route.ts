import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: { id: string } };

const PROTECTED_SECTION_NAMES = new Set(["channels"]);

export async function DELETE(_request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: section, error: fetchError } = await supabase
    .from("channel_sections")
    .select("id, name")
    .eq("id", params.id)
    .single();

  if (fetchError || !section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  if (PROTECTED_SECTION_NAMES.has(section.name.toLowerCase())) {
    return NextResponse.json(
      { error: "The default Channels section cannot be deleted" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("channel_sections")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
