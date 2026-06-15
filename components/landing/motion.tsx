import { cn } from "@/lib/utils";

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
        <div key={lineIndex} className="flex justify-center whitespace-nowrap">
          {line.split("").map((char) => {
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
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </div>
      ))}
    </h1>
  );
}
