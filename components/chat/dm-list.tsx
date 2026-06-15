"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { StartDmDialog } from "@/components/chat/start-dm-dialog";
import { UserAvatar } from "@/components/user-avatar";
import { useToast } from "@/hooks/use-toast";
import type { DmConversation } from "@/lib/chat/sidebar";
import { getDisplayName } from "@/lib/profile/display";
import { dmChatPath } from "@/lib/workspace/paths";
import { cn } from "@/lib/utils";

type DmListProps = {
  dms: DmConversation[];
  activeChannelId?: string;
  currentUserId?: string;
  onRefresh: () => void;
  onDmStarted: (id: string) => void;
  onDmLeft: (channelId: string) => void;
};

export function DmList({
  dms,
  activeChannelId,
  currentUserId,
  onRefresh,
  onDmStarted,
  onDmLeft,
}: DmListProps) {
  const { toast } = useToast();

  const leaveDm = async (dm: DmConversation) => {
    const label = getDisplayName(dm.peer);
    if (!window.confirm(`Leave conversation with ${label}?`)) return;

    try {
      const res = await fetch(`/api/channels/${dm.id}/leave`, { method: "POST" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to leave");

      toast({ title: "Left", description: `You left the conversation with ${label}.` });
      onDmLeft(dm.id);
      onRefresh();
    } catch (err) {
      toast({
        title: "Leave failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const deleteDm = async (dm: DmConversation) => {
    const label = getDisplayName(dm.peer);
    if (!window.confirm(`Delete conversation with ${label}? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/channels/${dm.id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      toast({ title: "Deleted", description: `Conversation with ${label} was removed.` });
      onDmLeft(dm.id);
      onRefresh();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-1">
      <StartDmDialog onStarted={onDmStarted} />
      {dms.length === 0 ? (
        <p className="px-2 py-4 text-center text-xs text-muted-foreground">
          No direct messages yet — start one above.
        </p>
      ) : (
        dms.map((dm) => {
          const active = dm.id === activeChannelId;
          return (
            <div key={dm.id} className="group/dm flex items-center gap-0.5 pr-1">
              <Link
                href={dmChatPath(dm.id)}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-smooth",
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <UserAvatar profile={dm.peer} className="size-6" />
                <span className="truncate">{getDisplayName(dm.peer)}</span>
              </Link>
              {currentUserId && (
                <div className="flex shrink-0 opacity-0 transition-smooth group-hover/dm:opacity-100">
                  <button
                    type="button"
                    onClick={() => void leaveDm(dm)}
                    className="rounded-md p-1 text-gray-500 hover:bg-white/10 hover:text-gray-200"
                    aria-label="Leave conversation"
                    title="Leave conversation"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                  {dm.created_by === currentUserId && (
                    <button
                      type="button"
                      onClick={() => void deleteDm(dm)}
                      className="rounded-md p-1 text-gray-500 hover:bg-destructive/15 hover:text-destructive"
                      aria-label="Delete conversation"
                      title="Delete for everyone"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
