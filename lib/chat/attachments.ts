export type MessageAttachment = {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
};

export const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_MESSAGE = 10;

export function sanitizeFileName(name: string): string {
  const base = name.replace(/[/\\?%*:|"<>]/g, "_").trim();
  return base.slice(0, 180) || "file";
}

export function isAudioMimeType(mimeType: string): boolean {
  return mimeType.startsWith("audio/");
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function parseAttachments(value: unknown): MessageAttachment[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is MessageAttachment =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as MessageAttachment).id === "string" &&
      typeof (item as MessageAttachment).name === "string" &&
      typeof (item as MessageAttachment).path === "string" &&
      typeof (item as MessageAttachment).size === "number" &&
      typeof (item as MessageAttachment).mimeType === "string",
  );
}
