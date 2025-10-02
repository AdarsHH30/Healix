"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ExerciseType = "physical" | "mental" | "breathing" | "nutrition";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface ExerciseFormData {
  name: string;
  description: string;
  imageUrl: string;
  gifUrl: string;
  youtubeUrl: string;
  duration: string;
  difficulty: Difficulty;
  category: string;
  exerciseType: ExerciseType;
}

export default function UploadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ExerciseFormData>({
    name: "",
    description: "",
    imageUrl: "",
    gifUrl: "",
    youtubeUrl: "",
    duration: "",
    difficulty: "Beginner",
    category: "",
    exerciseType: "physical",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Get current user (optional - can be null)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Insert exercise into database (anyone can upload for now)
      const { data, error } = await supabase.from("exercises").insert({
        name: formData.name,
        description: formData.description,
        image_url: formData.imageUrl,
        gif_url: formData.gifUrl || null,
        youtube_url: formData.youtubeUrl,
        duration: formData.duration || null,
        difficulty: formData.difficulty,
        category: formData.category,
        exercise_type: formData.exerciseType,
        created_by: user?.id || null,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Exercise uploaded successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        gifUrl: "",
        youtubeUrl: "",
        duration: "",
        difficulty: "Beginner",
        category: "",
        exerciseType: "physical",
      });

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to upload exercise",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">
              Upload Exercise
            </h1>

            <div className="w-[100px]" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <Check size={20} className="mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-muted/20 rounded-2xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-chart-1/20 rounded-xl">
              <Upload size={24} className="text-chart-1" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Add New Exercise
              </h2>
              <p className="text-muted-foreground text-sm">
                Fill in the details to add an exercise to the database
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Exercise Type *
              </label>
              <select
                name="exerciseType"
                value={formData.exerciseType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground"
              >
                <option value="physical">Physical Health</option>
                <option value="mental">Mental Health</option>
                <option value="breathing">Breathing Exercises</option>
                <option value="nutrition">Nutrition</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Exercise Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Push-Ups, Meditation, Box Breathing"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Detailed description of the exercise, benefits, and how to perform it..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                placeholder="e.g., upper body, cardio, meditation, stress relief"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 10-15 min, 3-4 sets, 30 sec"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Image URL *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* GIF URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GIF URL (Optional)
              </label>
              <input
                type="url"
                name="gifUrl"
                value={formData.gifUrl}
                onChange={handleInputChange}
                placeholder="https://media.giphy.com/..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                YouTube URL *
              </label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleInputChange}
                required
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-chart-1/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Exercise
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Helper Text */}
        <div className="mt-8 p-6 bg-muted/10 rounded-xl border border-border">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertCircle size={18} className="text-chart-1" />
            Tips for uploading exercises
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
            <li>Use high-quality images from Unsplash or similar sources</li>
            <li>GIFs should demonstrate the exercise in action (optional)</li>
            <li>YouTube links should point to quality tutorial videos</li>
            <li>Write clear, helpful descriptions with proper form tips</li>
            <li>
              Choose appropriate difficulty levels for your target audience
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
