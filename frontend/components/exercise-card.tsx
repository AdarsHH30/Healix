"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface ExerciseCardProps {
  name: string;
  description: string;
  imageUrl: string;
  gifUrl?: string;
  youtubeUrl: string;
  duration?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export function ExerciseCard({
  name,
  description,
  imageUrl,
  gifUrl,
  youtubeUrl,
  duration,
  difficulty,
}: ExerciseCardProps) {
  const handleCardClick = () => {
    window.open(youtubeUrl, "_blank", "noopener,noreferrer");
  };

  const difficultyColors = {
    Beginner: "bg-green-500/20 text-green-300 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-xl shadow-xl flex flex-col justify-end p-6 border border-transparent dark:border-neutral-800",
        "bg-cover bg-center",
        "hover:shadow-2xl hover:scale-[1.02]",
        "transition-all duration-500"
      )}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      {/* Preload hover gif */}
      {gifUrl && (
        <div
          className="fixed inset-0 opacity-0 z-[-1] pointer-events-none"
          style={{
            backgroundImage: `url(${gifUrl})`,
          }}
        />
      )}

      {/* Hover gif overlay */}
      {gifUrl && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-cover bg-center"
          style={{
            backgroundImage: `url(${gifUrl})`,
          }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/70 transition-all duration-500" />

      {/* Difficulty & Duration badges */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {difficulty && (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
              difficultyColors[difficulty]
            )}
          >
            {difficulty}
          </span>
        )}
        {duration && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm">
            {duration}
          </span>
        )}
      </div>

      {/* External link icon */}
      <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
          <ExternalLink size={20} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="text relative z-10">
        <h1 className="font-bold text-2xl md:text-3xl text-white relative mb-3 group-hover:text-chart-1 transition-colors duration-300">
          {name}
        </h1>
        <p className="font-normal text-sm md:text-base text-gray-200 relative line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          {description}
        </p>

        {/* Watch on YouTube hint */}
        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-chart-1 font-semibold uppercase tracking-wide">
            Click to watch on YouTube
          </span>
        </div>
      </div>
    </div>
  );
}
