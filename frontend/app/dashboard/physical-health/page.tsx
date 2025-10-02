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
    name: "Push-Ups",
    description:
      "A classic upper body exercise that strengthens your chest, shoulders, triceps, and core. Perfect for building overall upper body strength and can be modified for all fitness levels.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3oEduT5vXOXR3XT8DC/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    duration: "3-4 sets",
    difficulty: "Beginner",
    category: "upper body",
  },
  {
    id: "2",
    name: "Squats",
    description:
      "The king of leg exercises! Squats work your quads, hamstrings, glutes, and core. Essential for building lower body strength and improving mobility.",
    imageUrl:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/1qfDuNIDlobOJyBc00/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=aclHkVaku9U",
    duration: "3-4 sets",
    difficulty: "Beginner",
    category: "lower body",
  },
  {
    id: "3",
    name: "Plank",
    description:
      "An isometric core exercise that builds endurance in your abs, back, and stabilizer muscles. Improves posture and reduces back pain.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3oEduVHamwmt0R9kNq/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=pvIjsG5Svck",
    duration: "30-60 sec",
    difficulty: "Beginner",
    category: "core",
  },
  {
    id: "4",
    name: "Burpees",
    description:
      "A full-body cardio powerhouse that combines a squat, plank, push-up, and jump. Burns calories fast and builds explosive strength and endurance.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/4Hx5nJBfi8FzFWxztb/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=JZQA08SlJnM",
    duration: "3-4 sets",
    difficulty: "Advanced",
    category: "full body",
  },
  {
    id: "5",
    name: "Lunges",
    description:
      "Unilateral leg exercise that targets quads, glutes, and hamstrings while improving balance and coordination. Great for functional fitness.",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3o7TKPxbMLKWTulDq0/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
    duration: "3 sets",
    difficulty: "Beginner",
    category: "lower body",
  },
  {
    id: "6",
    name: "Pull-Ups",
    description:
      "The ultimate back and bicep builder. Pull-ups develop upper body pulling strength and create a strong, defined back and arms.",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/5t9IcoRJ4RikXzJCN6/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    duration: "3-4 sets",
    difficulty: "Intermediate",
    category: "upper body",
  },
  {
    id: "7",
    name: "Mountain Climbers",
    description:
      "Dynamic cardio exercise that engages your core, shoulders, and legs. Excellent for building cardiovascular endurance and core strength simultaneously.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3oEduU6VEgVE3uRqko/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
    duration: "3-4 sets",
    difficulty: "Intermediate",
    category: "cardio",
  },
  {
    id: "8",
    name: "Deadlifts",
    description:
      "A compound exercise that works nearly every muscle in your body. Builds massive strength in your posterior chain, including glutes, hamstrings, and back.",
    imageUrl:
      "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3oEduVHamwmt0R9kNq/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    duration: "3-4 sets",
    difficulty: "Advanced",
    category: "full body",
  },
  {
    id: "9",
    name: "Bicycle Crunches",
    description:
      "Effective core exercise targeting obliques and rectus abdominis. Great for building rotational strength and defining your midsection.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3oEduVHamwmt0R9kNq/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=Iwyvozckjak",
    duration: "3 sets",
    difficulty: "Beginner",
    category: "core",
  },
  {
    id: "10",
    name: "Jump Rope",
    description:
      "High-intensity cardio that improves coordination, burns calories, and strengthens your calves. Perfect for warming up or standalone cardio sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/xT0xeBXHFg3BLth9n2/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=FJmRQ5iTXKE",
    duration: "10-15 min",
    difficulty: "Intermediate",
    category: "cardio",
  },
  {
    id: "11",
    name: "Dips",
    description:
      "Compound upper body exercise that targets triceps, chest, and shoulders. Excellent for building upper body pushing strength and muscle mass.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3o7TKPxbMLKWTulDq0/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As",
    duration: "3 sets",
    difficulty: "Intermediate",
    category: "upper body",
  },
  {
    id: "12",
    name: "Running",
    description:
      "Classic cardiovascular exercise that builds endurance, burns calories, and strengthens your heart. Accessible and effective for overall fitness.",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop",
    gifUrl:
      "https://media.giphy.com/media/3o7TKPxbMLKWTulDq0/giphy.gif",
    youtubeUrl: "https://www.youtube.com/watch?v=RRoUJVjSikQ",
    duration: "20-30 min",
    difficulty: "Beginner",
    category: "cardio",
  },
];

export default function PhysicalHealthPage() {
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
              Physical Training
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
              Discover Your Perfect Workout
            </h2>
            <p className="text-muted-foreground text-lg">
              Find exercises tailored to your fitness goals
            </p>
          </div>

          <ExerciseSearch
            onSearch={setSearchQuery}
            placeholder="Search exercises by name, category, or type..."
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
                    ? "bg-chart-1 text-white shadow-lg scale-105"
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
            Showing <span className="font-semibold text-foreground">{filteredExercises.length}</span> exercise
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No exercises found
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
