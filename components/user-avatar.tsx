"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPresenceColor, resolvePresenceStatus } from "@/lib/presence/utils";
import type { PresenceStatus } from "@/lib/presence/types";
import { getDisplayName, getProfileInitials } from "@/lib/profile/display";
import type { Profile } from "@/lib/types/database";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  profile: Pick<Profile, "email" | "display_name" | "avatar_url"> & {
    presence_status?: PresenceStatus;
    last_active_at?: string | null;
  };
  className?: string;
  fallbackClassName?: string;
  showPresence?: boolean;
};

export function UserAvatar({
  profile,
  className,
  fallbackClassName,
  showPresence = false,
}: UserAvatarProps) {
  const initials = getProfileInitials(profile);
  const presence = profile.presence_status
    ? resolvePresenceStatus(profile.presence_status, profile.last_active_at)
    : null;

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <Avatar className="size-full">
        {profile.avatar_url ? (
          <AvatarImage src={profile.avatar_url} alt={getDisplayName(profile)} />
        ) : null}
        <AvatarFallback
          className={cn(
            "bg-white/10 text-xs font-semibold text-white",
            fallbackClassName,
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {showPresence && presence && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-black",
            getPresenceColor(presence),
          )}
          title={presence}
        />
      )}
    </div>
  );
}
