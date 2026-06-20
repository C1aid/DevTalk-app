"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Channel, ChannelPostingPermission } from "@/lib/types/database";

type ChannelSettingsPanelProps = {
  channel: Channel;
  onUpdated: (channel: Channel) => void;
  onClose: () => void;
};

export function ChannelSettingsPanel({
  channel,
  onUpdated,
  onClose,
}: ChannelSettingsPanelProps) {
  const { toast } = useToast();
  const [postingPermission, setPostingPermission] = useState<ChannelPostingPermission>(
    channel.posting_permission ?? "all_members",
  );
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/channels/${channel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posting_permission: postingPermission }),
      });

      const data = (await res.json()) as Channel & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save settings");
      }

      onUpdated(data);
      toast({ title: "Channel settings saved" });
      onClose();
    } catch (err) {
      toast({
        title: "Could not save settings",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 p-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Posting permissions</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          Control who can send messages in this channel. Use admins-only for
          announcement channels.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="posting-permission" className="text-xs text-gray-400">
          Who can post
        </Label>
        <select
          id="posting-permission"
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
          value={postingPermission}
          onChange={(event) =>
            setPostingPermission(event.target.value as ChannelPostingPermission)
          }
        >
          <option value="all_members">All members</option>
          <option value="admins_only">Admins only</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          className="text-gray-300 hover:bg-white/10 hover:text-white"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="btn-brand"
          disabled={isSaving}
          onClick={() => void save()}
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}
