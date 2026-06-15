export function getSafeRedirect(
  path: string | null | undefined,
  fallback = "/channels",
): string {
  if (!path) return fallback;
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
