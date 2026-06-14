"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { fetchSharedNotes } from "@/lib/notes/queries";
import { formatDate } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

export default function SharedPage() {
  const isLoadingProfile = useUserStore((s) => s.isLoading);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["shared-notes"],
    queryFn: async () => {
      const supabase = createClient();
      return fetchSharedNotes(supabase);
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
        title="Shared with me"
        description="Notes others have invited you to collaborate on."
        icon={Users}
      />

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="mb-4 h-10 w-10 text-muted-foreground/60" />
            <p className="mb-2 font-medium">No shared notes yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              When someone invites you to a note, it will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="h-full transition-smooth hover:border-white/25">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                  <CardDescription>
                    Updated {formatDate(note.updated_at)} ·{" "}
                    {note.permission === "write" ? "Can edit" : "View only"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
