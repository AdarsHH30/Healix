"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Filter, Dumbbell, Quote } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ExerciseCard } from "@/components/exercise-card";
import { ExerciseSearch } from "@/components/exercise-search";
import { QuotesDisplay } from "@/components/quotes-display";
import { supabase } from "@/lib/supabase";
import { DashboardFloatingActions } from "@/components/dashboard-floating-actions";
import { ThemeToggle } from "@/components/theme-toggle";

interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  gifUrl?: string;
  youtubeUrl: string;
  duration?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}

export default function MentalHealthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"exercises" | "quotes">(
    "exercises"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exercises from Supabase
  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);
        setError(null);


        // First, let's try to fetch all exercises to debug
        const { data: allData, error: allError } = await supabase
          .from("exercises")
          .select("*");


        const { data, error: fetchError } = await supabase
          .from("exercises")
          .select("*")
          .eq("exercise_type", "mental")
          .eq("is_active", true)
          .order("created_at", { ascending: false });


        if (fetchError) {
          throw fetchError;
        }

        // Transform data to match the Exercise interface
        const transformedData: Exercise[] = (data || []).map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          imageUrl: exercise.image_url,
          gifUrl: exercise.gif_url || undefined,
          youtubeUrl: exercise.youtube_url,
          duration: exercise.duration || undefined,
          difficulty: exercise.difficulty || undefined,
          category: exercise.category,
        }));

        setExercises(transformedData);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load exercises. Please try again later.";
        setError(`Failed to load mental health exercises: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const filteredExercises = useMemo(() => {

    const filtered = exercises.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        exercise.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });

    return filtered;
  }, [exercises, searchQuery, selectedDifficulty]);

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
              <span className="text-sm sm:text-base font-medium">Back</span>
            </button>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-foreground/90 tracking-tight">
              Mental Health & Wellness
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center space-y-1 sm:space-y-2 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Nurture Your Mind & Spirit
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Find peace and clarity through guided practices
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 sm:gap-3 p-1 bg-muted/30 rounded-xl w-full sm:w-fit mx-auto">
            <button
              onClick={() => setActiveTab("exercises")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 ${
                activeTab === "exercises"
                  ? "bg-background text-accent shadow-md font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Dumbbell size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
              <span className="text-sm sm:text-base">Exercises</span>
            </button>
            <button
              onClick={() => setActiveTab("quotes")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 ${
                activeTab === "quotes"
                  ? "bg-background text-accent shadow-md font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Quote size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
              <span className="text-sm sm:text-base">Quotes</span>
            </button>
          </div>
        </div>

        {/* Exercises Section */}
        {activeTab === "exercises" && (
          <>
            {/* Search Section */}
            <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
              <ExerciseSearch
                onSearch={setSearchQuery}
                placeholder="Search meditation, mindfulness, stress relief..."
              />

              {/* Difficulty Filter */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <Filter
                  size={18}
                  className="text-muted-foreground sm:w-5 sm:h-5"
                />
                {["all", "Beginner", "Intermediate", "Advanced"].map(
                  (level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                        selectedDifficulty === level
                          ? "bg-accent text-white shadow-lg scale-105"
                          : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      {level === "all" ? "All Levels" : level}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 sm:mb-6 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredExercises.length}
                </span>{" "}
                practice
                {filteredExercises.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-accent mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Loading practices...
                </p>
              </div>
            ) : error ? (
              /* Error State */
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                  Something went wrong
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 sm:px-6 py-2 text-sm sm:text-base bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredExercises.length > 0 ? (
              /* Exercise Cards Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    name={exercise.name}
                    description={exercise.description}
                    imageUrl={exercise.imageUrl}
                    gifUrl={exercise.gifUrl}
                    youtubeUrl={exercise.youtubeUrl}
                    duration={exercise.duration}
                    difficulty={exercise.difficulty}
                  />
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🧘</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                  No practices found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}

        {/* Quotes Section */}
        {activeTab === "quotes" && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Quote Display */}
            <QuotesDisplay />

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-muted/20 rounded-xl p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                  💭 Daily Inspiration
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  These quotes are carefully selected to provide comfort,
                  motivation, and perspective on your mental health journey.
                  Take a moment each day to reflect on these words of wisdom.
                </p>
              </div>
              <div className="bg-muted/20 rounded-xl p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                  🌱 Self-Care Reminder
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Remember that taking care of your mental health is not
                  selfish—it&apos;s essential. Be patient with yourself,
                  celebrate small victories, and don&apos;t hesitate to seek
                  support when needed.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <DashboardFloatingActions />
    </div>
  );
}
