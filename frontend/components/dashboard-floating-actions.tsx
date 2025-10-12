"use client";

import { MessageCircle, MapPin, AlertCircle } from "lucide-react";
import { useState } from "react";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";
import { EmergencyPopup } from "@/components/emergency-popup";

/**
 * DashboardFloatingActions - Reusable floating action buttons component
 * Shows Emergency, Map, and Chatbot buttons on all authenticated pages
 */
export function DashboardFloatingActions() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Emergency Button */}
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center group"
          aria-label="Emergency Alert"
          title="Emergency Alert"
        >
          <AlertCircle
            size={20}
            strokeWidth={2}
            className="group-hover:animate-pulse"
          />
        </button>

        {/* Map Button */}
        <button
          onClick={() => setIsMapOpen(true)}
          className="w-14 h-14 bg-foreground text-background rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Open Hospital Map"
          title="Find Nearby Hospitals"
        >
          <MapPin size={20} strokeWidth={2} />
        </button>

        {/* Chatbot Button */}
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="w-14 h-14 bg-foreground text-background rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Open Chatbot"
          title="Health Assistant"
        >
          <MessageCircle size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Popups */}
      <ChatbotPopup
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
      <MapPopup isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      <EmergencyPopup
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </>
  );
}
