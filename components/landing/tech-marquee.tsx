const items = [
  "Next.js",
  "Supabase",
  "Stripe",
  "TipTap",
  "TypeScript",
  "Tailwind",
  "Vercel",
  "Playwright",
];

export function TechMarquee() {
  const track = [...items, ...items];

  return (
    <section className="border-y border-white/8 py-10">
      <div className="marquee-fade relative overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-16">
          {track.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="whitespace-nowrap text-sm font-medium tracking-wide text-muted-foreground/70"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
