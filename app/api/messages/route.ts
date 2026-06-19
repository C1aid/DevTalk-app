import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchChannelMessages } from "@/lib/chat/queries";
import { createClient } from "@/lib/supabase/server";

const attachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  path: z.string().min(1).max(500),
  size: z.number().int().positive().max(52_428_800),
  mimeType: z.string().min(1).max(255),
});

const createMessageSchema = z
  .object({
    channelId: z.string().uuid(),
    content: z.string().max(10000).default(""),
    parentMessageId: z.string().uuid().optional(),
    attachments: z.array(attachmentSchema).max(10).optional(),
  })
  .refine(
    (data) => data.content.trim().length > 0 || (data.attachments?.length ?? 0) > 0,
    { message: "Message must include text or at least one attachment" },
  );

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");
  const parentId = searchParams.get("parentId");
  const search = searchParams.get("q") ?? undefined;

  if (!channelId) {
    return NextResponse.json({ error: "channelId required" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  try {
    const messages = await fetchChannelMessages(
      supabase,
      channelId,
      profile.subscription_tier,
      {
        parentId: parentId ?? null,
        search,
      },
    );
    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load messages";
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
  const parsed = createMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  for (const attachment of parsed.data.attachments ?? []) {
    const expectedPrefix = `${parsed.data.channelId}/${user.id}/`;
    if (!attachment.path.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: "Invalid attachment" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      channel_id: parsed.data.channelId,
      user_id: user.id,
      content: parsed.data.content.trim(),
      parent_message_id: parsed.data.parentMessageId ?? null,
      attachments: parsed.data.attachments ?? [],
    })
    .select(
      `
      *,
      author:profiles!messages_user_id_fkey(id, email, display_name, avatar_url),
      reactions(*)
    `,
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
