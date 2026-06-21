"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PresenceStatus } from "@/lib/presence/types";
import { AFK_TIMEOUT_MS } from "@/lib/presence/types";
import { useUserStore } from "@/store/user-store";

const HEARTBEAT_INTERVAL_MS = 60_000;

export function usePresence() {
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const lastActivityRef = useRef(Date.now());
  const manualStatusRef = useRef<PresenceStatus | null>(null);

  const sendHeartbeat = useCallback(async (presenceStatus?: PresenceStatus) => {
    try {
      const res = await fetch("/api/presence/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          presenceStatus ? { presenceStatus } : {},
        ),
      });

      if (!res.ok) return;

      const data = (await res.json()) as {
        presence_status: PresenceStatus;
        last_active_at: string;
      };

      const current = useUserStore.getState().profile;
      if (current) {
        setProfile({
          ...current,
          presence_status: data.presence_status,
          last_active_at: data.last_active_at,
        });
      }
    } catch {
    }
  }, [setProfile]);

  const setPresenceStatus = useCallback(
    async (status: PresenceStatus) => {
      manualStatusRef.current = status === "idle" ? "online" : status;

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presence_status: status }),
      });

      if (!res.ok) return;

      const data = await res.json();
      const current = useUserStore.getState().profile;
      if (current) {
        setProfile({ ...current, ...data });
      }
    },
    [setProfile],
  );

  const markActive = useCallback(() => {
    lastActivityRef.current = Date.now();

    const current = useUserStore.getState().profile;
    if (!current) return;

    const manual = manualStatusRef.current ?? current.presence_status;
    if (manual === "dnd" || manual === "offline") return;

    if (current.presence_status === "idle" || current.presence_status === "offline") {
      void setPresenceStatus("online");
    }
  }, [setPresenceStatus]);

  useEffect(() => {
    if (!profile) return;

    manualStatusRef.current = profile.presence_status ?? null;

    if (profile.presence_status === "offline") {
      void setPresenceStatus("online");
    } else {
      void sendHeartbeat();
    }

    const heartbeatId = window.setInterval(() => {
      const idleFor = Date.now() - lastActivityRef.current;
      const manual = manualStatusRef.current ?? profile.presence_status;

      if (manual === "dnd" || manual === "offline") {
        void sendHeartbeat(manual);
        return;
      }

      if (idleFor >= AFK_TIMEOUT_MS) {
        void sendHeartbeat("idle");
        return;
      }

      void sendHeartbeat("online");
    }, HEARTBEAT_INTERVAL_MS);

    const onActivity = () => markActive();
    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    for (const event of events) {
      window.addEventListener(event, onActivity, { passive: true });
    }

    return () => {
      window.clearInterval(heartbeatId);
      for (const event of events) {
        window.removeEventListener(event, onActivity);
      }

      void fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presence_status: "offline" }),
      }).catch(() => undefined);
    };
  }, [profile?.id, markActive, sendHeartbeat, setPresenceStatus]);

  return { setPresenceStatus, markActive };
}
