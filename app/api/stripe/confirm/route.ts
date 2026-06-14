import { NextResponse } from "next/server";
import { z } from "zod";
import { retrieveAndActivateCheckoutSession } from "@/lib/stripe/activate-premium";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  sessionId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    await retrieveAndActivateCheckoutSession(parsed.data.sessionId, user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Confirmation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
