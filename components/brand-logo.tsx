import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const iconSizes = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

const boxSizes = {
  sm: "size-7",
  md: "size-8",
  lg: "size-9",
};

export function BrandLogo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-white",
        boxSizes[size],
        className,
      )}
    >
      <Sparkles className={cn("text-black", iconSizes[size])} />
    </div>
  );
}
