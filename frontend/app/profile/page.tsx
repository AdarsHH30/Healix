"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  LogOut,
  Upload as UploadIcon,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Try to get profile from users table
      const { data: profileData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        // If no profile exists, create one
        setProfile({
          id: user.id,
          email: user.email || "",
          created_at: user.created_at || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={20} strokeWidth={2} />
              <span className="font-medium">Back to Dashboard</span>
            </button>

            <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">
              Your Profile
            </h1>

            <div className="w-[180px]" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-muted/20 rounded-2xl border border-border p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile?.full_name
                    ? profile.full_name.charAt(0).toUpperCase()
                    : profile?.email.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile?.full_name || "User"}
                  </h2>
                  <p className="text-muted-foreground">Welcome to Healix</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={16} />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>
                      Member since {formatDate(profile?.created_at || "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button
                  onClick={() => router.push("/upload")}
                  variant="outline"
                  className="w-full md:w-auto gap-2"
                >
                  <UploadIcon size={16} />
                  Upload Exercise
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full md:w-auto gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/20 rounded-xl border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-chart-1/20 rounded-lg">
                  <User className="text-chart-1" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profile</p>
                  <p className="text-xl font-bold text-foreground">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-xl border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-chart-2/20 rounded-lg">
                  <Calendar className="text-chart-2" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dashboard</p>
                  <p className="text-xl font-bold text-foreground">Access</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-xl border border-border p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-chart-4/20 rounded-lg">
                  <UploadIcon className="text-chart-4" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contribute</p>
                  <p className="text-xl font-bold text-foreground">Enabled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-muted/20 rounded-2xl border border-border p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">
              About Your Account
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Your Healix account gives you access to a comprehensive
                collection of health and wellness exercises.
              </p>
              <p>
                You can browse exercises across different categories including
                Physical Health, Mental Health, Breathing Exercises, and
                Nutrition.
              </p>
              <p>
                As a registered user, you can also contribute to the community
                by uploading new exercises through the Upload page.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40 flex flex-col gap-3 md:gap-4">
        {/* Map Button */}
        <button
          onClick={() => setIsMapOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-chart-2 to-chart-4 text-white rounded-full shadow-2xl hover:shadow-chart-2/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open Hospital Map"
        >
          <MapPin size={24} strokeWidth={2} className="md:w-7 md:h-7" />
        </button>

        {/* Chatbot Button */}
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-full shadow-2xl hover:shadow-chart-1/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <MessageCircle size={24} strokeWidth={2} className="md:w-7 md:h-7" />
        </button>
      </div>

      {/* Chatbot & Map Popups */}
      <ChatbotPopup
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
      <MapPopup isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </div>
  );
}
