import type { PresenceStatus } from "@/lib/presence/types";
import { AFK_TIMEOUT_MS } from "@/lib/presence/types";

export function getPresenceColor(status: PresenceStatus): string {
  switch (status) {
    case "online":
      return "bg-emerald-400";
    case "idle":
      return "bg-amber-400";
    case "dnd":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export function getPresenceLabel(status: PresenceStatus): string {
  switch (status) {
    case "online":
      return "Online";
    case "idle":
      return "Away";
    case "dnd":
      return "Do not disturb";
    default:
      return "Offline";
  }
}

export function resolvePresenceStatus(
  stored: PresenceStatus,
  lastActiveAt: string | null | undefined,
  now = Date.now(),
): PresenceStatus {
  if (stored === "dnd" || stored === "offline") return stored;

  if (!lastActiveAt) return stored;

  const lastActive = new Date(lastActiveAt).getTime();
  if (Number.isNaN(lastActive)) return stored;

  if (now - lastActive > AFK_TIMEOUT_MS) {
    return "idle";
  }

  return stored === "idle" ? "online" : stored;
}
