import Link from "next/link";
import { AnimatedHeading, FadeIn } from "@/components/landing/motion";
import { HeroVideoBackground } from "@/components/landing/hero-video-background";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <HeroVideoBackground />

      <div className="relative z-10 min-h-[100dvh] font-[Helvetica_Neue,Helvetica,Arial,sans-serif] font-normal antialiased">
        <div className="flex min-h-[100dvh] flex-col items-center justify-start px-4 pb-24 pt-28 text-center sm:justify-center sm:px-6 sm:pb-20 sm:pt-24 md:px-12 lg:px-16 lg:pb-0 lg:pt-0">
          <div className="flex w-full max-w-4xl flex-col items-center">
            <AnimatedHeading
              text={"Chat that flows\nwith your team."}
              className="mb-3 max-w-[18rem] text-[1.75rem] leading-[1.12] font-normal sm:mb-4 sm:max-w-none sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            />

            <FadeIn delay={750}>
              <p className="mb-6 max-w-[19rem] text-sm leading-relaxed text-gray-300 sm:mb-5 sm:max-w-lg sm:text-base md:text-lg">
                Real-time team chat for developers — channels, threads, code blocks,
                and GitHub previews. No AI bloat.
              </p>
            </FadeIn>

            <FadeIn delay={1050}>
              <div className="flex w-full max-w-[19rem] flex-col gap-2.5 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                <Link
                  href="/signup"
                  className="rounded-md bg-white px-6 py-3 text-center text-sm font-medium text-black transition-smooth hover:bg-gray-100 sm:px-8 sm:text-base"
                >
                  Get started free
                </Link>
                <a
                  href="#pricing"
                  className="liquid-glass rounded-md border border-white/20 px-6 py-3 text-center text-sm font-medium text-white transition-smooth hover:bg-white hover:text-black sm:px-8 sm:text-base"
                >
                  View pricing
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 hidden justify-center px-6 pb-12 sm:flex md:px-12 lg:px-16 lg:pb-16">
          <FadeIn delay={1300}>
            <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
              <p className="text-lg font-light md:text-xl lg:text-2xl">
                Ship faster. Talk clearer.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
