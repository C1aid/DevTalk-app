"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getPresenceColor, getPresenceLabel } from "@/lib/presence/utils";
import type { PresenceStatus } from "@/lib/presence/types";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: PresenceStatus[] = ["online", "idle", "dnd", "offline"];

export function PresenceStatusPicker({ className }: { className?: string }) {
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  if (!profile) return null;

  const current = profile.presence_status ?? "offline";

  const updateStatus = async (status: PresenceStatus) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presence_status: status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();
      setProfile({ ...profile, ...data });
      toast({ title: `Status set to ${getPresenceLabel(status)}` });
    } catch {
      toast({
        title: "Could not update status",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        Your status
      </p>
      <div className="grid grid-cols-2 gap-2">
        {STATUS_OPTIONS.map((value) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            disabled={isSaving}
            className={cn(
              "h-9 justify-start gap-2 border-white/10 bg-white/5 text-sm text-gray-200 hover:bg-white/10",
              current === value && "border-white/25 bg-white/10 text-white",
            )}
            onClick={() => void updateStatus(value)}
          >
            {isSaving && current === value ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <span
                className={cn("size-2.5 rounded-full", getPresenceColor(value))}
              />
            )}
            {getPresenceLabel(value)}
          </Button>
        ))}
      </div>
      <p className="text-[11px] leading-relaxed text-gray-500">
        Away activates automatically after 5 minutes without activity.
      </p>
    </div>
  );
}
