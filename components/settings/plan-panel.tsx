"use client";

import {
  Check,
  Crown,
  Hash,
  History,
  Lock,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FREE_CHANNEL_LIMIT,
  FREE_HISTORY_DAYS,
  PRO_PRICE_MONTHLY,
} from "@/lib/types/database";
import { cn } from "@/lib/utils";

const proFeatures = [
  {
    icon: History,
    title: "Unlimited history",
    description: "Keep every message, forever.",
  },
  {
    icon: Hash,
    title: "Unlimited channels",
    description: "No cap on workspace channels.",
  },
  {
    icon: Search,
    title: "Full search",
    description: "Search across all message history.",
  },
] as const;

type PlanPanelProps = {
  isPro: boolean;
  channelCount: number;
  isUpgrading: boolean;
  onUpgrade: () => void;
};

export function PlanPanel({
  isPro,
  channelCount,
  isUpgrading,
  onUpgrade,
}: PlanPanelProps) {
  const usagePercent = Math.min((channelCount / FREE_CHANNEL_LIMIT) * 100, 100);

  return (
    <div className={cn("glass-card overflow-hidden", isPro && "ring-1 ring-primary/30")}>
      <div className={cn("h-1", isPro ? "bg-primary" : "bg-border")} />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl",
                isPro ? "bg-white/10 ring-1 ring-white/20" : "bg-white/5 ring-1 ring-white/10",
              )}
            >
              <Crown className={cn("size-6", isPro ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Subscription
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground">
                {isPro ? "Pro Plan" : "Free Plan"}
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {isPro
                  ? "Unlimited message history and channels."
                  : `Free includes ${FREE_HISTORY_DAYS}-day history and up to ${FREE_CHANNEL_LIMIT} channels.`}
              </p>
            </div>
          </div>

          {isPro ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground ring-1 ring-primary/30">
              <Sparkles className="size-3.5" />
              Active
            </span>
          ) : (
            <div className="sm:text-right">
              <p className="text-2xl font-bold text-foreground sm:text-3xl">
                ${PRO_PRICE_MONTHLY}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground">Stripe test mode</p>
            </div>
          )}
        </div>

        {!isPro && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Channels created</span>
              <span className="font-medium text-foreground">
                {channelCount}/{FREE_CHANNEL_LIMIT}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {proFeatures.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                isPro ? "border-primary/25 bg-primary/5" : "border-border bg-card",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    isPro ? "bg-white/10" : "bg-white/5",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      isPro ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                </div>
                {isPro ? (
                  <Check className="size-4 text-primary" />
                ) : (
                  <Lock className="size-3.5 text-muted-foreground/50" />
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>

        {!isPro && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited history and channels via Stripe Checkout.
                </p>
              </div>
            </div>
            <Button
              className="btn-brand h-11 w-full shrink-0 px-6 sm:w-auto"
              onClick={onUpgrade}
              disabled={isUpgrading}
            >
              {isUpgrading ? "Redirecting…" : "Upgrade to Pro"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
