"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/user-store";
import { FREE_HISTORY_DAYS } from "@/lib/types/database";

export default function SearchPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search"
        description={
          profile?.subscription_tier === "free"
            ? `Search messages from the last ${FREE_HISTORY_DAYS} days`
            : "Search across all message history"
        }
        icon={Search}
      />

      <div className="glass-card p-4 sm:p-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages…"
          className="mb-4"
        />
        <p className="text-sm text-muted-foreground">
          Open a channel and use the search bar in the channel header for full-text
          search. Global search across all channels is coming soon.
        </p>
        {query && (
          <button
            type="button"
            className="mt-4 text-sm text-primary hover:underline"
            onClick={() => router.push("/channels")}
          >
            Go to channels →
          </button>
        )}
      </div>
    </div>
  );
}
