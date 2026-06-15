const stats = [
  { value: "90d", label: "Free history" },
  { value: "10", label: "Free channels" },
  { value: "Live", label: "Realtime" },
  { value: "$8", label: "Pro / mo" },
] as const;

export function LandingStats() {
  return (
    <section className="border-y border-white/8">
      <div className="container mx-auto max-w-4xl px-4 py-2">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-black px-3 py-8 text-center sm:px-4 sm:py-10"
            >
              <p className="text-xl font-medium tracking-tight text-white sm:text-2xl md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
