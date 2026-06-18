import Link from "next/link";
import { AnimatedHeading, FadeIn } from "@/components/landing/motion";
import { HeroVideoBackground } from "@/components/landing/hero-video-background";

export function HeroSection() {
  return (
    <section className="relative min-h-svh overflow-x-hidden bg-black text-white">
      <HeroVideoBackground />

      <div className="relative z-10 flex min-h-svh flex-col font-[Helvetica_Neue,Helvetica,Arial,sans-serif] font-normal antialiased">
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-20 sm:px-6 md:px-12 lg:px-16">
          <div className="flex w-full max-w-4xl flex-col items-center text-center">
            <AnimatedHeading
              text={"Chat that flows\nwith your team."}
              className="text-[1.875rem] leading-[1.15] font-normal sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            />

            <FadeIn delay={750}>
              <p className="mx-auto mt-6 max-w-sm text-pretty text-sm leading-relaxed text-gray-300 sm:mt-0 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg">
                Real-time team chat for developers — channels, threads, code
                blocks, and GitHub previews. No AI bloat.
              </p>
            </FadeIn>

            <FadeIn delay={1050}>
              <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-2.5 sm:mt-0 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-4">
                <Link
                  href="/signup"
                  className="rounded-md bg-white px-4 py-2.5 text-center text-sm font-medium text-black transition-smooth hover:bg-gray-100 sm:px-8 sm:py-3 sm:text-base"
                >
                  Get started free
                </Link>
                <a
                  href="#pricing"
                  className="liquid-glass rounded-md border border-white/20 px-4 py-2.5 text-center text-sm font-medium text-white transition-smooth hover:bg-white hover:text-black sm:px-8 sm:py-3 sm:text-base"
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
