import type { Channel, WorkspaceMemberRole } from "@/lib/types/database";

export type ChannelPostingPermission = "all_members" | "admins_only";

export function isWorkspaceAdmin(role: string | null | undefined): boolean {
  return role === "owner" || role === "admin";
}

export function canManageChannel(
  workspaceRole: string | null | undefined,
  channelCreatedBy: string | null | undefined,
  userId: string | null | undefined,
): boolean {
  if (!userId) return false;
  if (isWorkspaceAdmin(workspaceRole)) return true;
  return channelCreatedBy === userId;
}

export function canPostInChannel(
  channel: Pick<Channel, "posting_permission" | "kind"> | null,
  workspaceRole: string | null | undefined,
  isChannelOwner: boolean,
): boolean {
  if (!channel) return false;
  if (channel.kind === "dm") return true;
  if (channel.posting_permission !== "admins_only") return true;
  return isWorkspaceAdmin(workspaceRole) || isChannelOwner;
}

export function formatWorkspaceRole(role: WorkspaceMemberRole): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    default:
      return "Member";
  }
}
