import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionTier } from "@/lib/types/database";
import type Stripe from "stripe";

export async function activateProFromCheckoutSession(
  session: Stripe.Checkout.Session,
  expectedUserId: string,
): Promise<void> {
  const userId = session.metadata?.supabase_user_id;

  if (!userId || userId !== expectedUserId) {
    throw new Error("Checkout session does not belong to this user");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  const admin = createAdminClient();

  if (subscriptionId) {
    const { data: existing } = await admin
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle();

    if (!existing) {
      await admin.from("subscriptions").insert({
        stripe_subscription_id: subscriptionId,
        user_id: userId,
        status: "active",
      });
    }
  }

  await admin
    .from("profiles")
    .update({ subscription_tier: "pro" as SubscriptionTier })
    .eq("id", userId);
}

export async function retrieveAndActivateCheckoutSession(
  sessionId: string,
  userId: string,
): Promise<void> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  await activateProFromCheckoutSession(session, userId);
}
