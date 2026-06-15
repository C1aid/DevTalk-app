"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { useToast } from "@/hooks/use-toast";
import { getDisplayName } from "@/lib/profile/display";
import type { Profile } from "@/lib/types/database";

type StartDmDialogProps = {
  onStarted: (channelId: string) => void;
  trigger?: React.ReactNode;
};

export function StartDmDialog({ onStarted, trigger }: StartDmDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const searchUsers = async (q: string) => {
    setIsSearching(true);
    try {
      const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
      const res = await fetch(`/api/users${params}`);
      if (res.ok) {
        setUsers((await res.json()) as Profile[]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setUsers([]);
      setQuery("");
    }
  };

  const startDm = async (userId: string) => {
    setIsStarting(true);
    try {
      const res = await fetch("/api/dms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok || !data.id) {
        throw new Error(data.error ?? "Failed to start conversation");
      }

      setOpen(false);
      onStarted(data.id);
    } catch (err) {
      toast({
        title: "Could not start DM",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-gray-400 hover:text-white"
          >
            <MessageSquarePlus className="size-4" />
            New message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New direct message</DialogTitle>
          <DialogDescription>
            Start a private conversation with someone on DevTalk.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            void searchUsers(e.target.value);
          }}
          placeholder="Search by name or email…"
        />
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {isSearching ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Searching…</p>
          ) : users.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {query.trim().length < 2
                ? "Type at least 2 characters to search"
                : "No users found"}
            </p>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                type="button"
                disabled={isStarting}
                onClick={() => void startDm(user.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-smooth hover:bg-white/5"
              >
                <UserAvatar profile={user} className="size-9" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {getDisplayName(user)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
