"use client";

import Link from "next/link";
import { Hash, MessageSquare, Radio, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const snippets = [
  {
    id: "channel",
    label: "channel",
    filename: "channels.ts",
    lines: [
      { tokens: [{ t: "const", c: "kw" }, { t: " channel ", c: "id" }, { t: "=", c: "kw" }, { t: " await ", c: "kw" }, { t: "devtalk", c: "fn" }, { t: ".", c: "kw" }, { t: "createChannel", c: "method" }, { t: "({", c: "kw" }] },
      { tokens: [{ t: "  name: ", c: "id" }, { t: "'#sprint-42'", c: "str" }, { t: ",", c: "kw" }] },
      { tokens: [{ t: "  visibility: ", c: "id" }, { t: "'public'", c: "str" }, { t: ",", c: "kw" }] },
      { tokens: [{ t: "});", c: "kw" }] },
    ],
  },
  {
    id: "message",
    label: "message",
    filename: "messages.ts",
    lines: [
      { tokens: [{ t: "await ", c: "kw" }, { t: "devtalk", c: "fn" }, { t: ".", c: "kw" }, { t: "send", c: "method" }, { t: "(channel.id, {", c: "kw" }] },
      { tokens: [{ t: "  content: ", c: "id" }, { t: "'Shipped the fix 🚀'", c: "str" }, { t: ",", c: "kw" }] },
      { tokens: [{ t: "  threadId: ", c: "id" }, { t: "parent.id", c: "id" }, { t: ",", c: "kw" }] },
      { tokens: [{ t: "});", c: "kw" }] },
    ],
  },
  {
    id: "realtime",
    label: "realtime",
    filename: "realtime.ts",
    lines: [
      { tokens: [{ t: "devtalk", c: "fn" }, { t: ".", c: "kw" }, { t: "subscribe", c: "method" }, { t: "(channel.id)", c: "kw" }] },
      { tokens: [{ t: "  .", c: "kw" }, { t: "on", c: "method" }, { t: "('message', (msg) => {", c: "kw" }] },
      { tokens: [{ t: "    render", c: "method" }, { t: "(msg);", c: "kw" }] },
      { tokens: [{ t: "  });", c: "kw" }] },
    ],
  },
] as const;

const tokenColors: Record<string, string> = {
  kw: "text-white",
  id: "text-white/75",
  fn: "text-white/85",
  method: "text-white/65",
  str: "text-white/55",
  bool: "text-white/70",
};

const highlights = [
  { icon: Zap, label: "Delivery", value: "< 100ms" },
  { icon: MessageSquare, label: "Threads", value: "Inline" },
  { icon: Hash, label: "Channels", value: "Public & private" },
] as const;

function CodeLine({ tokens }: { tokens: readonly { t: string; c: string }[] }) {
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={tokenColors[token.c]}>
          {token.t}
        </span>
      ))}
    </>
  );
}

export function AuthShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = snippets[activeIndex] ?? snippets[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % snippets.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-black p-10 lg:flex">
      <div className="brand-glow pointer-events-none absolute inset-0" />
      <div className="auth-showcase-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative z-10">
        <Link
          href="/"
          className="select-none text-2xl font-semibold tracking-tight text-white"
        >
          DevTalk
        </Link>
      </div>

      <div className="relative z-10 max-w-xl">
        <p className="text-gradient mb-3 text-3xl font-semibold tracking-tight">
          Chat that flows
          <br />
          with your team.
        </p>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-300">
          Team chat for developers — channels, threads, code blocks, and GitHub
          link previews in one place.
        </p>

        <div className="relative">
          <div
            className="pointer-events-none absolute -right-3 -top-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] rounded-xl border border-white/[0.06] bg-white/[0.02]"
            aria-hidden
          />

          <div className="liquid-glass relative overflow-hidden rounded-xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-500/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-[11px] text-gray-500">
                  {active.filename}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {snippets.map((snippet, index) => (
                  <button
                    key={snippet.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "rounded-md px-2.5 py-1 font-mono text-[11px] transition-smooth",
                      index === activeIndex
                        ? "bg-white/10 text-white"
                        : "text-gray-500 hover:text-gray-300",
                    )}
                  >
                    {snippet.label}
                  </button>
                ))}
              </div>
            </div>

            <pre
              key={active.id}
              className="auth-code-panel overflow-x-auto p-5 font-mono text-[13px] leading-relaxed"
            >
              <code>
                {active.lines.map((line, lineIndex) => (
                  <div key={lineIndex}>
                    <CodeLine tokens={line.tokens} />
                  </div>
                ))}
              </code>
            </pre>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400/70 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-400/90" />
                </span>
                <span className="text-[11px] text-gray-400">Live channel connected</span>
              </div>
              <span className="font-mono text-[11px] text-gray-500">~12ms latency</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="liquid-glass rounded-lg px-3 py-3 transition-smooth hover:border-white/20"
            >
              <Icon className="mb-2 size-4 text-white/70" strokeWidth={1.75} />
              <p className="text-[11px] text-gray-500">{label}</p>
              <p className="mt-0.5 text-xs font-medium text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="liquid-glass flex items-center gap-2 rounded-full px-3 py-1.5">
          <Radio className="size-3.5 text-green-400" strokeWidth={2} />
          <span className="text-xs text-gray-300">Supabase · Next.js · Stripe</span>
        </div>
      </div>
    </div>
  );
}
