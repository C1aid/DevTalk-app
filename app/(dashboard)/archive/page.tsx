"use client";

import { useQuery } from "@tanstack/react-query";
import { Archive, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { NoteCard } from "@/components/notes/note-card";
import { Card, CardContent } from "@/components/ui/card";
import { useNoteMutations } from "@/hooks/use-note-mutations";
import { createClient } from "@/lib/supabase/client";
import { fetchArchivedNotes } from "@/lib/notes/queries";
import { useUserStore } from "@/store/user-store";

export default function ArchivePage() {
  const isLoadingProfile = useUserStore((s) => s.isLoading);
  const { unarchive, trash } = useNoteMutations();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["archived-notes"],
    queryFn: async () => {
      const supabase = createClient();
      return fetchArchivedNotes(supabase);
    },
  });

  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Archive"
        description="Archived notes are hidden from your main list but easy to restore."
        icon={Archive}
      />

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Archive className="mb-4 h-10 w-10 text-muted-foreground/60" />
            <p className="font-medium">No archived notes</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Archive notes you want to keep but don&apos;t need right now.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              lifecycle="archived"
              onUnarchive={(id) => unarchive.mutate(id)}
              onTrash={(id) => trash.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
