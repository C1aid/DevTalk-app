"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "li" | "footer";
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "motion-reveal",
        visible && "motion-reveal-visible",
        className,
      )}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <div
      className={cn("motion-fade", className)}
      style={{ "--motion-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

type AnimatedHeadingProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  charDelay?: number;
};

export function AnimatedHeading({
  text,
  className,
  style,
  delay = 200,
  charDelay = 28,
}: AnimatedHeadingProps) {
  const lines = text.split("\n");
  let charIndex = 0;

  return (
    <h1
      className={cn(className)}
      style={style}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          className="flex flex-wrap justify-center gap-x-[0.28em]"
        >
          {line.split(/\s+/).filter(Boolean).map((word, wordIndex) => (
            <span key={wordIndex} className="inline-flex whitespace-nowrap">
              {word.split("").map((char) => {
                const index = charIndex++;
                return (
                  <span
                    key={index}
                    className="hero-char"
                    style={
                      {
                        "--char-index": index,
                        "--hero-delay": `${delay}ms`,
                        "--char-step": `${charDelay}ms`,
                      } as React.CSSProperties
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      ))}
    </h1>
  );
}
