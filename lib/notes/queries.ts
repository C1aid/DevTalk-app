import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CollaboratorPermission,
  Database,
  Note,
} from "@/lib/types/database";

type Client = SupabaseClient<Database>;

export type SharedNote = Note & {
  permission: CollaboratorPermission;
};

export type NoteLifecycle = "active" | "archived" | "trashed";

export function getNoteLifecycle(note: Pick<Note, "archived_at" | "deleted_at">): NoteLifecycle {
  if (note.deleted_at) return "trashed";
  if (note.archived_at) return "archived";
  return "active";
}

async function getCurrentUserId(supabase: Client) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function fetchOwnedNotes(supabase: Client): Promise<Note[]> {
  const userId = await getCurrentUserId(supabase);

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("owner_id", userId)
    .is("deleted_at", null)
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function fetchArchivedNotes(supabase: Client): Promise<Note[]> {
  const userId = await getCurrentUserId(supabase);

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("owner_id", userId)
    .is("deleted_at", null)
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function fetchTrashedNotes(supabase: Client): Promise<Note[]> {
  const userId = await getCurrentUserId(supabase);

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("owner_id", userId)
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function fetchSharedNotes(supabase: Client): Promise<SharedNote[]> {
  const userId = await getCurrentUserId(supabase);

  const { data: collaborations, error: collabError } = await supabase
    .from("collaborators")
    .select("note_id, permission")
    .eq("user_id", userId);

  if (collabError) throw collabError;
  if (!collaborations?.length) return [];

  const permissionByNote = new Map(
    collaborations.map((row) => [row.note_id, row.permission]),
  );

  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("*")
    .in("id", [...permissionByNote.keys()])
    .is("deleted_at", null)
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  if (notesError) throw notesError;

  return (notes ?? []).map((note) => ({
    ...(note as Note),
    permission: permissionByNote.get(note.id) as CollaboratorPermission,
  }));
}
