"use client";

import { useState } from "react";
import type { BillingInterval } from "@/lib/types/database";
import { useToast } from "@/hooks/use-toast";

export function useUpgrade() {
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const upgrade = async (interval: BillingInterval = "monthly") => {
    setIsUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
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

  return { upgrade, isUpgrading };
}
