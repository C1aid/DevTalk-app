export function buildDmKey(userA: string, userB: string): string {
  return [userA, userB].sort().join("_");
}

export type DmConversation = {
  id: string;
  dm_key: string;
  created_by: string;
  peer: {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export type SidebarData = {
  workspace: import("@/lib/types/database").Workspace;
  sections: import("@/lib/types/database").ChannelSection[];
  channels: import("@/lib/types/database").Channel[];
  dms: DmConversation[];
};
