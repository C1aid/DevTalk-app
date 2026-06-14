"use client";

import { LogOut, Mail, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { getSubscriptionLabel } from "@/store/user-store";
import { cn } from "@/lib/utils";

type AccountPanelProps = {
  profile: Profile;
  onSignOut: () => void;
};

function getInitials(email: string) {
  const local = email.split("@")[0] ?? email;
  return local.slice(0, 2).toUpperCase();
}

export function AccountPanel({ profile, onSignOut }: AccountPanelProps) {
  const isPremium = profile.subscription_tier === "premium";

  return (
    <div className="glass-card overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20" />

      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="size-16 ring-2 ring-border">
            <AvatarFallback className="bg-white text-lg font-bold text-black">
              {getInitials(profile.email)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Account
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
              {profile.email}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
                  isPremium
                    ? "bg-white/10 text-white ring-white/20"
                    : "bg-white/5 text-gray-300 ring-white/10",
                )}
              >
                {getSubscriptionLabel(profile.subscription_tier)}
              </span>
              <span className="text-xs text-muted-foreground">
                Member since {formatDate(profile.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0 text-primary" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="size-4 shrink-0 text-primary" />
            <span>Secured with Supabase Auth</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
