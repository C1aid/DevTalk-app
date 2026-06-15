import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const reactionSchema = z.object({
  messageId: z.string().uuid(),
  emoji: z.string().min(1).max(8),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reactions")
    .upsert(
      {
        message_id: parsed.data.messageId,
        user_id: user.id,
        emoji: parsed.data.emoji,
      },
      { onConflict: "message_id,user_id,emoji" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("messageId");
  const emoji = searchParams.get("emoji");

  if (!messageId || !emoji) {
    return NextResponse.json({ error: "messageId and emoji required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("reactions")
    .delete()
    .eq("message_id", messageId)
    .eq("user_id", user.id)
    .eq("emoji", emoji);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
