"use client";

import { useEffect, useState } from "react";
import { Download, FileIcon, Mic } from "lucide-react";
import {
  formatFileSize,
  isAudioMimeType,
  isImageMimeType,
  type MessageAttachment,
} from "@/lib/chat/attachments";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ResolvedAttachment = MessageAttachment & {
  url: string | null;
};

export function MessageAttachments({
  attachments,
  className,
}: {
  attachments: MessageAttachment[];
  className?: string;
}) {
  const [resolved, setResolved] = useState<ResolvedAttachment[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadUrls = async () => {
      const supabase = createClient();
      const items = await Promise.all(
        attachments.map(async (attachment) => {
          const { data, error } = await supabase.storage
            .from("attachments")
            .createSignedUrl(attachment.path, 60 * 60);

          return {
            ...attachment,
            url: error ? null : data.signedUrl,
          };
        }),
      );

      if (!cancelled) setResolved(items);
    };

    void loadUrls();

    return () => {
      cancelled = true;
    };
  }, [attachments]);

  if (attachments.length === 0) return null;

  return (
    <div className={cn("mt-2 space-y-2", className)}>
      {resolved.map((attachment) => {
        if (attachment.url && isImageMimeType(attachment.mimeType)) {
          return (
            <a
              key={attachment.id}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg border border-white/10 bg-black/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-h-72 w-full object-contain"
              />
            </a>
          );
        }

        if (attachment.url && isAudioMimeType(attachment.mimeType)) {
          return (
            <div
              key={attachment.id}
              className="glass-card flex items-center gap-3 px-3 py-2.5"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                <Mic className="size-4 text-sky-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">Voice message</p>
                <audio
                  controls
                  preload="metadata"
                  src={attachment.url}
                  className="mt-1 h-8 w-full max-w-sm"
                />
              </div>
            </div>
          );
        }

        return (
          <a
            key={attachment.id}
            href={attachment.url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "glass-card flex items-center gap-3 px-3 py-2.5 transition-smooth hover:border-white/20",
              !attachment.url && "pointer-events-none opacity-60",
            )}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <FileIcon className="size-4 text-gray-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {attachment.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(attachment.size)}
              </p>
            </div>
            <Download className="size-4 shrink-0 text-gray-400" />
          </a>
        );
      })}
    </div>
  );
}
