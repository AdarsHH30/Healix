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
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        // Map quotes and add color based on category
        const quotesWithColors = data.map((quote) => {
          let color = "#6366f1"; // default chart-1 color
          const category = quote.category.toLowerCase();

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
                  {profile?.first_name && profile?.last_name && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User size={16} />
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
            <div className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-xl border border-chart-1/20 p-6 hover:shadow-lg hover:shadow-chart-1/10 transition-all duration-300">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-1/20 rounded-lg">
                    <UploadIcon className="text-chart-1" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalUploads}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Uploads
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-xl border border-chart-2/20 p-6 hover:shadow-lg hover:shadow-chart-2/10 transition-all duration-300">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-2/20 rounded-lg">
                    <Heart className="text-chart-2" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.favoriteQuotesCount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Favorite Quotes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 rounded-xl border border-chart-3/20 p-6 hover:shadow-lg hover:shadow-chart-3/10 transition-all duration-300">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-chart-3/20 rounded-lg">
                    <Calendar className="text-chart-3" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.memberSince}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Member Since
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          {(profile?.emergency_phone_1 || profile?.emergency_phone_2) && (
            <div className="bg-muted/20 rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Phone size={24} className="text-chart-4" />
                <h3 className="text-xl font-bold text-foreground">
                  Emergency Contacts
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.emergency_phone_1 && (
                  <div className="flex items-center gap-3 p-4 bg-chart-4/5 rounded-lg border border-chart-4/20">
                    <Phone size={18} className="text-chart-4" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contact 1</p>
                      <p className="text-sm font-medium text-foreground">
                        {profile.emergency_phone_1}
                      </p>
                    </div>
                  </div>
                )}
                {profile?.emergency_phone_2 && (
                  <div className="flex items-center gap-3 p-4 bg-chart-4/5 rounded-lg border border-chart-4/20">
                    <Phone size={18} className="text-chart-4" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contact 2</p>
                      <p className="text-sm font-medium text-foreground">
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
              <div className="flex items-center gap-3 mb-6">
                <Heart size={24} className="text-red-500" fill="currentColor" />
                <h3 className="text-xl font-bold text-foreground">
                  Your Favorite Quotes
                </h3>
                <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-sm font-medium text-red-600 dark:text-red-400">
                  {favoriteQuotes.size}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotes
                  .filter((quote) => favoriteQuotes.has(quote.id))
                  .map((quote) => (
                    <div
                      key={quote.id}
                      className="group relative bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 transition-all duration-300 overflow-hidden"
                    >
                      {/* Color Accent Bar */}
                      <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: quote.color }}
                      />

                      {/* Card Content */}
                      <div className="p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
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
                            className="p-2 rounded-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all duration-300"
                            aria-label="Remove from favorites"
                          >
                            <Heart
                              size={18}
                              className="text-red-500"
                              fill="currentColor"
                              strokeWidth={2}
                            />
                          </button>
                        </div>

                        {/* Quote Text */}
                        <blockquote className="text-sm text-foreground/90 leading-relaxed">
                          &quot;{quote.text}&quot;
                        </blockquote>

                        {/* Author */}
                        <p className="text-xs font-medium text-muted-foreground">
                          — {quote.author}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted/20 rounded-2xl border border-border p-6 md:p-8 text-center">
              <Heart
                size={48}
                className="text-muted-foreground/30 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Favorite Quotes Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Visit the Mental Health section on your dashboard to discover
                and save inspirational quotes.
              </p>
              <Button
                onClick={() => router.push("/dashboard/mental-health")}
                variant="outline"
                className="gap-2"
              >
                <Heart size={16} />
                Explore Quotes
              </Button>
            </div>
          )}

          {/* Uploaded Exercises Section */}
          {uploadedExercises.length > 0 ? (
            <div className="bg-muted/20 rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <UploadIcon size={24} className="text-chart-4" />
                <h3 className="text-xl font-bold text-foreground">
                  Your Uploaded Exercises
                </h3>
                <span className="px-3 py-1 rounded-full bg-chart-4/20 text-sm font-medium text-chart-4">
                  {uploadedExercises.length}
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

                const typeColors: Record<
                  string,
                  { bg: string; border: string; text: string }
                > = {
                  physical: {
                    bg: "from-chart-1/10 to-chart-1/5",
                    border: "border-chart-1/30",
                    text: "text-chart-1",
                  },
                  mental: {
                    bg: "from-chart-2/10 to-chart-2/5",
                    border: "border-chart-2/30",
                    text: "text-chart-2",
                  },
                  breathing: {
                    bg: "from-chart-3/10 to-chart-3/5",
                    border: "border-chart-3/30",
                    text: "text-chart-3",
                  },
                  nutrition: {
                    bg: "from-chart-4/10 to-chart-4/5",
                    border: "border-chart-4/30",
                    text: "text-chart-4",
                  },
                };

                const colors = typeColors[type];

                return (
                  <div key={type} className="mb-6 last:mb-0">
                    <h4 className="text-lg font-semibold text-foreground mb-3 capitalize">
                      {type} Exercises ({exercisesOfType.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exercisesOfType.map((exercise) => (
                        <div
                          key={exercise.id}
                          className={`group bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} p-5 hover:shadow-lg transition-all duration-300`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h5
                              className={`font-semibold text-foreground group-hover:${colors.text} transition-colors`}
                            >
                              {exercise.name}
                            </h5>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${colors.text} bg-background/50`}
                            >
                              {exercise.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {exercise.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Calendar
                              size={14}
                              className="text-muted-foreground"
                            />
                            <span className="text-xs text-muted-foreground">
                              {new Date(exercise.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-muted/20 rounded-2xl border border-border p-6 md:p-8 text-center">
              <UploadIcon
                size={48}
                className="text-muted-foreground/30 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Uploaded Exercises Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your knowledge with the community by uploading your own
                exercises.
              </p>
              <Button
                onClick={() => router.push("/upload")}
                variant="outline"
                className="gap-2"
              >
                <UploadIcon size={16} />
                Upload Exercise
              </Button>
            </div>
          )}

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
