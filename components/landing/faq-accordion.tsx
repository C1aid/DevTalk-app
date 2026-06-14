"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="mx-auto mt-12 max-w-2xl divide-y divide-white/8">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);

        return (
          <div key={item.question} className="py-5">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 rounded-lg text-left font-medium transition-smooth hover:text-primary"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              {item.question}
              <ChevronDown
                className={cn(
                  "faq-chevron h-4 w-4 shrink-0 text-muted-foreground",
                  isOpen && "faq-chevron-open",
                )}
              />
            </button>

            <div className={cn("faq-content", isOpen && "faq-content-open")}>
              <div>
                <p className="faq-answer pt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
