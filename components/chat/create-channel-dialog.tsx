"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChannelSection } from "@/lib/types/database";
import { useToast } from "@/hooks/use-toast";

type CreateChannelDialogProps = {
  onCreated: (channelId: string) => void;
  sections?: ChannelSection[];
  workspaceId: string;
};

export function CreateChannelDialog({
  onCreated,
  sections = [],
  workspaceId,
}: CreateChannelDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [sectionId, setSectionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          visibility,
          sectionId: sectionId || undefined,
          workspaceId,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create channel");
      }

      toast({ title: "Channel created", description: `#${name} is ready.` });
      setOpen(false);
      setName("");
      setDescription("");
      if (data.id) onCreated(data.id);
    } catch (err) {
      toast({
        title: "Could not create channel",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-gray-300">
          <Plus className="size-4" />
          New channel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
          <DialogDescription>
            Channels are where your team communicates. Names use lowercase and hyphens.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Name</Label>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">#</span>
              <Input
                id="channel-name"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="general"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-desc">Description (optional)</Label>
            <Input
              id="channel-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-section">Section</Label>
            <select
              id="channel-section"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Default (Channels)</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-vis">Visibility</Label>
            <select
              id="channel-vis"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "public" | "private")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="public">Public — anyone can join</option>
              <option value="private">Private — invite only</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="btn-brand w-full sm:w-auto"
            disabled={!name.trim() || isLoading}
            onClick={() => void handleCreate()}
          >
            {isLoading ? "Creating…" : "Create channel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
