"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { ExerciseCard } from "@/components/exercise-card";
import { ExerciseSearch } from "@/components/exercise-search";

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

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Box Breathing",
    description:
      "Also known as square breathing, this Navy SEAL technique reduces stress and improves focus. Breathe in for 4, hold for 4, out for 4, hold for 4. Perfect for calming anxiety.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=tEmt1Znux58",
    duration: "5-10 min",
    difficulty: "Beginner",
    category: "stress relief",
  },
  {
    id: "2",
    name: "4-7-8 Breathing",
    description:
      "Dr. Andrew Weil's relaxation technique. Inhale for 4 counts, hold for 7, exhale for 8. Activates the parasympathetic nervous system for instant calm.",
    imageUrl:
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=gz4G31LGyog",
    duration: "5 min",
    difficulty: "Beginner",
    category: "relaxation",
  },
  {
    id: "3",
    name: "Diaphragmatic Breathing",
    description:
      "Deep belly breathing that engages your diaphragm. Increases oxygen intake, reduces blood pressure, and promotes full-body relaxation.",
    imageUrl:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=nJkWbAHL1XY",
    duration: "10 min",
    difficulty: "Beginner",
    category: "foundation",
  },
  {
    id: "4",
    name: "Alternate Nostril Breathing",
    description:
      "Ancient yogic technique (Nadi Shodhana) that balances left and right brain hemispheres. Reduces anxiety, improves focus, and harmonizes energy.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=8VwufJrUhic",
    duration: "5-10 min",
    difficulty: "Intermediate",
    category: "balance",
  },
  {
    id: "5",
    name: "Breath of Fire",
    description:
      "Powerful Kundalini yoga breathing technique. Rapid, rhythmic breaths that energize, detoxify, and strengthen the nervous system. Not for beginners.",
    imageUrl:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=0jCo9qVwA_k",
    duration: "3-5 min",
    difficulty: "Advanced",
    category: "energizing",
  },
  {
    id: "6",
    name: "Coherent Breathing",
    description:
      "Breathe at 5 breaths per minute (6-second inhale, 6-second exhale) to achieve optimal heart rate variability. Scientifically proven to reduce stress.",
    imageUrl:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=wfDTp2GogaQ",
    duration: "10-20 min",
    difficulty: "Beginner",
    category: "stress relief",
  },
  {
    id: "7",
    name: "Wim Hof Method",
    description:
      "Powerful breathing technique combined with cold exposure. Boosts immune system, increases energy, and improves mental resilience. Advanced practice.",
    imageUrl:
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    duration: "10-15 min",
    difficulty: "Advanced",
    category: "energizing",
  },
  {
    id: "8",
    name: "Ujjayi Breathing",
    description:
      "Ocean breath used in yoga practice. Creates soft sound by slightly constricting the throat. Builds heat, improves concentration, and calms the mind.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=nJkWbAHL1XY",
    duration: "5-15 min",
    difficulty: "Intermediate",
    category: "focus",
  },
  {
    id: "9",
    name: "Buteyko Breathing",
    description:
      "Reduces chronic hyperventilation through controlled breathing. Helps with asthma, anxiety, and sleep issues by normalizing CO2 levels.",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=mBqmP6KZTYA",
    duration: "10-15 min",
    difficulty: "Intermediate",
    category: "therapeutic",
  },
  {
    id: "10",
    name: "Pursed Lip Breathing",
    description:
      "Simple technique that slows breathing and improves oxygen exchange. Especially helpful for those with COPD or during panic attacks.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=FPq0BjYYWek",
    duration: "5 min",
    difficulty: "Beginner",
    category: "therapeutic",
  },
  {
    id: "11",
    name: "Resonance Breathing",
    description:
      "Breathe at your body's natural resonant frequency (typically 5-6 breaths/min). Maximizes heart rate variability and emotional balance.",
    imageUrl:
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=ZXAScFnNnwQ",
    duration: "10 min",
    difficulty: "Beginner",
    category: "relaxation",
  },
  {
    id: "12",
    name: "Physiological Sigh",
    description:
      "Stanford neuroscience technique: double inhale through nose, long exhale through mouth. Instantly reduces stress and anxiety in real-time.",
    imageUrl:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=rBdhqBGqiMc",
    duration: "1-2 min",
    difficulty: "Beginner",
    category: "stress relief",
  },
];

export default function BreathingExercisesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
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
  }, [searchQuery, selectedDifficulty]);

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-foreground/70 hover:text-foreground hover:bg-muted/50 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={20} strokeWidth={2} />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">
              Breathing Exercises
            </h1>
            <div className="w-[100px]" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8 space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-4xl font-bold text-foreground">
              Master the Power of Your Breath
            </h2>
            <p className="text-muted-foreground text-lg">
              Transform your health through conscious breathing
            </p>
          </div>

          <ExerciseSearch
            onSearch={setSearchQuery}
            placeholder="Search breathing techniques, stress relief, energizing..."
          />

          {/* Difficulty Filter */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Filter size={20} className="text-muted-foreground" />
            {["all", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredExercises.length}
            </span>{" "}
            technique
            {filteredExercises.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Exercise Cards Grid */}
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌬️</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No techniques found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
