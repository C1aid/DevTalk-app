import type { Profile } from "@/lib/types/database";

type ProfileLike = Pick<Profile, "email" | "display_name">;

export function getDisplayName(profile: ProfileLike): string {
  const trimmed = profile.display_name?.trim();
  if (trimmed) return trimmed;
  return profile.email.split("@")[0] ?? profile.email;
}

export function getProfileInitials(profile: ProfileLike): string {
  const name = getDisplayName(profile);
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
