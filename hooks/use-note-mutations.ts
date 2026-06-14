"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  archiveNote,
  permanentDeleteNote,
  restoreNote,
  trashNote,
  unarchiveNote,
} from "@/lib/notes/actions";
import { createClient } from "@/lib/supabase/client";

export function useNoteMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["notes"] });
    void queryClient.invalidateQueries({ queryKey: ["archived-notes"] });
    void queryClient.invalidateQueries({ queryKey: ["trashed-notes"] });
    void queryClient.invalidateQueries({ queryKey: ["shared-notes"] });
  };

  const archive = useMutation({
    mutationFn: async (noteId: string) => {
      const supabase = createClient();
      await archiveNote(supabase, noteId);
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Note archived" });
    },
    onError: (err: Error) => {
      toast({ title: "Could not archive note", description: err.message, variant: "destructive" });
    },
  });

  const unarchive = useMutation({
    mutationFn: async (noteId: string) => {
      const supabase = createClient();
      await unarchiveNote(supabase, noteId);
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Note restored to Notes" });
    },
    onError: (err: Error) => {
      toast({ title: "Could not restore note", description: err.message, variant: "destructive" });
    },
  });

  const trash = useMutation({
    mutationFn: async (noteId: string) => {
      const supabase = createClient();
      await trashNote(supabase, noteId);
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Note moved to Trash" });
    },
    onError: (err: Error) => {
      toast({ title: "Could not move note to trash", description: err.message, variant: "destructive" });
    },
  });

  const restore = useMutation({
    mutationFn: async (noteId: string) => {
      const supabase = createClient();
      await restoreNote(supabase, noteId);
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Note restored" });
    },
    onError: (err: Error) => {
      toast({ title: "Could not restore note", description: err.message, variant: "destructive" });
    },
  });

  const permanentDelete = useMutation({
    mutationFn: async (noteId: string) => {
      const supabase = createClient();
      await permanentDeleteNote(supabase, noteId);
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Note permanently deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Could not delete note", description: err.message, variant: "destructive" });
    },
  });

  return { archive, unarchive, trash, restore, permanentDelete, invalidate };
}
