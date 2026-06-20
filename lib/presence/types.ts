export type PresenceStatus = "online" | "idle" | "dnd" | "offline";

export const PRESENCE_STATUSES: PresenceStatus[] = [
  "online",
  "idle",
  "dnd",
  "offline",
];

export const AFK_TIMEOUT_MS = 5 * 60 * 1000;

export type PresenceProfile = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  presence_status: PresenceStatus;
  last_active_at: string;
};
