"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Filter } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ExerciseCard } from "@/components/exercise-card";
import { ExerciseSearch } from "@/components/exercise-search";
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

export default function BreathingExercisesPage() {
  const router = useRouter();
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


        const { data, error: fetchError } = await supabase
          .from("exercises")
          .select("*")
          .eq("exercise_type", "breathing")
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
        setError(`Failed to load breathing exercises: ${errorMessage}`);
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
              Breathing Exercises
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Search Section */}
        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          <div className="text-center space-y-1 sm:space-y-2 mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Master the Power of Your Breath
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              Transform your health through conscious breathing
            </p>
          </div>

          <ExerciseSearch
            onSearch={setSearchQuery}
            placeholder="Search breathing techniques, stress relief, energizing..."
          />

          {/* Difficulty Filter */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <Filter size={18} className="text-muted-foreground sm:w-5 sm:h-5" />
            {["all", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedDifficulty === level
                    ? "bg-chart-2 text-white shadow-lg scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {level === "all" ? "All Levels" : level}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredExercises.length}
            </span>{" "}
            technique
            {filteredExercises.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-chart-2 mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Loading techniques...
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
              className="px-5 sm:px-6 py-2 text-sm sm:text-base bg-chart-2 text-white rounded-lg hover:bg-chart-2/90 transition-colors"
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
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🌬️</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              No techniques found
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <DashboardFloatingActions />
    </div>
  );
}
