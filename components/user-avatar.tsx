"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDisplayName, getProfileInitials } from "@/lib/profile/display";
import type { Profile } from "@/lib/types/database";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  profile: Pick<Profile, "email" | "display_name" | "avatar_url">;
  className?: string;
  fallbackClassName?: string;
};

export function UserAvatar({ profile, className, fallbackClassName }: UserAvatarProps) {
  const initials = getProfileInitials(profile);

  return (
    <Avatar className={cn("size-9", className)}>
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
  );
}
