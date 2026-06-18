"use client";

import { useEffect, useRef } from "react";

const HERO_VIDEO = "/videos/hero-bg.mp4";

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const section = video.closest("section");
    if (!section) return;

    const play = () => {
      void video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      play();
    } else {
      video.addEventListener("loadeddata", play, { once: true });
    }

    const pauseOnScroll = () => {
      video.pause();
    };

    window.addEventListener("scroll", pauseOnScroll, { passive: true, once: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", play);
      window.removeEventListener("scroll", pauseOnScroll);
    };
  }, []);

  return (
    <div className="hero-video-wrap absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hero-video absolute inset-0 h-full w-full"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
    </div>
  );
}
