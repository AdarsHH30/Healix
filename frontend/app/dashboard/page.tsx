"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, MessageCircle, LogOut, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { supabase } from "@/lib/supabase";

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
  const [isDark, setIsDark] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

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
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:+1234567890"; // Replace with your emergency/support number
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={20} strokeWidth={2} />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-xl font-semibold text-foreground/90 tracking-tight">
            Your Wellness Journey
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePhoneCall}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Emergency Call"
            >
              <Phone size={20} strokeWidth={2} />
              <span className="font-medium hidden sm:inline">Call</span>
            </button>

            <button
              onClick={handleUpload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Upload Exercise"
            >
              <Upload size={20} strokeWidth={2} />
              <span className="font-medium hidden sm:inline">Upload</span>
            </button>

            <button
              onClick={handleProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Profile"
            >
              <User size={20} strokeWidth={2} />
              <span className="font-medium hidden sm:inline">Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-destructive/70 hover:text-destructive hover:bg-destructive/10 active:scale-95"
              aria-label="Logout"
            >
              <LogOut size={20} strokeWidth={2} />
              <span className="font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-[73px]">
        {categories.map((category) => {
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative h-full w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50 cursor-pointer"
              aria-label={`Navigate to ${category.name}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30" />

              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-[800ms] ease-out group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.gradient} transition-opacity duration-700 opacity-60 group-hover:opacity-90`}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700">
                <div className="text-center space-y-2 transform transition-all duration-700 group-hover:-translate-y-2">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-700">
                    {category.name}
                  </h2>
                  <p className="text-base sm:text-lg text-white/80 drop-shadow-xl font-light tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-700 delay-75">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/0 group-hover:bg-white/60 transition-all duration-700" />
            </button>
          );
        })}
      </div>

      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-full shadow-2xl hover:shadow-chart-1/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Open Chatbot"
      >
        <MessageCircle size={28} strokeWidth={2} />
      </button>

      {/* Chatbot Popup */}
      <ChatbotPopup
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}
