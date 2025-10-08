"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  Phone,
  MessageCircle,
  LogOut,
  Upload,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";
import { createBrowserClient } from "@supabase/ssr";
import { EmergencyPopup } from "@/components/emergency-popup";

const categories = [
  {
    id: "physical-health",
    name: "Physical Health",
    description: "Strength & Endurance",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop",
    gradient: "from-chart-1/70 via-chart-1/50 to-transparent",
  },
  {
    id: "mental-health",
    name: "Mental Health",
    description: "Peace & Clarity",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop",
    gradient: "from-accent/70 via-accent/50 to-transparent",
  },
  {
    id: "breathing-exercises",
    name: "Breathing",
    description: "Breathe & Relax",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop",
    gradient: "from-chart-2/70 via-chart-2/50 to-transparent",
  },
  {
    id: "balanced-diet",
    name: "Nutrition",
    description: "Nourish Your Body",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1000&fit=crop",
    gradient: "from-chart-4/70 via-chart-4/50 to-transparent",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Create Supabase client with SSR support
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/dashboard/${categoryId}`);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleUpload = () => {
    router.push("/upload");
  };

  const handleLogout = async () => {
    try {
      // Sign out with SSR client to properly clear cookies
      await supabase.auth.signOut();

      // Force a hard redirect to clear any cached state
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if there's an error, redirect to login
      window.location.href = "/login";
    }
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const toggleMap = () => {
    setIsMapOpen(!isMapOpen);
  };

  const toggleEmergency = () => {
    setIsEmergencyOpen(!isEmergencyOpen);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40">
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={2} className="md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </button>

          <h1 className="text-base md:text-xl font-semibold text-foreground/90 tracking-tight hidden sm:block">
            Your Wellness Journey
          </h1>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Upload button - hidden on mobile */}
            <button
              onClick={handleUpload}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Upload Exercise"
            >
              <Upload size={20} strokeWidth={2} />
              <span className="font-medium hidden sm:inline">Upload</span>
            </button>

            <button
              onClick={handleProfile}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Profile"
            >
              <User size={18} strokeWidth={2} className="md:w-5 md:h-5" />
              <span className="font-medium hidden sm:inline text-sm md:text-base">
                Profile
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-300 text-destructive/70 hover:text-destructive hover:bg-destructive/10 active:scale-95"
              aria-label="Logout"
            >
              <LogOut size={18} strokeWidth={2} className="md:w-5 md:h-5" />
              <span className="font-medium hidden sm:inline text-sm md:text-base">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-[57px] md:pt-[73px]">
        {categories.map((category) => {
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative h-full w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50 cursor-pointer"
              aria-label={`Navigate to ${category.name}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30" />

              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-all duration-[800ms] ease-out group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.gradient} transition-opacity duration-700 opacity-60 group-hover:opacity-90`}
              />

              {/* Content - Always visible on mobile, hover effect on desktop */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 transition-all duration-700">
                <div className="text-center space-y-2 transform transition-all duration-700 md:group-hover:-translate-y-2">
                  {/* Section name - always visible on mobile, hover on desktop */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700">
                    {category.name}
                  </h2>
                  {/* Description - always visible on mobile, hover on desktop */}
                  <p className="text-sm sm:text-base md:text-lg text-white/90 md:text-white/80 drop-shadow-xl font-light tracking-wide opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700 md:delay-75">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/0 group-hover:bg-white/60 transition-all duration-700" />
            </button>
          );
        })}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40 flex flex-col gap-3 md:gap-4">
        {/* Emergency Button - Most Important, at the top */}
        <button
          onClick={toggleEmergency}
          className="w-14 h-14 md:w-16 md:h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl hover:shadow-red-600/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center animate-pulse"
          aria-label="Emergency Call and SMS"
          title="Emergency - Call & SMS with Location"
        >
          <Phone size={24} strokeWidth={2.5} className="md:w-7 md:h-7" />
        </button>

        {/* Map Button */}
        <button
          onClick={toggleMap}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-chart-2 to-chart-4 text-white rounded-full shadow-2xl hover:shadow-chart-2/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open Hospital Map"
        >
          <MapPin size={24} strokeWidth={2} className="md:w-7 md:h-7" />
        </button>

        {/* Chatbot Button */}
        <button
          onClick={toggleChatbot}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-full shadow-2xl hover:shadow-chart-1/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <MessageCircle size={24} strokeWidth={2} className="md:w-7 md:h-7" />
        </button>
      </div>

      {/* Chatbot Popup */}
      <ChatbotPopup
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* Map Popup */}
      <MapPopup isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />

      {/* Emergency Popup */}
      <EmergencyPopup
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
