"use client";

import { useParams } from "next/navigation";
import { ChannelChat } from "@/components/chat/channel-chat";

export default function DmChatPage() {
  const params = useParams();
  const channelId = params.id as string;

  return <ChannelChat channelId={channelId} />;
}
