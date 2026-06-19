import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  MAX_ATTACHMENT_SIZE,
  sanitizeFileName,
} from "@/lib/chat/attachments";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const channelId = formData.get("channelId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (typeof channelId !== "string" || !channelId) {
    return NextResponse.json({ error: "channelId is required" }, { status: 400 });
  }

  if (file.size <= 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }

  if (file.size > MAX_ATTACHMENT_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 50 MB limit" },
      { status: 400 },
    );
  }

  const { data: membership } = await supabase
    .from("channel_members")
    .select("id")
    .eq("channel_id", channelId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const attachmentId = randomUUID();
  const safeName = sanitizeFileName(file.name);
  const path = `${channelId}/${user.id}/${attachmentId}-${safeName}`;
  const mimeType = file.type || "application/octet-stream";

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("attachments")
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: attachmentId,
    name: file.name,
    path,
    size: file.size,
    mimeType,
  });
}
