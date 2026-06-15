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
import { useToast } from "@/hooks/use-toast";

type CreateWorkspaceDialogProps = {
  onCreated: (slug: string) => void;
  trigger?: React.ReactNode;
};

export function CreateWorkspaceDialog({ onCreated, trigger }: CreateWorkspaceDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { slug?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create workspace");
      }

      toast({
        title: "Workspace created",
        description: `"${name.trim()}" is ready.`,
      });
      setOpen(false);
      setName("");
      setDescription("");
      if (data.slug) onCreated(data.slug);
    } catch (err) {
      toast({
        title: "Could not create workspace",
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
        {trigger ?? (
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-gray-300">
            <Plus className="size-4" />
            Create workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a workspace</DialogTitle>
          <DialogDescription>
            A workspace is your team&apos;s home. You can add channels and sections
            inside it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Team"
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-desc">Description (optional)</Label>
            <Input
              id="workspace-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this team about?"
              maxLength={200}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="btn-brand w-full sm:w-auto"
            disabled={!name.trim() || isLoading}
            onClick={() => void handleCreate()}
          >
            {isLoading ? "Creating…" : "Create workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
