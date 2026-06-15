import { NextResponse } from "next/server";
import Stripe from "stripe";
import { activateProFromCheckoutSession } from "@/lib/stripe/activate-pro";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionTier } from "@/lib/types/database";

async function resolveUserIdFromSubscription(
  subscription: Stripe.Subscription,
  admin: ReturnType<typeof createAdminClient>,
): Promise<string | null> {
  const metadataUserId = subscription.metadata?.supabase_user_id;
  if (metadataUserId) return metadataUserId;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return profile?.id ?? null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    await activateProFromCheckoutSession(session, userId);
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const status = subscription.status;
    const userId = await resolveUserIdFromSubscription(subscription, admin);

    if (userId) {
      const isActive = status === "active" || status === "trialing";

      await admin
        .from("profiles")
        .update({
          subscription_tier: (isActive ? "pro" : "free") as SubscriptionTier,
        })
        .eq("id", userId);

      await admin
        .from("subscriptions")
        .update({ status })
        .eq("stripe_subscription_id", subscription.id);
    }
  }

  return NextResponse.json({ received: true });
}
