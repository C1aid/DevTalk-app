"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StartDmDialog } from "@/components/chat/start-dm-dialog";
import type { DmConversation } from "@/lib/chat/sidebar";
import { dmChatPath } from "@/lib/workspace/paths";

export default function DmsPage() {
  const router = useRouter();
  const [dms, setDms] = useState<DmConversation[]>([]);

  useEffect(() => {
    void fetch("/api/dms")
      .then((r) => r.json())
      .then((data) => setDms(data as DmConversation[]));
  }, []);

  useEffect(() => {
    const first = dms[0];
    if (first && window.matchMedia("(min-width: 1024px)").matches) {
      router.replace(dmChatPath(first.id));
    }
  }, [dms, router]);

  return (
    <div className="lg:mx-auto lg:max-w-3xl">
      <PageHeader
        title="Direct messages"
        description="Private conversations with your teammates."
        icon={MessageSquare}
      />

      <div className="glass-card mt-6 overflow-hidden lg:hidden">
        <div className="border-b border-white/10 p-4">
          <StartDmDialog
            onStarted={(id) => router.push(dmChatPath(id))}
            trigger={
              <button
                type="button"
                className="w-full rounded-lg border border-dashed border-white/20 px-4 py-3 text-sm text-gray-300 transition-smooth hover:border-white/40 hover:text-white"
              >
                + New message
              </button>
            }
          />
        </div>

        {dms.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No direct messages yet. Start a conversation above.
          </p>
        )}
      </div>

      <div className="mt-12 hidden flex-col items-center justify-center px-4 text-center lg:flex lg:min-h-[50vh]">
        <MessageSquare className="mb-4 size-12 text-gray-500" strokeWidth={1.25} />
        <h2 className="text-xl font-semibold text-white">Your DMs</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Select a conversation from the sidebar, or start a new one.
        </p>
        <div className="mt-6">
          <StartDmDialog
            onStarted={(id) => router.push(dmChatPath(id))}
            trigger={
              <button
                type="button"
                className="btn-brand rounded-lg px-6 py-2.5 text-sm font-medium"
              >
                New message
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
