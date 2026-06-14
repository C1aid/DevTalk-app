import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

type Client = SupabaseClient<Database>;

const now = () => new Date().toISOString();

export async function archiveNote(supabase: Client, noteId: string) {
  const { error } = await supabase
    .from("notes")
    .update({ archived_at: now(), deleted_at: null })
    .eq("id", noteId);
  if (error) throw error;
}

export async function unarchiveNote(supabase: Client, noteId: string) {
  const { error } = await supabase
    .from("notes")
    .update({ archived_at: null })
    .eq("id", noteId);
  if (error) throw error;
}

export async function trashNote(supabase: Client, noteId: string) {
  const { error } = await supabase
    .from("notes")
    .update({ deleted_at: now(), archived_at: null })
    .eq("id", noteId);
  if (error) throw error;
}

export async function restoreNote(supabase: Client, noteId: string) {
  const { error } = await supabase
    .from("notes")
    .update({ deleted_at: null })
    .eq("id", noteId);
  if (error) throw error;
}

export async function permanentDeleteNote(supabase: Client, noteId: string) {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  if (error) throw error;
}
