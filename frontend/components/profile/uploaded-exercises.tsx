"use client";

import Image from "next/image";
import {
  Upload as UploadIcon,
  Calendar,
  Dumbbell,
  Brain,
  Wind,
  Apple,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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

interface UploadedExercisesProps {
  exercises: ExerciseData[];
}

export function UploadedExercises({ exercises }: UploadedExercisesProps) {
  const router = useRouter();

  if (exercises.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-dashed p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-4 bg-muted rounded-full w-fit mx-auto">
            <UploadIcon size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Share Your Knowledge
            </h3>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t uploaded any exercises yet. Share your favorite
              workouts and wellness tips with the community.
            </p>
          </div>
          <Button
            onClick={() => router.push("/upload")}
            className="gap-2"
            size="sm"
          >
            <UploadIcon size={14} />
            Upload Exercise
          </Button>
        </div>
      </div>
    );
  }

  const exercisesByType = {
    physical: exercises.filter(
      (ex) =>
        ex.exercise_type.toLowerCase() === "physical" ||
        ex.category.toLowerCase() === "physical"
    ),
    mental: exercises.filter(
      (ex) =>
        ex.exercise_type.toLowerCase() === "mental" ||
        ex.category.toLowerCase() === "mental"
    ),
    breathing: exercises.filter(
      (ex) =>
        ex.exercise_type.toLowerCase() === "breathing" ||
        ex.category.toLowerCase() === "breathing"
    ),
    nutrition: exercises.filter(
      (ex) =>
        ex.exercise_type.toLowerCase() === "nutrition" ||
        ex.category.toLowerCase() === "nutrition"
    ),
  };

  const typeConfig: Record<string, { icon: React.ElementType; label: string }> = {
    physical: { icon: Dumbbell, label: "Physical" },
    mental: { icon: Brain, label: "Mental" },
    breathing: { icon: Wind, label: "Breathing" },
    nutrition: { icon: Apple, label: "Nutrition" },
  };

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <UploadIcon size={20} className="text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Your Exercises
            </h3>
            <p className="text-sm text-muted-foreground">
              Exercises you&apos;ve shared
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
          {exercises.length}
        </span>
      </div>

      <div className="space-y-6">
        {Object.entries(exercisesByType).map(([type, typeExercises]) => {
          if (typeExercises.length === 0) return null;

          const config = typeConfig[type];
          const IconComponent = config.icon;

          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <IconComponent size={16} className="text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground capitalize">
                  {config.label} Exercises
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                  {typeExercises.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {typeExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-muted/30 rounded-lg border hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {exercise.image_url && (
                      <div className="relative h-32 overflow-hidden bg-muted">
                        <Image
                          src={exercise.image_url}
                          alt={exercise.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 rounded-md bg-background/90 text-xs font-medium text-foreground border backdrop-blur-sm">
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-medium text-foreground text-sm leading-tight">
                          {exercise.name}
                        </h5>
                        {!exercise.image_url && (
                          <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-foreground border whitespace-nowrap">
                            {exercise.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {exercise.description}
                      </p>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Calendar size={12} className="text-muted-foreground" />
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
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
