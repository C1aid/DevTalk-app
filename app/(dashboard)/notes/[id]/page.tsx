"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { RealtimeNoteSync } from "@/components/collaboration/realtime-note-sync";
import { NoteEditor } from "@/components/editor/note-editor";
import { NoteDetailHeader } from "@/components/notes/note-detail-header";
import { Button } from "@/components/ui/button";
import { useNoteMutations } from "@/hooks/use-note-mutations";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { getNoteLifecycle } from "@/lib/notes/queries";
import type { JSONContent } from "@tiptap/core";
import type { CollaboratorPermission, Note } from "@/lib/types/database";
import { debounce } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = params.id as string;
  const shareToken = searchParams.get("token");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const profile = useUserStore((s) => s.profile);
  const { archive, unarchive, trash, restore, permanentDelete } = useNoteMutations();
  const [title, setTitle] = useState("Untitled Note");
  const [content, setContent] = useState<JSONContent>({
    type: "doc",
    content: [{ type: "paragraph" }],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isRemoteUpdate = useRef(false);
  const userIdRef = useRef<string>("");
  const emailRef = useRef<string>("");

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userIdRef.current = user.id;
        emailRef.current = user.email ?? "user";
      }

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) throw error;

      if (shareToken && data.share_token !== shareToken) {
        throw new Error("Invalid share token");
      }

      return data as Note;
    },
  });

  const isOwner = note?.owner_id === profile?.id;
  const lifecycle = note ? getNoteLifecycle(note) : "active";

  const { data: collaboration } = useQuery({
    queryKey: ["collaboration", noteId, profile?.id],
    enabled: !!note && !!profile && !isOwner,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("collaborators")
        .select("permission")
        .eq("note_id", noteId)
        .eq("user_id", profile!.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content as JSONContent);
      setLastSaved(new Date(note.updated_at));
    }
  }, [note]);

  const saveNote = useMutation({
    mutationFn: async (updates: { title?: string; content?: JSONContent }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("notes")
        .update({
          ...updates,
          content: updates.content as Note["content"],
        })
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      setLastSaved(new Date());
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
      void queryClient.invalidateQueries({ queryKey: ["archived-notes"] });
      void queryClient.invalidateQueries({ queryKey: ["shared-notes"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Save failed",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: () => setIsSaving(false),
  });

  const debouncedSave = useCallback(
    debounce((updates: { title?: string; content?: JSONContent }) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }
      setIsSaving(true);
      saveNote.mutate(updates);
    }, 800),
    [noteId],
  );

  const handleContentChange = (newContent: JSONContent) => {
    setContent(newContent);
    debouncedSave({ content: newContent, title });
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave({ title: newTitle, content });
  };

  const handleRemoteUpdate = useCallback(
    (updated: Pick<Note, "title" | "content" | "updated_at">) => {
      isRemoteUpdate.current = true;
      setTitle(updated.title);
      setContent(updated.content as JSONContent);
      setLastSaved(new Date(updated.updated_at));
    },
    [],
  );

  const isPremium = profile?.subscription_tier === "premium";
  const canWrite =
    lifecycle !== "trashed" &&
    (isOwner || collaboration?.permission === "write");
  const role = isOwner
    ? "owner"
    : collaboration?.permission === "write"
      ? "write"
      : "read";

  const backHref = !isOwner
    ? "/shared"
    : lifecycle === "archived"
      ? "/archive"
      : lifecycle === "trashed"
        ? "/trash"
        : "/notes";

  const backLabel = !isOwner
    ? "Back to shared"
    : lifecycle === "archived"
      ? "Back to archive"
      : lifecycle === "trashed"
        ? "Back to trash"
        : "Back to notes";

  const isActionPending =
    archive.isPending ||
    unarchive.isPending ||
    trash.isPending ||
    restore.isPending ||
    permanentDelete.isPending;

  const redirectAfterLifecycleChange = (target: "/notes" | "/archive" | "/trash") => {
    void queryClient.invalidateQueries({ queryKey: ["note", noteId] });
    router.push(target);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Note not found</p>
        <Button asChild className="mt-4">
          <Link href="/notes">Back to notes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {userIdRef.current && emailRef.current && lifecycle !== "trashed" && (
        <RealtimeNoteSync
          noteId={noteId}
          userId={userIdRef.current}
          email={emailRef.current}
          onRemoteUpdate={handleRemoteUpdate}
        />
      )}

      <NoteDetailHeader
        backHref={backHref}
        backLabel={backLabel}
        role={role}
        lifecycle={lifecycle}
        isSaving={isSaving}
        lastSaved={lastSaved}
        createdAt={note.created_at}
        updatedAt={note.updated_at}
        noteId={noteId}
        shareToken={note.share_token}
        isPremium={isPremium}
        isOwner={isOwner}
        isActionPending={isActionPending}
        onArchive={
          isOwner && lifecycle === "active"
            ? () =>
                archive.mutate(noteId, {
                  onSuccess: () => redirectAfterLifecycleChange("/archive"),
                })
            : undefined
        }
        onUnarchive={
          isOwner && lifecycle === "archived"
            ? () =>
                unarchive.mutate(noteId, {
                  onSuccess: () => redirectAfterLifecycleChange("/notes"),
                })
            : undefined
        }
        onTrash={
          isOwner && lifecycle !== "trashed"
            ? () =>
                trash.mutate(noteId, {
                  onSuccess: () => redirectAfterLifecycleChange("/trash"),
                })
            : undefined
        }
        onRestore={
          isOwner && lifecycle === "trashed"
            ? () =>
                restore.mutate(noteId, {
                  onSuccess: () => redirectAfterLifecycleChange("/notes"),
                })
            : undefined
        }
        onPermanentDelete={
          isOwner && lifecycle === "trashed"
            ? () => {
                if (window.confirm("Delete this note permanently? This cannot be undone.")) {
                  permanentDelete.mutate(noteId, {
                    onSuccess: () => router.push("/trash"),
                  });
                }
              }
            : undefined
        }
      />

      {lifecycle === "trashed" && isOwner && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          This note is in Trash. Restore it to edit again, or delete it permanently.
        </div>
      )}

      <NoteEditor
        title={title}
        content={content}
        onChange={handleContentChange}
        onTitleChange={canWrite ? handleTitleChange : undefined}
        editable={canWrite}
      />
    </div>
  );
}
