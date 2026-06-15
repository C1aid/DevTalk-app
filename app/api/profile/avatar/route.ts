import { NextResponse } from "next/server";
import {
  AVATAR_ALLOWED_TYPES,
  AVATAR_MAX_BYTES,
} from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/server";

const EXT_BY_MIME: Record<(typeof AVATAR_ALLOWED_TYPES)[number], string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!AVATAR_ALLOWED_TYPES.includes(file.type as (typeof AVATAR_ALLOWED_TYPES)[number])) {
      return NextResponse.json(
        { error: "Use PNG, JPEG, WebP, or GIF" },
        { status: 400 },
      );
    }

    if (file.size > AVATAR_MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 2 MB or smaller" },
        { status: 400 },
      );
    }

    const ext = EXT_BY_MIME[file.type as (typeof AVATAR_ALLOWED_TYPES)[number]];
    const path = `${user.id}/avatar.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, buffer, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    const avatarUrl = `${publicUrl}?v=${Date.now()}`;

    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to upload avatar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: files } = await supabase.storage.from("avatars").list(user.id);

    if (files?.length) {
      const paths = files.map((f) => `${user.id}/${f.name}`);
      await supabase.storage.from("avatars").remove(paths);
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to remove avatar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
