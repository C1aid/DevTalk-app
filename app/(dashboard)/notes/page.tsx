"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { NoteCard } from "@/components/notes/note-card";
import { UpgradePrompt } from "@/components/upgrade-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNoteMutations } from "@/hooks/use-note-mutations";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { fetchOwnedNotes } from "@/lib/notes/queries";
import {
  canCreateNote,
  FREE_NOTE_LIMIT,
  type Note,
} from "@/lib/types/database";
import { useUserStore } from "@/store/user-store";

export default function NotesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const profile = useUserStore((s) => s.profile);
  const isLoadingProfile = useUserStore((s) => s.isLoading);
  const [isCreating, setIsCreating] = useState(false);
  const { archive, trash } = useNoteMutations();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const supabase = createClient();
      return fetchOwnedNotes(supabase);
    },
  });

  const handleCreate = async () => {
    if (!profile) {
      toast({
        title: "Could not create note",
        description:
          "Profile not loaded. Run Supabase migrations (see README → Supabase & Stripe).",
        variant: "destructive",
      });
      return;
    }

    if (!canCreateNote(profile.subscription_tier, notes.length)) {
      toast({
        title: "Note limit reached",
        description: `Free plan allows up to ${FREE_NOTE_LIMIT} active notes. Upgrade to Premium.`,
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("notes")
        .insert({
          owner_id: user.id,
          title: "Untitled Note",
          content: { type: "doc", content: [{ type: "paragraph" }] },
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/notes/${(data as Note).id}`);
    } catch (err) {
      toast({
        title: "Could not create note",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const atNoteLimit =
    profile && !canCreateNote(profile.subscription_tier, notes.length);

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
        title="My Notes"
        description={
          profile?.subscription_tier === "free"
            ? `${notes.length}/${FREE_NOTE_LIMIT} active notes`
            : `${notes.length} active notes`
        }
        action={
          <Button
            className="btn-brand"
            onClick={() => void handleCreate()}
            disabled={isCreating}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isCreating ? "Creating..." : "New note"}
          </Button>
        }
      />

      {atNoteLimit && <UpgradePrompt reason="note_limit" noteCount={notes.length} />}

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="mb-4 text-gray-300">No notes yet</p>
            <Button className="btn-brand" onClick={() => void handleCreate()}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              lifecycle="active"
              onArchive={(id) => archive.mutate(id)}
              onTrash={(id) => trash.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
