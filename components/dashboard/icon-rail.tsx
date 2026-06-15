"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { railItems } from "@/lib/navigation/rail";

type IconRailProps = {
  className?: string;
  onNavigate?: () => void;
};

export function IconRail({ className, onNavigate }: IconRailProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden w-[72px] border-r border-white/10 bg-black lg:grid lg:place-items-center",
        className,
      )}
      aria-label="Main navigation"
    >
      <ul className="flex flex-col items-center gap-2">
        {railItems.map(({ key, href, label, icon: Icon, isActive }) => {
          const active = isActive(pathname);
          return (
            <li key={key} className="flex justify-center">
              <Link
                href={href}
                onClick={onNavigate}
                className={cn(
                  "group flex w-[52px] flex-col items-center gap-1.5 transition-smooth",
                  active ? "text-white" : "text-gray-500 hover:text-gray-300",
                )}
              >
                <span
                  className={cn(
                    "box-border flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-smooth",
                    active
                      ? "liquid-glass bg-white/10 text-white ring-white/20"
                      : "bg-transparent text-inherit ring-transparent group-hover:bg-white/[0.04] group-hover:ring-white/10",
                  )}
                >
                  <Icon className="size-[22px]" strokeWidth={1.5} />
                </span>
                <span
                  className={cn(
                    "block h-3 w-full text-center text-[11px] leading-3 tracking-tight",
                    active ? "font-semibold text-white" : "font-medium",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { railItems };
