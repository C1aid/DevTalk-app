"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Archive,
  ArchiveRestore,
  Check,
  Cloud,
  Copy,
  Crown,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { ActiveCollaborators } from "@/components/collaboration/active-collaborators";
import { ShareNoteDialog } from "@/components/collaboration/share-note-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { NoteLifecycle } from "@/lib/notes/queries";

type NoteRole = "owner" | "write" | "read";

type NoteDetailHeaderProps = {
  backHref: string;
  backLabel: string;
  role: NoteRole;
  lifecycle: NoteLifecycle;
  isSaving: boolean;
  lastSaved: Date | null;
  createdAt: string;
  updatedAt: string;
  noteId: string;
  shareToken: string;
  isPremium: boolean;
  isOwner: boolean;
  onArchive?: () => void;
  onUnarchive?: () => void;
  onTrash?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  isActionPending?: boolean;
};

const roleConfig: Record<
  NoteRole,
  { label: string; icon: typeof Crown; className: string }
> = {
  owner: {
    label: "Owner",
    icon: Crown,
    className: "bg-white/10 text-white ring-white/20",
  },
  write: {
    label: "Can edit",
    icon: Pencil,
    className: "bg-white/10 text-white ring-white/20",
  },
  read: {
    label: "View only",
    icon: Eye,
    className: "bg-white/5 text-gray-300 ring-white/10",
  },
};

export function NoteDetailHeader({
  backHref,
  backLabel,
  role,
  lifecycle,
  isSaving,
  lastSaved,
  createdAt,
  updatedAt,
  noteId,
  shareToken,
  isPremium,
  isOwner,
  onArchive,
  onUnarchive,
  onTrash,
  onRestore,
  onPermanentDelete,
  isActionPending,
}: NoteDetailHeaderProps) {
  const { toast } = useToast();
  const RoleIcon = roleConfig[role].icon;

  const copyLink = async () => {
    const url = `${window.location.origin}/notes/${noteId}?token=${shareToken}`;
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied", description: "Note link copied to clipboard." });
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="liquid-glass rounded-xl px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-300 transition-smooth hover:bg-white/10 hover:text-white"
          >
            <Link href={backHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                roleConfig[role].className,
              )}
            >
              <RoleIcon className="size-3" />
              {roleConfig[role].label}
            </span>

            <ActiveCollaborators />

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span>Saving…</span>
                </>
              ) : lastSaved ? (
                <>
                  <Check className="size-3.5 text-primary" />
                  <span>Saved {formatRelativeTime(lastSaved)}</span>
                </>
              ) : (
                <>
                  <Cloud className="size-3.5" />
                  <span>Auto-save on</span>
                </>
              )}
            </div>

            {isOwner && lifecycle === "active" && (
              <ShareNoteDialog
                noteId={noteId}
                shareToken={shareToken}
                isPremium={isPremium}
              />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 transition-smooth hover:bg-white/10 hover:text-white"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => void copyLink()}>
                  <Copy className="size-4" />
                  Copy link
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    {lifecycle === "active" && onArchive && (
                      <DropdownMenuItem
                        disabled={isActionPending}
                        onClick={onArchive}
                      >
                        <Archive className="size-4" />
                        Archive
                      </DropdownMenuItem>
                    )}
                    {lifecycle === "archived" && onUnarchive && (
                      <DropdownMenuItem
                        disabled={isActionPending}
                        onClick={onUnarchive}
                      >
                        <ArchiveRestore className="size-4" />
                        Unarchive
                      </DropdownMenuItem>
                    )}
                    {lifecycle === "trashed" && onRestore && (
                      <DropdownMenuItem
                        disabled={isActionPending}
                        onClick={onRestore}
                      >
                        <RotateCcw className="size-4" />
                        Restore
                      </DropdownMenuItem>
                    )}
                    {lifecycle !== "trashed" && onTrash && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        disabled={isActionPending}
                        onClick={onTrash}
                      >
                        <Trash2 className="size-4" />
                        Move to trash
                      </DropdownMenuItem>
                    )}
                    {lifecycle === "trashed" && onPermanentDelete && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        disabled={isActionPending}
                        onClick={onPermanentDelete}
                      >
                        <Trash2 className="size-4" />
                        Delete forever
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-muted-foreground">
        <span>Created {formatDate(createdAt)}</span>
        <span>Updated {formatDate(updatedAt)}</span>
      </div>
    </div>
  );
}
