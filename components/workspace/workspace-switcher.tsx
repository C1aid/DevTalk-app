"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { workspacePath } from "@/lib/workspace/paths";
import type { Workspace } from "@/lib/types/database";
import { cn } from "@/lib/utils";

type WorkspaceWithRole = Workspace & { role?: string };

type WorkspaceSwitcherProps = {
  currentSlug: string;
  currentName: string;
  currentWorkspaceId?: string;
  isOwner?: boolean;
  onWorkspaceCreated: (slug: string) => void;
  onLeft?: () => void;
};

export function WorkspaceSwitcher({
  currentSlug,
  currentName,
  currentWorkspaceId,
  isOwner,
  onWorkspaceCreated,
  onLeft,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadWorkspaces = useCallback(async () => {
    const res = await fetch("/api/workspaces");
    if (res.ok) {
      setWorkspaces((await res.json()) as WorkspaceWithRole[]);
    }
  }, []);

  useEffect(() => {
    void loadWorkspaces();
  }, [loadWorkspaces, currentSlug]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const deleteWorkspace = async () => {
    if (!currentWorkspaceId) return;
    if (!window.confirm(`Delete workspace "${currentName}"? All channels will be removed.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/workspaces/${currentWorkspaceId}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to delete");

      toast({ title: "Workspace deleted", description: `"${currentName}" was removed.` });
      const remaining = workspaces.filter((w) => w.id !== currentWorkspaceId);
      if (remaining[0]) {
        router.push(workspacePath(remaining[0].slug));
      } else {
        router.push("/w/new");
      }
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const leaveWorkspace = async () => {
    if (!currentWorkspaceId) return;
    if (!window.confirm(`Leave workspace "${currentName}"?`)) return;

    try {
      const res = await fetch(`/api/workspaces/${currentWorkspaceId}/leave`, {
        method: "POST",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to leave");

      toast({ title: "Left workspace", description: `You left "${currentName}".` });
      onLeft?.();
      const remaining = workspaces.filter((w) => w.id !== currentWorkspaceId);
      if (remaining[0]) {
        router.push(workspacePath(remaining[0].slug));
      } else {
        router.push("/w/new");
      }
    } catch (err) {
      toast({
        title: "Leave failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div ref={containerRef} className="relative mb-3 px-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-smooth hover:bg-white/5"
      >
        <span className="truncate text-lg font-semibold tracking-tight text-white">
          {currentName}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-gray-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-1 right-1 top-full z-50 mt-1 rounded-xl border border-white/10 bg-[#1a1a1a] py-1 shadow-xl">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Workspaces
          </p>
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={workspacePath(ws.slug)}
              onClick={() => setOpen(false)}
              className={cn(
                "block truncate px-3 py-2 text-sm transition-smooth hover:bg-white/5",
                ws.slug === currentSlug
                  ? "font-medium text-white"
                  : "text-gray-300",
              )}
            >
              {ws.name}
            </Link>
          ))}

          <div className="my-1 border-t border-white/10" />

          <CreateWorkspaceDialog
            onCreated={(slug) => {
              setOpen(false);
              void loadWorkspaces();
              onWorkspaceCreated(slug);
            }}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 rounded-none px-3 text-gray-300 hover:text-white"
              >
                <Plus className="size-4" />
                Create workspace
              </Button>
            }
          />

          {currentWorkspaceId && (
            <>
              <div className="my-1 border-t border-white/10" />
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => void deleteWorkspace()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-smooth hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" />
                  Delete workspace
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void leaveWorkspace()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 transition-smooth hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="size-3.5" />
                  Leave workspace
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
