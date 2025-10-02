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
    name: "Guided Meditation",
    description:
      "Learn the fundamentals of meditation to calm your mind, reduce stress, and improve focus. Perfect for beginners looking to start a mindfulness practice.",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=inpok4MKVLM",
    duration: "10-20 min",
    difficulty: "Beginner",
    category: "meditation",
  },
  {
    id: "2",
    name: "Mindfulness Practice",
    description:
      "Develop present-moment awareness through mindfulness exercises. Learn to observe thoughts without judgment and cultivate inner peace.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=6p_yaNFSYao",
    duration: "15 min",
    difficulty: "Beginner",
    category: "mindfulness",
  },
  {
    id: "3",
    name: "Anxiety Relief Techniques",
    description:
      "Evidence-based techniques to manage anxiety and panic. Learn grounding exercises, cognitive strategies, and calming methods for immediate relief.",
    imageUrl:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
    duration: "10 min",
    difficulty: "Beginner",
    category: "anxiety",
  },
  {
    id: "4",
    name: "Body Scan Meditation",
    description:
      "Progressive relaxation technique that promotes deep relaxation and body awareness. Releases tension and improves mind-body connection.",
    imageUrl:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=15q-N-_kkrU",
    duration: "20-30 min",
    difficulty: "Intermediate",
    category: "meditation",
  },
  {
    id: "5",
    name: "Positive Affirmations",
    description:
      "Rewire your thought patterns with powerful affirmations. Build self-esteem, confidence, and a positive mindset through daily practice.",
    imageUrl:
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=M7pAYDMi5lE",
    duration: "10 min",
    difficulty: "Beginner",
    category: "affirmations",
  },
  {
    id: "6",
    name: "Sleep Meditation",
    description:
      "Gentle guided meditation designed to help you fall asleep naturally. Release the day's stress and drift into peaceful, restorative sleep.",
    imageUrl:
      "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=aEqlQvczMJQ",
    duration: "30-45 min",
    difficulty: "Beginner",
    category: "sleep",
  },
  {
    id: "7",
    name: "Stress Management",
    description:
      "Comprehensive strategies for managing daily stress. Learn practical tools to maintain emotional balance and resilience in challenging situations.",
    imageUrl:
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=aNXKjGFLpJQ",
    duration: "15 min",
    difficulty: "Intermediate",
    category: "stress",
  },
  {
    id: "8",
    name: "Loving-Kindness Meditation",
    description:
      "Cultivate compassion and love for yourself and others. This ancient practice reduces negative emotions and increases feelings of connection.",
    imageUrl:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=sz7cpV7ERsM",
    duration: "15-20 min",
    difficulty: "Intermediate",
    category: "meditation",
  },
  {
    id: "9",
    name: "Gratitude Practice",
    description:
      "Transform your mindset through daily gratitude exercises. Scientific studies show gratitude practice significantly improves mental health and happiness.",
    imageUrl:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=nj2ofrX7jAk",
    duration: "5-10 min",
    difficulty: "Beginner",
    category: "gratitude",
  },
  {
    id: "10",
    name: "Yoga Nidra",
    description:
      "Yogic sleep meditation that induces deep relaxation while maintaining awareness. Perfect for stress relief, better sleep, and emotional healing.",
    imageUrl:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=M0u9GST_j3s",
    duration: "30-45 min",
    difficulty: "Advanced",
    category: "meditation",
  },
  {
    id: "11",
    name: "Emotional Release",
    description:
      "Guided practice for processing and releasing stored emotions. Learn healthy ways to acknowledge, express, and let go of difficult feelings.",
    imageUrl:
      "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=2ZYCMjzF7OE",
    duration: "20 min",
    difficulty: "Intermediate",
    category: "emotional",
  },
  {
    id: "12",
    name: "Focus & Concentration",
    description:
      "Train your mind to maintain sustained attention. Improve productivity, mental clarity, and cognitive performance through focused meditation.",
    imageUrl:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=u4gZgnCy5ew",
    duration: "15 min",
    difficulty: "Intermediate",
    category: "focus",
  },
];

export default function MentalHealthPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              Mental Health & Wellness
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
              Nurture Your Mind & Spirit
            </h2>
            <p className="text-muted-foreground text-lg">
              Find peace and clarity through guided practices
            </p>
          </div>

          <ExerciseSearch
            onSearch={setSearchQuery}
            placeholder="Search meditation, mindfulness, stress relief..."
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
                    ? "bg-accent text-white shadow-lg scale-105"
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
            Showing <span className="font-semibold text-foreground">{filteredExercises.length}</span> practice
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
            <div className="text-6xl mb-4">🧘</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No practices found
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
