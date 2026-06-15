"use client";

import { Loader2, Settings2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AccountPanel } from "@/components/settings/account-panel";
import { ChangePasswordPanel } from "@/components/settings/change-password-panel";
import { PlanPanel } from "@/components/settings/plan-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { useUpgrade } from "@/hooks/use-upgrade";
import { useToast } from "@/hooks/use-toast";
import { countUserChannels } from "@/lib/chat/queries";
import { createClient } from "@/lib/supabase/client";
import { isProTier, type Profile } from "@/lib/types/database";
import { useUserStore } from "@/store/user-store";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const isLoading = useUserStore((s) => s.isLoading);
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmedRef = useRef(false);
  const canceledRef = useRef(false);
  const { upgrade, isUpgrading } = useUpgrade();

  const { data: channelCount = 0 } = useQuery({
    queryKey: ["channel-count"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return 0;
      return countUserChannels(supabase, user.id);
    },
    enabled: !!profile,
  });

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (canceled && !canceledRef.current) {
      canceledRef.current = true;
      toast({
        title: "Checkout canceled",
        description: "No changes were made to your plan.",
      });
      router.replace("/settings");
      return;
    }

    if (!success || !sessionId || confirmedRef.current) return;
    confirmedRef.current = true;

    const confirmPayment = async () => {
      setIsConfirming(true);
      try {
        const res = await fetch("/api/stripe/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Could not activate Pro");
        }

        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const updated = (await profileRes.json()) as Profile;
          setProfile(updated);
        }

        toast({
          title: "Pro activated",
          description: "Your subscription is now active.",
        });
        router.replace("/settings");
      } catch (err) {
        toast({
          title: "Activation failed",
          description: err instanceof Error ? err.message : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsConfirming(false);
      }
    };

    void confirmPayment();
  }, [searchParams, setProfile, toast, router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (isLoading || isConfirming) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Could not load profile.
      </div>
    );
  }

  const isPro = isProTier(profile.subscription_tier);

  return (
    <div className="space-y-8 lg:mx-auto lg:max-w-6xl">
      <PageHeader
        title="Settings"
        description="Manage your account and subscription."
        icon={Settings2}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <AccountPanel
            profile={profile}
            onProfileUpdate={setProfile}
            onSignOut={() => void handleSignOut()}
          />
          <ChangePasswordPanel />
        </div>
        <div className="lg:col-span-3">
          <PlanPanel
            isPro={isPro}
            channelCount={channelCount}
            isUpgrading={isUpgrading}
            onUpgrade={() => void upgrade()}
          />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
