"use client";

import { useEffect, useRef } from "react";
import { EMOJI_CATEGORIES } from "@/lib/chat/emoji-picker-data";
import { cn } from "@/lib/utils";

type EmojiPickerPanelProps = {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
  className?: string;
};

export function EmojiPickerPanel({
  onSelect,
  onClose,
  anchorRef,
  className,
}: EmojiPickerPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, anchorRef]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Emoji picker"
      className={cn(
        "glass-card z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.55)] sm:w-80",
        className,
      )}
    >
      <div className="border-b border-white/10 px-3 py-2">
        <p className="text-xs font-medium text-muted-foreground">Emoji</p>
      </div>

      <div className="max-h-64 overflow-y-auto overscroll-contain px-2 py-2 sm:max-h-72">
        {EMOJI_CATEGORIES.map((category) => (
          <section key={category.id} className="mb-3 last:mb-0">
            <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {category.label}
            </p>
            <div className="grid grid-cols-8 gap-0.5">
              {category.emojis.map((emoji) => (
                <button
                  key={`${category.id}-${emoji}`}
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg text-lg transition-smooth hover:bg-white/10 active:scale-95"
                  onClick={() => onSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
