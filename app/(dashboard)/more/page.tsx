import Link from "next/link";
import { CreditCard, MessagesSquare, MoreHorizontal, Settings, User } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

const links = [
  {
    href: "/threads",
    label: "Threads",
    description: "Replies and conversations in threads",
    icon: MessagesSquare,
  },
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
] as const;

export default function MorePage() {
  return (
    <div className="lg:mx-auto lg:max-w-3xl">
      <PageHeader
        title="More"
        description="Settings and account options."
        icon={MoreHorizontal}
      />
      <div className="mt-6 space-y-2">
        {links.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="glass-card flex items-center gap-4 p-4 transition-smooth hover:border-white/20"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10">
              <Icon className="size-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
