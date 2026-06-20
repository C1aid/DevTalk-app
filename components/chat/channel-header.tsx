"use client";

import { Hash, Lock, Search, Settings, Star, User, Users } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChannelHeaderProps = {
  title: string;
  description?: string | null;
  email?: string | null;
  isDm?: boolean;
  isPrivate?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onOpenMembers?: () => void;
  onOpenSettings?: () => void;
  canManageSettings?: boolean;
  memberCount?: number;
};

const channelTabs: Array<{
  id: string;
  label: string;
  href?: string;
  active?: boolean;
}> = [
  { id: "messages", label: "Messages", active: true },
  { id: "files", label: "Files", href: "/files" },
  { id: "pins", label: "Pins", href: "#" },
];

export function ChannelHeader({
  title,
  description,
  email,
  isDm,
  isPrivate,
  search,
  onSearchChange,
  onOpenMembers,
  onOpenSettings,
  canManageSettings = false,
  memberCount,
}: ChannelHeaderProps) {
  const ChannelIcon = isDm ? User : isPrivate ? Lock : Hash;

  return (
    <div className="shrink-0 border-b border-white/10">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          <ChannelIcon className="size-4 shrink-0 text-gray-400" />
          <h1 className="truncate text-sm font-bold text-white sm:text-base">
            {title}
          </h1>
          {!isDm && <Star className="hidden size-4 shrink-0 text-gray-500 lg:block" />}
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenMembers && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-gray-300 hover:bg-white/10 hover:text-white"
              onClick={onOpenMembers}
            >
              <Users className="size-4" />
              {memberCount !== undefined ? (
                <span className="text-xs">{memberCount}</span>
              ) : null}
            </Button>
          )}

          {canManageSettings && onOpenSettings && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-gray-300 hover:bg-white/10 hover:text-white"
              onClick={onOpenSettings}
              aria-label="Channel settings"
            >
              <Settings className="size-4" />
            </Button>
          )}

          <div className="liquid-glass relative hidden w-56 rounded-xl lg:block xl:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search messages"
              className="h-9 border-0 bg-transparent pl-9 text-sm focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      {!isDm && (
        <div className="hidden items-center gap-1 px-4 pb-0 lg:flex">
          {channelTabs.map((tab) =>
            tab.href ? (
              <Link
                key={tab.id}
                href={tab.href}
                className="rounded-t-lg px-3 py-2 text-sm font-medium text-gray-400 transition-smooth hover:bg-white/5 hover:text-white"
              >
                {tab.label}
              </Link>
            ) : (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "rounded-t-lg px-3 py-2 text-sm font-medium transition-smooth",
                  tab.active
                    ? "border-b-2 border-white text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                {tab.label}
              </button>
            ),
          )}
        </div>
      )}

      {(description || email) && (
        <div className="border-t border-white/5 px-3 py-2 sm:px-4">
          {description && !isDm && (
            <p className="truncate text-xs text-gray-400">{description}</p>
          )}
          {isDm && email && (
            <p className="truncate text-xs text-gray-400">{email}</p>
          )}
        </div>
      )}
    </div>
  );
}
