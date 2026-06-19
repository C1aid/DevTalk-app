import Image from "next/image";
import { BRAND_LOGO_PATH } from "@/lib/brand/assets";
import { cn } from "@/lib/utils";

const imageSizes = {
  sm: 28,
  md: 36,
  lg: 44,
} as const;

export function BrandLogo({
  size = "md",
  className,
}: {
  size?: keyof typeof imageSizes;
  className?: string;
}) {
  const px = imageSizes[size];

  return (
    <Image
      src={BRAND_LOGO_PATH}
      alt="DevTalk"
      width={px}
      height={px}
      className={cn("shrink-0 object-contain", className)}
      priority={size === "lg"}
    />
  );
}
