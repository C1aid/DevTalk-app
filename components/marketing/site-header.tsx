"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

type SiteHeaderProps = {
  overlapHero?: boolean;
};

export function SiteHeader({ overlapHero = false }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const shellClass =
    "fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6 md:px-12 lg:px-16";

  const barClass =
    "liquid-glass relative flex items-center justify-between rounded-xl px-4 py-2";

  const navLinkClass =
    "text-sm text-white transition-smooth hover:text-gray-300";

  const ctaClass =
    "rounded-md bg-white px-6 py-2 text-sm font-medium text-black transition-smooth hover:bg-gray-100";

  return (
    <>
      <header className={cn(shellClass, "hidden md:block")}>
        <div className={barClass}>
          <Link
            href="/"
            className="select-none text-2xl font-semibold tracking-tight text-white"
          >
            DevTalk
          </Link>

          <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a key={href} href={href} className={navLinkClass}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className={navLinkClass}>
              Sign in
            </Link>
            <Link href="/signup" className={ctaClass}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      <header className={cn(shellClass, "md:hidden")}>
        <div className={barClass}>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white"
          >
            DevTalk
          </Link>

          <button
            type="button"
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div
          className={cn(
            "liquid-glass grid overflow-hidden rounded-xl border border-white/20 transition-all duration-300",
            menuOpen
              ? "pointer-events-auto mt-3 grid-rows-[1fr] px-2 py-2 opacity-100"
              : "pointer-events-none mt-0 grid-rows-[0fr] px-2 py-0 opacity-0",
          )}
          style={{ transitionTimingFunction: "var(--ease-smooth)" }}
          aria-hidden={!menuOpen}
        >
          <div className="min-h-0">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link
              href="/login"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={cn(ctaClass, "mt-2 flex justify-center")}
              onClick={() => setMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {!overlapHero && <div className="h-20 sm:h-24 md:h-28" aria-hidden />}
    </>
  );
}
