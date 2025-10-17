"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  User,
  LogOut,
  Upload,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { DashboardFloatingActions } from "@/components/dashboard-floating-actions";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Create Supabase client with SSR support
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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
    } catch {
      // Even if there's an error, redirect to login
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Clean header with collapsible menu */}
      <header className="bg-background/95 backdrop-blur-sm border-b mx-4 mt-4 mb-8 rounded-2xl shadow-sm relative">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Back button */}
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Title */}
          <h1 className="text-xl font-semibold text-foreground">
            Your Wellness Journey
          </h1>

          {/* Simple profile button for mobile, full menu for desktop */}
          <div className="flex items-center gap-2">
            {/* Desktop menu (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleUpload}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Upload Exercise"
              >
                <Upload size={20} />
              </button>

              <ThemeToggle />

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile: Only profile button */}
            <button
              onClick={handleProfile}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Profile"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Clean grid layout - Fully Responsive */}
      <div className="container mx-auto px-2 sm:px-4 pb-4 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="clean-card clean-hover p-4 sm:p-6 lg:p-8 text-left group animate-slide-up flex flex-col min-h-[100px] sm:min-h-[200px] lg:min-h-[600px] xl:min-h-[800px]"
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={`Navigate to ${category.name}`}
            >
              <div className="relative w-full aspect-[3/4] mb-4 sm:mb-6 rounded-lg overflow-hidden flex-grow">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {category.name}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <DashboardFloatingActions />
    </div>
  );
}
