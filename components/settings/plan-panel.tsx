"use client";

import {
  Check,
  Crown,
  FileText,
  Lock,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_NOTE_LIMIT } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const premiumFeatures = [
  {
    icon: FileText,
    title: "Unlimited notes",
    description: "No caps on active notes in your workspace.",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description: "Edit together with live sync and presence.",
  },
  {
    icon: Share2,
    title: "Share & invite",
    description: "Invite collaborators with read or write access.",
  },
] as const;

type PlanPanelProps = {
  isPremium: boolean;
  activeNotes: number;
  isUpgrading: boolean;
  onUpgrade: () => void;
};

export function PlanPanel({
  isPremium,
  activeNotes,
  isUpgrading,
  onUpgrade,
}: PlanPanelProps) {
  const usagePercent = Math.min((activeNotes / FREE_NOTE_LIMIT) * 100, 100);

  return (
    <div className={cn("glass-card overflow-hidden", isPremium && "ring-1 ring-primary/30")}>
      <div className={cn("h-1", isPremium ? "bg-primary" : "bg-border")} />

      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl",
                isPremium ? "bg-white/10 ring-1 ring-white/20" : "bg-white/5 ring-1 ring-white/10",
              )}
            >
              <Crown className={cn("size-6", isPremium ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Subscription
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground">
                {isPremium ? "Premium Plan" : "Free Plan"}
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {isPremium
                  ? "You have full access to collaboration and unlimited notes."
                  : "Upgrade to unlock unlimited notes and team collaboration."}
              </p>
            </div>
          </div>

          {isPremium ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground ring-1 ring-primary/30">
              <Sparkles className="size-3.5" />
              Active
            </span>
          ) : (
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                $9
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground">Cancel anytime</p>
            </div>
          )}
        </div>

        {!isPremium && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active notes</span>
              <span className="font-medium text-foreground">
                {activeNotes}/{FREE_NOTE_LIMIT}
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
          {premiumFeatures.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                isPremium ? "border-primary/25 bg-primary/5" : "border-border bg-card",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={cn("flex size-9 items-center justify-center rounded-lg", isPremium ? "bg-white/10" : "bg-white/5")}>
                  <Icon className={cn("size-4", isPremium ? "text-primary" : "text-muted-foreground")} />
                </div>
                {isPremium ? (
                  <Check className="size-4 text-primary" />
                ) : (
                  <Lock className="size-3.5 text-muted-foreground/50" />
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        {!isPremium && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Ready to go Premium?</p>
                <p className="text-sm text-muted-foreground">
                  Unlock everything with secure Stripe billing.
                </p>
              </div>
            </div>
            <Button className="btn-brand h-11 shrink-0 px-6" onClick={onUpgrade} disabled={isUpgrading}>
              {isUpgrading ? "Redirecting…" : "Upgrade to Premium"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
