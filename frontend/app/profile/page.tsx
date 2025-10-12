"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  LogOut,
  MessageCircle,
  MapPin,
  Heart,
  Upload as UploadIcon,
  Star,
  Phone,
  Edit,
  Settings,
  Activity,
  Dumbbell,
  Brain,
  Wind,
  Apple,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";
import { useAuth } from "@/components/auth-provider";

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
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
          <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-background rounded-2xl border border-border p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-background">
                  {profile?.full_name
                    ? profile.full_name.charAt(0).toUpperCase()
                    : profile?.email.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                  <Activity size={14} className="text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                    {profile?.full_name || "User"}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Active Member
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg">
                    <Mail size={16} className="text-chart-1 flex-shrink-0" />
                    <span className="truncate">{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg">
                    <Calendar
                      size={16}
                      className="text-chart-2 flex-shrink-0"
                    />
                    <span>Since {formatDate(profile?.created_at || "")}</span>
                  </div>
                  {profile?.first_name && profile?.last_name && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg sm:col-span-2">
                      <User size={16} className="text-chart-3 flex-shrink-0" />
                      <span>
                        {profile.first_name} {profile.last_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button
                  onClick={() => router.push("/upload")}
                  className="w-full md:w-auto gap-2 bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 shadow-lg shadow-chart-1/20"
                >
                  <UploadIcon size={16} />
                  Upload Exercise
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full md:w-auto gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200/50 dark:border-blue-900/50 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                  <UploadIcon
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalUploads}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Uploads
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-900/50 p-6 hover:shadow-xl hover:shadow-red-500/10 hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors" />
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl ring-2 ring-red-500/20 group-hover:ring-red-500/40 transition-all">
                  <Heart
                    className="text-red-600 dark:text-red-400"
                    size={24}
                    fill="currentColor"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-foreground">
                    {stats.favoriteQuotesCount}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Favorite Quotes
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 rounded-xl border-2 border-cyan-200/50 dark:border-cyan-900/50 p-6 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all">
                  <Calendar
                    className="text-cyan-600 dark:text-cyan-400"
                    size={24}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.memberSince}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Member Since
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          {(profile?.emergency_phone_1 || profile?.emergency_phone_2) && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl border-2 border-orange-200/50 dark:border-orange-900/50 p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/10 rounded-lg ring-2 ring-orange-500/20">
                  <Phone
                    size={24}
                    className="text-orange-600 dark:text-orange-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Emergency Contacts
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your saved emergency numbers
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.emergency_phone_1 && (
                  <div className="group flex items-center gap-3 p-4 bg-white/50 dark:bg-background/50 rounded-xl border-2 border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-800 hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                      <Phone
                        size={18}
                        className="text-orange-600 dark:text-orange-400"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Primary Contact
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {profile.emergency_phone_1}
                      </p>
                    </div>
                  </div>
                )}
                {profile?.emergency_phone_2 && (
                  <div className="group flex items-center gap-3 p-4 bg-white/50 dark:bg-background/50 rounded-xl border-2 border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-800 hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                      <Phone
                        size={18}
                        className="text-orange-600 dark:text-orange-400"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Secondary Contact
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {profile.emergency_phone_2}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Favorited Quotes Section */}
          {favoriteQuotes.size > 0 ? (
            <div className="bg-muted/20 rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <Heart
                      size={24}
                      className="text-red-500"
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Your Favorite Quotes
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Quotes that inspire and motivate you
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  {favoriteQuotes.size} saved
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotes
                  .filter((quote) => favoriteQuotes.has(quote.id))
                  .map((quote) => (
                    <div
                      key={quote.id}
                      className="group relative bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 overflow-hidden"
                    >
                      {/* Color Accent Bar */}
                      <div
                        className="h-1.5 w-full transition-all duration-300"
                        style={{ backgroundColor: quote.color }}
                      />

                      {/* Card Content */}
                      <div className="p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300"
                            style={{
                              backgroundColor: `${quote.color}15`,
                              borderColor: `${quote.color}40`,
                              color: quote.color,
                            }}
                          >
                            <TrendingUp size={12} />
                            {quote.category}
                          </div>

                          <button
                            onClick={() => handleRemoveFavorite(quote.id)}
                            className="p-2 rounded-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all duration-300 group/button"
                            aria-label="Remove from favorites"
                            title="Remove from favorites"
                          >
                            <Heart
                              size={18}
                              className="text-red-500 group-hover/button:scale-110 transition-transform duration-300"
                              fill="currentColor"
                              strokeWidth={2}
                            />
                          </button>
                        </div>

                        {/* Quote Text */}
                        <blockquote className="text-sm text-foreground/90 leading-relaxed font-medium">
                          &quot;{quote.text}&quot;
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <p className="text-xs font-medium text-muted-foreground">
                            — {quote.author}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="text-xs text-muted-foreground">
                              Favorite
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-red-50/30 to-pink-50/30 dark:from-red-950/10 dark:to-pink-950/10 rounded-2xl border-2 border-dashed border-red-200/50 dark:border-red-900/50 p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                  <div className="relative p-4 bg-background rounded-full">
                    <Heart size={48} className="text-red-500 mx-auto" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Discover Inspiring Quotes
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start building your collection of motivational quotes.
                    Explore the Mental Health section to find quotes that
                    resonate with you and save them to your favorites.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => router.push("/dashboard/mental-health")}
                    className="gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  >
                    <Heart size={16} />
                    Explore Quotes
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {[
                    "Motivation",
                    "Mindfulness",
                    "Wellness",
                    "Empowerment",
                    "Healing",
                  ].map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1.5 bg-background/60 border border-border/50 rounded-full text-xs font-medium text-muted-foreground"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Uploaded Exercises Section */}
          {uploadedExercises.length > 0 ? (
            <div className="bg-muted/20 rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-4/20 rounded-lg">
                    <UploadIcon size={24} className="text-chart-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Your Uploaded Exercises
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Exercises you've shared with the community
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-chart-4/20 text-sm font-medium text-chart-4">
                  {uploadedExercises.length} total
                </span>
              </div>

              {/* Group exercises by type */}
              {["physical", "mental", "breathing", "nutrition"].map((type) => {
                const exercisesOfType = uploadedExercises.filter(
                  (ex) =>
                    ex.exercise_type.toLowerCase() === type.toLowerCase() ||
                    ex.category.toLowerCase() === type.toLowerCase()
                );

                if (exercisesOfType.length === 0) return null;

                const typeConfig: Record<
                  string,
                  {
                    bg: string;
                    border: string;
                    text: string;
                    icon: any;
                    iconColor: string;
                  }
                > = {
                  physical: {
                    bg: "from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20",
                    border:
                      "border-blue-200/50 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-800",
                    text: "text-blue-600 dark:text-blue-400",
                    icon: Dumbbell,
                    iconColor: "#6366f1",
                  },
                  mental: {
                    bg: "from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20",
                    border:
                      "border-purple-200/50 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-800",
                    text: "text-purple-600 dark:text-purple-400",
                    icon: Brain,
                    iconColor: "#8b5cf6",
                  },
                  breathing: {
                    bg: "from-cyan-50/50 to-teal-50/50 dark:from-cyan-950/20 dark:to-teal-950/20",
                    border:
                      "border-cyan-200/50 dark:border-cyan-900/50 hover:border-cyan-300 dark:hover:border-cyan-800",
                    text: "text-cyan-600 dark:text-cyan-400",
                    icon: Wind,
                    iconColor: "#06b6d4",
                  },
                  nutrition: {
                    bg: "from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20",
                    border:
                      "border-green-200/50 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-800",
                    text: "text-green-600 dark:text-green-400",
                    icon: Apple,
                    iconColor: "#10b981",
                  },
                };

                const config = typeConfig[type];
                const IconComponent = config.icon;

                return (
                  <div key={type} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-4">
                      <IconComponent size={20} className={config.text} />
                      <h4
                        className={`text-lg font-semibold capitalize ${config.text}`}
                      >
                        {type} Exercises
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.text} bg-background/50`}
                      >
                        {exercisesOfType.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exercisesOfType.map((exercise) => (
                        <div
                          key={exercise.id}
                          className={`group relative bg-gradient-to-br ${config.bg} rounded-xl border-2 ${config.border} hover:shadow-lg transition-all duration-300 overflow-hidden`}
                        >
                          {/* Color accent bar */}
                          <div
                            className="absolute top-0 left-0 w-1 h-full"
                            style={{ backgroundColor: config.iconColor }}
                          />

                          {/* Exercise Image */}
                          {exercise.image_url && (
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={exercise.image_url}
                                alt={exercise.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                              <div className="absolute bottom-2 right-2">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.text} bg-background/90 backdrop-blur-sm border border-current/30 shadow-lg`}
                                >
                                  {exercise.difficulty}
                                </span>
                              </div>
                            </div>
                          )}

                          <div
                            className={`p-5 ${
                              exercise.image_url ? "" : "pl-7"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <h5 className="font-semibold text-foreground text-base leading-tight">
                                {exercise.name}
                              </h5>
                              {!exercise.image_url && (
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.text} bg-background/80 border border-current/20`}
                                >
                                  {exercise.difficulty}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {exercise.description}
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t border-current/10">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={14}
                                  className="text-muted-foreground"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    exercise.created_at
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <Activity size={14} className={config.text} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl border-2 border-dashed border-border p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-chart-4/20 blur-2xl rounded-full" />
                  <div className="relative p-4 bg-background rounded-full">
                    <UploadIcon size={48} className="text-chart-4 mx-auto" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Share Your Knowledge
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You haven't uploaded any exercises yet. Share your favorite
                    workouts, meditation techniques, or wellness tips with the
                    Healix community!
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => router.push("/upload")}
                    className="gap-2 bg-gradient-to-r from-chart-4 to-chart-3 hover:from-chart-4/90 hover:to-chart-3/90"
                  >
                    <UploadIcon size={16} />
                    Upload Your First Exercise
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="p-3 bg-muted/30 rounded-lg text-left">
                    <Dumbbell size={16} className="text-chart-1 mb-1" />
                    <p className="text-xs font-medium text-foreground">
                      Physical
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-left">
                    <Brain size={16} className="text-chart-2 mb-1" />
                    <p className="text-xs font-medium text-foreground">
                      Mental
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-left">
                    <Wind size={16} className="text-chart-3 mb-1" />
                    <p className="text-xs font-medium text-foreground">
                      Breathing
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-left">
                    <Apple size={16} className="text-chart-4 mb-1" />
                    <p className="text-xs font-medium text-foreground">
                      Nutrition
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/10 dark:to-blue-950/10 rounded-2xl border border-border p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-chart-1 to-chart-2 rounded-xl">
                <Settings size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Your Healix Journey
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Welcome to your personal wellness dashboard
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex gap-3 p-4 bg-background/50 rounded-xl border border-border/50">
                <Dumbbell
                  size={20}
                  className="text-chart-1 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    Physical Health
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Access exercises and workouts tailored to your fitness goals
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-background/50 rounded-xl border border-border/50">
                <Brain
                  size={20}
                  className="text-chart-2 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    Mental Wellness
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Find inspirational quotes and mindfulness practices
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-background/50 rounded-xl border border-border/50">
                <Wind size={20} className="text-chart-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    Breathing Exercises
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Practice breathing techniques for stress and relaxation
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-background/50 rounded-xl border border-border/50">
                <Apple
                  size={20}
                  className="text-chart-4 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    Nutrition Guide
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Discover healthy eating habits and balanced diet tips
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-chart-1/5 to-chart-2/5 rounded-xl border border-chart-1/20">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Pro tip:</span>{" "}
                Upload your own exercises to share with the community and help
                others on their wellness journey!
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
