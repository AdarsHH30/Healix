"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileCard } from "@/components/profile/profile-card";
import { StatsGrid } from "@/components/profile/stats-grid";
import { EmergencyContacts } from "@/components/profile/emergency-contacts";
import { FavoriteQuotes } from "@/components/profile/favorite-quotes";
import { UploadedExercises } from "@/components/profile/uploaded-exercises";
import { DashboardFloatingActions } from "@/components/dashboard-floating-actions";

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  emergency_phone_1?: string;
  emergency_phone_2?: string;
  created_at: string;
}

interface QuoteData {
  id: string;
  quote_text: string;
  author: string;
  category: string;
  text?: string;
  color?: string;
}

interface ExerciseData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  difficulty: string;
  exercise_type: string;
  category: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, session, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteQuotes, setFavoriteQuotes] = useState<Set<string>>(new Set());
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [uploadedExercises, setUploadedExercises] = useState<ExerciseData[]>(
    []
  );
  const [stats, setStats] = useState({
    totalUploads: 0,
    favoriteQuotesCount: 0,
    memberSince: "",
  });

  const loadQuotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        // Map quotes and use color from database, or fallback to category-based color
        const quotesWithColors = data.map((quote) => {
          // Use the color from database if it exists, otherwise determine by category
          let color = quote.color || "#6366f1"; // default chart-1 color

          // If no color in database, determine by category
          if (!quote.color) {
            const category = quote.category?.toLowerCase() || "";

            if (
              category.includes("motivation") ||
              category.includes("physical")
            ) {
              color = "#6366f1"; // chart-1
            } else if (
              category.includes("mental") ||
              category.includes("mindfulness")
            ) {
              color = "#8b5cf6"; // chart-2
            } else if (
              category.includes("wellness") ||
              category.includes("breathing")
            ) {
              color = "#06b6d4"; // chart-3
            } else if (
              category.includes("nutrition") ||
              category.includes("health")
            ) {
              color = "#10b981"; // chart-4
            }
          }

          return {
            ...quote,
            text: quote.quote_text,
            color: color,
          };
        });

        setQuotes(quotesWithColors);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    }
  }, []);

  const loadUploadedExercises = useCallback(async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("created_by", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setUploadedExercises(data);
      }
    } catch (error) {
      console.error("Error loading uploaded exercises:", error);
    }
  }, [user]);

  const loadFavorites = useCallback(async () => {
    try {
      if (!user) return;

      const { data } = await supabase
        .from("quote_favorites")
        .select("quote_id")
        .eq("user_id", user.id);

      if (data) {
        setFavoriteQuotes(new Set(data.map((fav) => fav.quote_id)));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, [user]);

  const handleRemoveFavorite = async (quoteId: string) => {
    if (!profile?.id) return;

    try {
      await supabase
        .from("quote_favorites")
        .delete()
        .eq("user_id", profile.id)
        .eq("quote_id", quoteId);

      const newFavorites = new Set(favoriteQuotes);
      newFavorites.delete(quoteId);
      setFavoriteQuotes(newFavorites);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const loadProfile = useCallback(async () => {
    try {
      // Don't try to load if we don't have a user yet
      if (!user) {
        return;
      }

      // Try to get profile from users table
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Update stats
        const memberSinceDate = new Date(
          profileData.created_at
        ).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        setStats((prev) => ({
          ...prev,
          memberSince: memberSinceDate,
        }));
      } else {
        // If no profile exists, use basic info from auth
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";
        const fullName =
          user.user_metadata?.full_name ||
          `${firstName} ${lastName}`.trim() ||
          "";

        setProfile({
          id: user.id,
          email: user.email || "",
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          created_at: user.created_at || new Date().toISOString(),
        });

        // Update stats
        const memberSinceDate = new Date(
          user.created_at || Date.now()
        ).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        setStats((prev) => ({
          ...prev,
          memberSince: memberSinceDate,
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Wait for auth to complete before checking
    if (authLoading) {
      return;
    }

    // If auth finished and there's no user, redirect to login
    if (!authLoading && !user && !session) {
      router.push("/login");
      return;
    }

    // If we have a user, load their profile
    if (user) {
      loadProfile();
      loadFavorites();
      loadQuotes();
      loadUploadedExercises();
    }
  }, [
    authLoading,
    user,
    session,
    loadProfile,
    loadFavorites,
    loadQuotes,
    loadUploadedExercises,
    router,
  ]);

  // Update stats when quotes and exercises are loaded
  useEffect(() => {
    if (uploadedExercises.length > 0 || favoriteQuotes.size > 0) {
      setStats((prev) => ({
        ...prev,
        totalUploads: uploadedExercises.length,
        favoriteQuotesCount: favoriteQuotes.size,
      }));
    }
  }, [uploadedExercises, favoriteQuotes]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, the useEffect will redirect
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />

      {/* Main Content - Fully Responsive */}
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-5xl">
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <ProfileCard profile={profile} onLogout={handleLogout} />

          {/* Quick Stats */}
          <StatsGrid
            totalUploads={stats.totalUploads}
            favoriteQuotesCount={stats.favoriteQuotesCount}
            memberSince={stats.memberSince}
          />

          {/* Emergency Contacts */}
          <EmergencyContacts
            primaryContact={profile?.emergency_phone_1}
            secondaryContact={profile?.emergency_phone_2}
          />

          {/* Favorited Quotes Section */}
          <FavoriteQuotes
            quotes={quotes}
            favoriteQuoteIds={favoriteQuotes}
            onRemoveFavorite={handleRemoveFavorite}
          />

          {/* Uploaded Exercises Section */}
          <UploadedExercises exercises={uploadedExercises} />
        </div>
      </main>

      {/* Floating Action Buttons */}
      <DashboardFloatingActions />
    </div>
  );
}
