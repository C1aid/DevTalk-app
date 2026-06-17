"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  CreditCard,
  MessagesSquare,
  Settings,
  User,
} from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { getDisplayName } from "@/lib/profile/display";
import { getSubscriptionLabel, useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

type MenuItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
};

const conversationItems: MenuItem[] = [
  {
    href: "/threads",
    label: "Threads",
    description: "Replies and conversations in threads",
    icon: MessagesSquare,
  },
];

const accountItemsBase: MenuItem[] = [
  {
    href: "/settings",
    label: "Profile & settings",
    description: "Name, avatar, password, and plan",
    icon: User,
  },
  {
    href: "/settings",
    label: "Billing",
    description: "Manage your Pro subscription",
    icon: CreditCard,
  },
  {
    href: "/settings",
    label: "Preferences",
    description: "App settings and account",
    icon: Settings,
  },
];

function MenuSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="mb-2.5 px-1 text-[13px] font-medium text-muted-foreground">
        {title}
      </h2>
      <div className="glass-card overflow-hidden">{children}</div>
    </section>
  );
}

function MenuItemRow({
  href,
  label,
  description,
  icon: Icon,
  badge,
  isLast = false,
}: MenuItem & { isLast?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex w-full items-center gap-4 px-4 py-4 transition-smooth hover:bg-white/[0.04] active:bg-white/[0.06] sm:px-5 sm:py-[1.125rem]",
        !isLast && "border-b border-white/[0.07]",
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/[0.09]">
        <Icon className="size-[1.125rem] text-white/90" strokeWidth={1.5} aria-hidden />
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[15px] font-medium leading-tight text-white">
            {label}
          </span>
          {badge ? (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/75 ring-1 ring-inset ring-white/10">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">
          {description}
        </span>
      </span>

      <ChevronRight
        className="size-[18px] shrink-0 text-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white/45"
        aria-hidden
      />
    </Link>
  );
}

function ProfileCard({
  name,
  email,
  plan,
  avatar,
}: {
  name: string;
  email: string;
  plan: string;
  avatar: Parameters<typeof UserAvatar>[0]["profile"];
}) {
  return (
    <Link
      href="/settings"
      className="glass-card group mb-8 flex w-full items-center gap-4 p-4 transition-smooth hover:border-white/20 sm:p-5"
    >
      <UserAvatar profile={avatar} className="size-14 ring-2 ring-white/10" />
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-base font-semibold text-white sm:text-lg">
          {name}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
          {email}
        </span>
        <span className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80 ring-1 ring-inset ring-white/10">
          {plan} plan
        </span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/50"
        aria-hidden
      />
    </Link>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className="glass-card mb-8 flex items-center gap-4 p-4 sm:p-5">
      <div className="size-14 shrink-0 animate-pulse rounded-full bg-white/10" />
      <div className="flex-1 space-y-2.5">
        <div className="h-5 w-36 animate-pulse rounded-md bg-white/10" />
        <div className="h-4 w-48 animate-pulse rounded-md bg-white/10" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-white/10" />
      </div>
    </div>
  );
}

export default function MorePage() {
  const profile = useUserStore((s) => s.profile);
  const isLoading = useUserStore((s) => s.isLoading);

  const accountItems = accountItemsBase.map((item) =>
    item.label === "Billing" && profile
      ? { ...item, badge: getSubscriptionLabel(profile.subscription_tier) }
      : item,
  );

  return (
    <div className="mx-auto w-full max-w-lg lg:max-w-2xl">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-white sm:text-3xl">
          More
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Settings and account options.
        </p>
      </header>

      {isLoading ? (
        <ProfileCardSkeleton />
      ) : profile ? (
        <ProfileCard
          name={getDisplayName(profile)}
          email={profile.email}
          plan={getSubscriptionLabel(profile.subscription_tier)}
          avatar={profile}
        />
      ) : null}

      <div className="space-y-6 sm:space-y-7">
        <MenuSection title="Conversations">
          {conversationItems.map((item, index) => (
            <MenuItemRow
              key={item.label}
              {...item}
              isLast={index === conversationItems.length - 1}
            />
          ))}
        </MenuSection>

        <MenuSection title="Account">
          {accountItems.map((item, index) => (
            <MenuItemRow
              key={item.label}
              {...item}
              isLast={index === accountItems.length - 1}
            />
          ))}
        </MenuSection>
      </div>
    </div>
  );
}
