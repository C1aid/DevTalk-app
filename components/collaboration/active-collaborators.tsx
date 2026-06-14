"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollaborationStore } from "@/store/user-store";

export function ActiveCollaborators() {
  const activeUsers = useCollaborationStore((s) => s.activeUsers);

  if (activeUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-3 pr-1.5">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      <span className="text-xs text-muted-foreground">
        {activeUsers.length === 1 ? "1 editing" : `${activeUsers.length} editing`}
      </span>
      <div className="flex -space-x-2">
        {activeUsers.map((user) => (
          <Avatar
            key={user.userId}
            className="size-7 border-2 border-black"
            style={{ boxShadow: `0 0 0 1px ${user.color}40` }}
            title={user.email}
          >
            <AvatarFallback
              style={{ backgroundColor: user.color, color: "white" }}
              className="text-[10px] font-semibold"
            >
              {user.email.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
