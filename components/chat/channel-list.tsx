"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Hash, Lock, LogOut, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateChannelDialog } from "@/components/chat/create-channel-dialog";
import { CreateSectionDialog } from "@/components/chat/create-section-dialog";
import { useToast } from "@/hooks/use-toast";
import type { SidebarData } from "@/lib/chat/sidebar";
import type { Channel, ChannelSection } from "@/lib/types/database";
import { workspaceChannelPath } from "@/lib/workspace/paths";
import { cn } from "@/lib/utils";

const DEFAULT_SECTION_NAME = "channels";

type ChannelListProps = {
  sidebar: SidebarData;
  workspaceSlug: string;
  activeChannelId?: string;
  currentUserId?: string;
  onRefresh: () => void;
  onChannelCreated: (id: string) => void;
  onChannelDeleted: (channelId: string) => void;
};

function ChannelRow({
  channel,
  workspaceSlug,
  active,
  canDelete,
  canLeave,
  onDelete,
  onLeave,
}: {
  channel: Channel;
  workspaceSlug: string;
  active: boolean;
  canDelete: boolean;
  canLeave: boolean;
  onDelete: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="group/channel flex items-center gap-0.5 pr-1">
      <Link
        href={workspaceChannelPath(workspaceSlug, channel.id)}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-smooth",
          active
            ? "bg-white/10 font-medium text-white"
            : "text-gray-300 hover:bg-white/5 hover:text-white",
        )}
      >
        {channel.visibility === "private" ? (
          <Lock className="size-4 shrink-0 opacity-70" />
        ) : (
          <Hash className="size-4 shrink-0 opacity-70" />
        )}
        <span className="truncate">{channel.name}</span>
      </Link>
      {(canLeave || canDelete) && (
        <div className="flex shrink-0 opacity-0 transition-smooth group-hover/channel:opacity-100">
          {canLeave && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLeave();
              }}
              className="rounded-md p-1 text-gray-500 hover:bg-white/10 hover:text-gray-200"
              aria-label={`Leave ${channel.name}`}
              title="Leave channel"
            >
              <LogOut className="size-3.5" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-md p-1 text-gray-500 hover:bg-destructive/15 hover:text-destructive"
              aria-label={`Delete ${channel.name}`}
              title="Delete channel"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  section,
  channels,
  workspaceSlug,
  activeChannelId,
  currentUserId,
  canDeleteSection,
  onDeleteSection,
  onDeleteChannel,
  onLeaveChannel,
  defaultOpen = true,
}: {
  section: ChannelSection;
  channels: Channel[];
  workspaceSlug: string;
  activeChannelId?: string;
  currentUserId?: string;
  canDeleteSection: boolean;
  onDeleteSection: () => void;
  onDeleteChannel: (channel: Channel) => void;
  onLeaveChannel: (channel: Channel) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="group/section mb-1">
      <div className="flex items-center gap-0.5 pr-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-200"
        >
          {open ? (
            <ChevronDown className="size-3.5 shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0" />
          )}
          <span className="truncate uppercase tracking-wide">{section.name}</span>
        </button>
        {canDeleteSection && (
          <button
            type="button"
            onClick={onDeleteSection}
            className="shrink-0 rounded-md p-1 text-gray-500 opacity-0 transition-smooth hover:bg-destructive/15 hover:text-destructive group-hover/section:opacity-100"
            aria-label={`Delete section ${section.name}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
      {open && (
        <div className="space-y-0.5">
          {channels.length === 0 ? (
            <p className="px-6 py-1 text-[11px] text-gray-500">No channels</p>
          ) : (
            channels.map((ch) => (
              <ChannelRow
                key={ch.id}
                channel={ch}
                workspaceSlug={workspaceSlug}
                active={ch.id === activeChannelId}
                canDelete={ch.created_by === currentUserId}
                canLeave={
                  !!currentUserId &&
                  ch.created_by !== currentUserId &&
                  ch.kind === "channel"
                }
                onDelete={() => onDeleteChannel(ch)}
                onLeave={() => onLeaveChannel(ch)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function ChannelList({
  sidebar,
  workspaceSlug,
  activeChannelId,
  currentUserId,
  onRefresh,
  onChannelCreated,
  onChannelDeleted,
}: ChannelListProps) {
  const { toast } = useToast();

  const channelsBySection = useMemo(() => {
    const map = new Map<string, Channel[]>();
    for (const section of sidebar.sections) {
      map.set(section.id, []);
    }
    map.set("uncategorized", []);

    for (const ch of sidebar.channels) {
      const key = ch.section_id ?? "uncategorized";
      const list = map.get(key) ?? map.get("uncategorized")!;
      list.push(ch);
      map.set(key, list);
    }
    return map;
  }, [sidebar]);

  const hasAnyChannels = sidebar.channels.length > 0;

  const deleteChannel = async (
    channelId: string,
    kind: Channel["kind"],
    name?: string,
  ) => {
    const label = kind === "dm" ? "conversation" : `#${name ?? "channel"}`;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/channels/${channelId}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to delete channel");
      }

      toast({ title: "Deleted", description: `${label} was removed.` });
      onChannelDeleted(channelId);
      onRefresh();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const leaveChannel = async (
    channelId: string,
    kind: Channel["kind"],
    name?: string,
  ) => {
    const label = kind === "dm" ? "conversation" : `#${name ?? "channel"}`;
    if (!window.confirm(`Leave ${label}?`)) return;

    try {
      const res = await fetch(`/api/channels/${channelId}/leave`, {
        method: "POST",
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to leave");
      }

      toast({ title: "Left", description: `You left ${label}.` });
      onChannelDeleted(channelId);
      onRefresh();
    } catch (err) {
      toast({
        title: "Leave failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const deleteSection = async (section: ChannelSection) => {
    if (
      !window.confirm(
        `Delete section "${section.name}"? Channels will move to Other.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/channel-sections/${section.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to delete section");
      }

      toast({ title: "Section deleted", description: `"${section.name}" was removed.` });
      onRefresh();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const canDeleteSection = (section: ChannelSection) =>
    section.name.toLowerCase() !== DEFAULT_SECTION_NAME;

  return (
    <div className="space-y-3">
      {sidebar.sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          channels={channelsBySection.get(section.id) ?? []}
          workspaceSlug={workspaceSlug}
          activeChannelId={activeChannelId}
          currentUserId={currentUserId}
          canDeleteSection={canDeleteSection(section)}
          onDeleteSection={() => void deleteSection(section)}
          onDeleteChannel={(ch) => void deleteChannel(ch.id, ch.kind, ch.name)}
          onLeaveChannel={(ch) => void leaveChannel(ch.id, ch.kind, ch.name)}
        />
      ))}

      {(channelsBySection.get("uncategorized")?.length ?? 0) > 0 && (
        <SectionBlock
          section={{
            id: "uncategorized",
            name: "Other",
            sort_order: 999,
            workspace_id: sidebar.workspace.id,
            created_at: "",
          }}
          channels={channelsBySection.get("uncategorized") ?? []}
          workspaceSlug={workspaceSlug}
          activeChannelId={activeChannelId}
          currentUserId={currentUserId}
          canDeleteSection={false}
          onDeleteSection={() => undefined}
          onDeleteChannel={(ch) => void deleteChannel(ch.id, ch.kind, ch.name)}
          onLeaveChannel={(ch) => void leaveChannel(ch.id, ch.kind, ch.name)}
        />
      )}

      {!hasAnyChannels && (
        <p className="px-2 py-2 text-center text-xs text-muted-foreground">
          No channels yet — create one below.
        </p>
      )}

      <div className="space-y-1 border-t border-white/10 pt-2">
        <CreateChannelDialog
          sections={sidebar.sections}
          workspaceId={sidebar.workspace.id}
          onCreated={onChannelCreated}
        />
        <CreateSectionDialog
          workspaceId={sidebar.workspace.id}
          onCreated={onRefresh}
        />
      </div>
    </div>
  );
}

export function EmptyChannelsState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 pb-8 text-center sm:min-h-[60vh]">
      <h1 className="text-2xl font-semibold text-white">Welcome to DevTalk</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Create your first channel below, or open DMs from the left rail.
      </p>
    </div>
  );
}
