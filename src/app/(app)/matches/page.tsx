"use client";
import { AiChatView } from "@/components/dashboard/ai-chat-view";

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2D7D9] via-[#FFE5E7] to-[#E8D5F2]">
      <AiChatView initialView="matches" />
    </div>
  );
}
