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
    <div className="min-h-screen bg-muted/20">
      {/* Clean header */}
      <header className="clean-card mx-4 mt-4 mb-8">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-xl font-bold text-foreground">
            Your Wellness Journey
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Upload Exercise"
            >
              <Upload size={20} />
              <span className="font-medium hidden sm:inline">Upload</span>
            </button>

            <button
              onClick={handleProfile}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Profile"
            >
              <User size={20} />
              <span className="font-medium hidden sm:inline">Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
              <span className="font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Clean grid layout with larger cards */}
      <div className="container mx-auto px-4 pb-8 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="clean-card clean-hover p-8 text-left group animate-slide-up flex flex-col h-full min-h-[400px]"
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={`Navigate to ${category.name}`}
            >
              <div className="relative w-full flex-1 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {category.name}
                </h3>
                <p className="text-base text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clean Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Emergency Button */}
        <button
          onClick={toggleEmergency}
          className="w-14 h-14 bg-destructive hover:bg-destructive/90 text-white rounded-xl clean-shadow clean-hover flex items-center justify-center"
          aria-label="Emergency Call and SMS"
          title="Emergency - Call & SMS with Location"
        >
          <Phone size={20} strokeWidth={2.5} />
        </button>

        {/* Map Button */}
        <button
          onClick={toggleMap}
          className="w-14 h-14 bg-accent hover:bg-accent/90 text-white rounded-xl clean-shadow clean-hover flex items-center justify-center"
          aria-label="Open Hospital Map"
        >
          <MapPin size={20} strokeWidth={2} />
        </button>

        {/* Chatbot Button */}
        <button
          onClick={toggleChatbot}
          className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl clean-shadow clean-hover flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <MessageCircle size={20} strokeWidth={2} />
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
