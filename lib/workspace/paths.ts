export function workspacePath(slug: string) {
  return `/w/${slug}`;
}

export function workspaceChannelPath(slug: string, channelId: string) {
  return `/w/${slug}/channels/${channelId}`;
}

export function dmChatPath(channelId: string) {
  return `/channels/${channelId}/chat`;
}

export function getWorkspaceSlugFromPath(pathname: string): string | undefined {
  const match = pathname.match(/^\/w\/([^/]+)/);
  return match?.[1];
}

export function getActiveChannelId(pathname: string): string | undefined {
  const inWorkspace = pathname.match(/^\/w\/[^/]+\/channels\/([^/]+)/);
  if (inWorkspace?.[1] && inWorkspace[1] !== "new") {
    return inWorkspace[1];
  }

  const dmChat = pathname.match(/^\/channels\/([^/]+)\/chat/);
  if (dmChat?.[1]) {
    return dmChat[1];
  }

  const legacy = pathname.match(/^\/channels\/([^/]+)/);
  if (legacy?.[1] && legacy[1] !== "new") {
    return legacy[1];
  }

  return undefined;
}

export function isDmChatRoute(pathname: string) {
  return /^\/channels\/[^/]+\/chat/.test(pathname);
}

export function showHomeSidebar(pathname: string) {
  return pathname.startsWith("/w/") || pathname.startsWith("/search");
}

export function showDmSidebar(pathname: string) {
  return pathname.startsWith("/dms") || isDmChatRoute(pathname);
}

export function showSecondarySidebar(pathname: string) {
  return showHomeSidebar(pathname) || showDmSidebar(pathname);
}

export function isChannelChatRoute(pathname: string) {
  return (
    /^\/w\/[^/]+\/channels\/[^/]+/.test(pathname) || isDmChatRoute(pathname)
  );
}
