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

type CreateSectionDialogProps = {
  onCreated: () => void;
  workspaceId: string;
  trigger?: React.ReactNode;
};

export function CreateSectionDialog({
  onCreated,
  workspaceId,
  trigger,
}: CreateSectionDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/channel-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), workspaceId }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create section");
      }

      toast({ title: "Section created", description: `"${name.trim()}" is ready.` });
      setOpen(false);
      setName("");
      onCreated();
    } catch (err) {
      toast({
        title: "Could not create section",
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
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-gray-400 hover:text-white"
          >
            <Plus className="size-4" />
            Add section
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a section</DialogTitle>
          <DialogDescription>
            Group channels under a heading — like Engineering, Social, or Project teams.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="section-name">Section name</Label>
          <Input
            id="section-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Engineering"
            maxLength={50}
          />
        </div>
        <DialogFooter>
          <Button
            className="btn-brand w-full sm:w-auto"
            disabled={!name.trim() || isLoading}
            onClick={() => void handleCreate()}
          >
            {isLoading ? "Creating…" : "Create section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
