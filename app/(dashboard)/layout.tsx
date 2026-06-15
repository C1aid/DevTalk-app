"use client";

import { AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DashboardSidebar,
  showSecondarySidebar,
} from "@/components/dashboard-sidebar";
import { IconRail } from "@/components/dashboard/icon-rail";
import type { Profile } from "@/lib/types/database";
import { isChannelChatRoute } from "@/lib/workspace/paths";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChat = isChannelChatRoute(pathname);
  const hasChannelSidebar = showSecondarySidebar(pathname);
  const setProfile = useUserStore((s) => s.setProfile);
  const setLoading = useUserStore((s) => s.setLoading);
  const [profileError, setProfileError] = useState<string | null>(null);

  const desktopMainOffset = hasChannelSidebar ? "lg:ml-[360px]" : "lg:ml-[72px]";
  const bannerOffset = hasChannelSidebar ? "lg:pl-[360px]" : "lg:pl-[72px]";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setProfile(null);
          setProfileError(
            data.error ??
              "Could not load profile. Run Supabase migrations from supabase/migrations/.",
          );
          return;
        }
        const profile = (await res.json()) as Profile;
        setProfile(profile);
        setProfileError(null);
      } catch {
        setProfile(null);
        setProfileError("Could not load profile. Check Supabase connection.");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [setProfile, setLoading]);

  return (
    <div className="min-h-screen bg-black text-white">
      <IconRail />
      <DashboardSidebar />
      {profileError && (
        <div
          className={cn(
            "border-b border-destructive/30 bg-destructive/10 px-3 py-3 sm:px-4",
            bannerOffset,
          )}
        >
          <div className="container mx-auto flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{profileError}</p>
          </div>
        </div>
      )}
      <main
        className={cn(
          desktopMainOffset,
          isChat
            ? "flex h-[100dvh] flex-col px-0 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pt-[3.75rem] lg:h-auto lg:min-h-screen lg:px-4 lg:pb-8 lg:pt-8"
            : "px-3 py-5 pt-[4.75rem] pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:px-4 sm:py-6 sm:pt-24 lg:px-4 lg:pt-8 lg:pb-8",
        )}
      >
        <div className={cn("w-full", isChat && "flex min-h-0 flex-1 flex-col")}>
          {children}
        </div>
      </main>
    </div>
  );
}
