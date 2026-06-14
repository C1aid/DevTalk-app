"use client";

import { Loader2, Settings2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AccountPanel } from "@/components/settings/account-panel";
import { PlanPanel } from "@/components/settings/plan-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { fetchOwnedNotes } from "@/lib/notes/queries";
import type { Profile } from "@/lib/types/database";
import { useUserStore } from "@/store/user-store";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const isLoading = useUserStore((s) => s.isLoading);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmedRef = useRef(false);

  const { data: activeNotes = 0 } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const supabase = createClient();
      const notes = await fetchOwnedNotes(supabase);
      return notes.length;
    },
    enabled: !!profile,
  });

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");

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
          throw new Error(data.error ?? "Could not activate Premium");
        }

        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const updated = (await profileRes.json()) as Profile;
          setProfile(updated);
        }

        toast({
          title: "Premium activated",
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

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
      setIsUpgrading(false);
    }
  };

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

  const isPremium = profile.subscription_tier === "premium";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, plan, and workspace."
        icon={Settings2}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <AccountPanel profile={profile} onSignOut={() => void handleSignOut()} />
        </div>
        <div className="lg:col-span-3">
          <PlanPanel
            isPremium={isPremium}
            activeNotes={activeNotes}
            isUpgrading={isUpgrading}
            onUpgrade={() => void handleUpgrade()}
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
