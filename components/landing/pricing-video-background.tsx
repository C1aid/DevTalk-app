"use client";

import { useEffect, useRef } from "react";

import { LANDING_VIDEOS } from "@/lib/brand/assets";

const PRICING_VIDEO = LANDING_VIDEOS.pricing;

export function PricingVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      play();
      return;
    }

    video.addEventListener("loadeddata", play, { once: true });
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <div className="hero-video-wrap absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="hero-video absolute inset-0 h-full w-full object-cover"
      >
        <source src={PRICING_VIDEO} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
    </div>
  );
}
