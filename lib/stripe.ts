import Stripe from "stripe";
import type { BillingInterval } from "@/lib/types/database";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return stripeInstance;
}

export const PRO_PRICE_ID =
  process.env.STRIPE_PRO_PRICE_ID ?? process.env.STRIPE_PREMIUM_PRICE_ID!;

export const PRO_YEARLY_PRICE_ID = process.env.STRIPE_PRO_YEARLY_PRICE_ID;

export function getProPriceId(interval: BillingInterval = "monthly"): string {
  if (interval === "yearly") {
    if (!PRO_YEARLY_PRICE_ID) {
      throw new Error("Yearly billing is not configured");
    }
    return PRO_YEARLY_PRICE_ID;
  }
  return PRO_PRICE_ID;
}
