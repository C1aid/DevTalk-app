import Link from "next/link";
import { AnimatedHeading, FadeIn } from "@/components/landing/motion";
import { HeroVideoBackground } from "@/components/landing/hero-video-background";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <HeroVideoBackground />

      <div className="relative z-10 min-h-screen font-[Helvetica_Neue,Helvetica,Arial,sans-serif] font-normal antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center md:px-12 lg:px-16">
          <div className="flex w-full max-w-4xl flex-col items-center">
            <AnimatedHeading
              text={"Notes that flow\nwith your team."}
              className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ letterSpacing: "-0.04em" }}
            />

            <FadeIn delay={750}>
              <p className="mb-5 text-base text-gray-300 md:text-lg">
                Collaborative note-taking with real-time editing, secure auth,
                and flexible plans — built to ship fast.
              </p>
            </FadeIn>

            <FadeIn delay={1050}>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/signup"
                  className="rounded-md bg-white px-8 py-3 font-medium text-black transition-smooth hover:bg-gray-100"
                >
                  Get started free
                </Link>
                <a
                  href="#quickstart"
                  className="liquid-glass rounded-md border border-white/20 px-8 py-3 font-medium text-white transition-smooth hover:bg-white hover:text-black"
                >
                  View quickstart
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-6 pb-12 md:px-12 lg:px-16 lg:pb-16">
          <FadeIn delay={1300}>
            <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
              <p className="text-lg font-light md:text-xl lg:text-2xl">
                Write. Share. Collaborate.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
