"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { getPresenceLabel, resolvePresenceStatus } from "@/lib/presence/utils";
import type { PresenceStatus } from "@/lib/presence/types";
import { formatWorkspaceRole } from "@/lib/chat/permissions";
import { getDisplayName } from "@/lib/profile/display";
import type { WorkspaceMemberRole } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export type MemberListEntry = {
  role: string;
  profile: {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
    presence_status?: PresenceStatus;
    last_active_at?: string | null;
  } | null;
};

type MembersPanelProps = {
  members: MemberListEntry[];
  currentUserId?: string;
  canManageRoles?: boolean;
  onRoleChange?: (userId: string, role: "admin" | "member") => Promise<void>;
  onMemberClick?: (profile: MemberListEntry["profile"]) => void;
  className?: string;
};

export function MembersPanel({
  members,
  currentUserId,
  canManageRoles = false,
  onRoleChange,
  onMemberClick,
  className,
}: MembersPanelProps) {
  return (
    <div className={cn("space-y-1 p-2", className)}>
      {members.map((member) => {
        const profile = member.profile;
        if (!profile) return null;

        const presence = resolvePresenceStatus(
          profile.presence_status ?? "offline",
          profile.last_active_at,
        );
        const isSelf = profile.id === currentUserId;
        const canEditRole =
          canManageRoles &&
          !isSelf &&
          member.role !== "owner" &&
          onRoleChange;

        return (
          <div
            key={profile.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition-smooth hover:bg-white/[0.04]"
          >
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
              onClick={() => onMemberClick?.(profile)}
              disabled={!onMemberClick}
            >
              <UserAvatar
                profile={profile}
                showPresence
                className="size-10 rounded-lg"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {getDisplayName(profile)}
                  {isSelf ? " (you)" : ""}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {getPresenceLabel(presence)} ·{" "}
                  {formatWorkspaceRole(member.role as WorkspaceMemberRole)}
                </p>
              </div>
            </button>

            {canEditRole ? (
              <RoleSelect
                role={member.role}
                onChange={(role) => onRoleChange(profile.id, role)}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function RoleSelect({
  role,
  onChange,
}: {
  role: string;
  onChange: (role: "admin" | "member") => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="relative">
      {isSaving ? (
        <Loader2 className="absolute right-2 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-gray-400" />
      ) : null}
      <select
        className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 pr-7 text-xs text-white outline-none"
        value={role === "admin" ? "admin" : "member"}
        disabled={isSaving}
        onChange={(event) => {
          const value = event.target.value as "admin" | "member";
          setIsSaving(true);
          void onChange(value).finally(() => setIsSaving(false));
        }}
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
