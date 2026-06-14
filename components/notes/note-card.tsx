"use client";

import {
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NoteLifecycle } from "@/lib/notes/queries";
import type { Note } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

type NoteCardProps = {
  note: Note;
  lifecycle: NoteLifecycle;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  dateLabel?: string;
};

export function NoteCard({
  note,
  lifecycle,
  onArchive,
  onUnarchive,
  onTrash,
  onRestore,
  onPermanentDelete,
  dateLabel = "Updated",
}: NoteCardProps) {
  const displayDate =
    lifecycle === "archived" && note.archived_at
      ? note.archived_at
      : lifecycle === "trashed" && note.deleted_at
        ? note.deleted_at
        : note.updated_at;

  const datePrefix =
    lifecycle === "archived"
      ? "Archived"
      : lifecycle === "trashed"
        ? "Deleted"
        : dateLabel;

  return (
    <Card className="group relative transition-smooth hover:border-white/25">
      <Link href={`/notes/${note.id}`}>
        <CardHeader>
          <CardTitle className="line-clamp-1">{note.title}</CardTitle>
          <CardDescription>
            {datePrefix} {formatDate(displayDate)}
          </CardDescription>
        </CardHeader>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {lifecycle === "active" && onArchive && (
            <DropdownMenuItem onClick={() => onArchive(note.id)}>
              <Archive className="size-4" />
              Archive
            </DropdownMenuItem>
          )}
          {lifecycle === "archived" && onUnarchive && (
            <DropdownMenuItem onClick={() => onUnarchive(note.id)}>
              <ArchiveRestore className="size-4" />
              Unarchive
            </DropdownMenuItem>
          )}
          {lifecycle === "trashed" && onRestore && (
            <DropdownMenuItem onClick={() => onRestore(note.id)}>
              <RotateCcw className="size-4" />
              Restore
            </DropdownMenuItem>
          )}
          {lifecycle !== "trashed" && onTrash && (
            <>
              {(lifecycle === "active" || lifecycle === "archived") && (
                <DropdownMenuSeparator />
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onTrash(note.id)}
              >
                <Trash2 className="size-4" />
                Move to trash
              </DropdownMenuItem>
            </>
          )}
          {lifecycle === "trashed" && onPermanentDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  if (window.confirm("Delete this note permanently? This cannot be undone.")) {
                    onPermanentDelete(note.id);
                  }
                }}
              >
                <Trash2 className="size-4" />
                Delete forever
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
