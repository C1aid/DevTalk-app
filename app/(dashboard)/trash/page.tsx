"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { NoteCard } from "@/components/notes/note-card";
import { Card, CardContent } from "@/components/ui/card";
import { useNoteMutations } from "@/hooks/use-note-mutations";
import { createClient } from "@/lib/supabase/client";
import { fetchTrashedNotes } from "@/lib/notes/queries";
import { useUserStore } from "@/store/user-store";

export default function TrashPage() {
  const isLoadingProfile = useUserStore((s) => s.isLoading);
  const { restore, permanentDelete } = useNoteMutations();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["trashed-notes"],
    queryFn: async () => {
      const supabase = createClient();
      return fetchTrashedNotes(supabase);
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
        title="Trash"
        description="Deleted notes stay here until you restore or delete them permanently."
        icon={Trash2}
      />

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Trash2 className="mb-4 h-10 w-10 text-muted-foreground/60" />
            <p className="font-medium">Trash is empty</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Notes you delete will appear here for recovery.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              lifecycle="trashed"
              onRestore={(id) => restore.mutate(id)}
              onPermanentDelete={(id) => permanentDelete.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
