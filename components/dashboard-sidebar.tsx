"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Lightbulb,
  Menu,
  Settings,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getSubscriptionLabel, useUserStore } from "@/store/user-store";

const mainNavItems = [
  { href: "/notes", label: "Notes", icon: Lightbulb },
  { href: "/shared", label: "Shared with me", icon: Users },
] as const;

const storageNavItems = [
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/trash", label: "Trash", icon: Trash2 },
] as const;

const bottomNavItems = [
  ...mainNavItems,
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function isNavActive(pathname: string, href: string) {
  if (href === "/notes") {
    return pathname === "/notes" || pathname.startsWith("/notes/");
  }
  return pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof Lightbulb;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-smooth",
        active
          ? "border-white/20 bg-white/10 text-white"
          : "text-gray-300 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
      <span>{label}</span>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const profile = useUserStore((s) => s.profile);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 px-4 pt-4 lg:hidden">
        <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
          <Link
            href="/notes"
            className="text-lg font-semibold tracking-tight text-white"
          >
            NoteFlow
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-white transition-smooth hover:bg-white/10"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col px-4 py-6 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="liquid-glass flex h-full flex-col rounded-xl px-4 py-5">
          <div className="mb-6 flex items-center justify-between px-2">
            <Link
              href="/notes"
              className="text-lg font-semibold tracking-tight text-white"
              onClick={closeMobile}
            >
              NoteFlow
            </Link>
            <button
              type="button"
              className="rounded-md p-2 text-gray-300 transition-smooth hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close menu"
              onClick={closeMobile}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-1">
            {mainNavItems.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                pathname={pathname}
                onNavigate={closeMobile}
              />
            ))}

            <div className="my-3 border-t border-white/10" />

            {storageNavItems.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                pathname={pathname}
                onNavigate={closeMobile}
              />
            ))}

            <div className="my-3 border-t border-white/10" />

            <NavLink
              href="/settings"
              label="Settings"
              icon={Settings}
              pathname={pathname}
              onNavigate={closeMobile}
            />
          </nav>

          {profile && (
            <div className="mt-auto border-t border-white/10 px-2 pt-4">
              <p className="text-xs font-medium text-gray-400">
                {getSubscriptionLabel(profile.subscription_tier)} plan
              </p>
            </div>
          )}
        </div>
      </aside>

      <nav className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <div className="liquid-glass flex items-center justify-around rounded-xl px-2 py-2">
          {bottomNavItems.map(({ href, label, icon: Icon }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium transition-smooth",
                  active ? "text-white" : "text-gray-400",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} />
                <span className="max-w-[5.5rem] truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
