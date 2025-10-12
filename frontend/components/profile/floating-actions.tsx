"use client";

import { MessageCircle, MapPin } from "lucide-react";

interface FloatingActionsProps {
  onChatbotClick: () => void;
  onMapClick: () => void;
}

export function FloatingActions({
  onChatbotClick,
  onMapClick,
}: FloatingActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <button
        onClick={onMapClick}
        className="w-14 h-14 bg-foreground text-background rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Open Hospital Map"
      >
        <MapPin size={20} strokeWidth={2} />
      </button>

      <button
        onClick={onChatbotClick}
        className="w-14 h-14 bg-foreground text-background rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Open Chatbot"
      >
        <MessageCircle size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
