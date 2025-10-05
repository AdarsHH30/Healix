"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Check,
  AlertCircle,
  ImagePlus,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";

type ExerciseType = "physical" | "mental" | "breathing" | "nutrition";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface ExerciseFormData {
  name: string;
  description: string;
  imageUrl: string;
  imageFile: File | null;
  youtubeUrl: string;
  duration: string;
  difficulty: Difficulty;
  category: string;
  exerciseType: ExerciseType;
}

export default function UploadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ExerciseFormData>({
    name: "",
    description: "",
    imageUrl: "",
    imageFile: null,
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: "Please select a valid image file",
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image file size should be less than 5MB",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, imageFile: file, imageUrl: "" }));
      setMessage(null);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `exercise-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("exercises")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("exercises").getPublicUrl(filePath);

      return publicUrl;
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      setMessage({
        type: "error",
        text: "Failed to upload image. Using URL instead if provided.",
      });
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let finalImageUrl = formData.imageUrl;

      // If user uploaded a file, upload it to Supabase Storage
      if (formData.imageFile) {
        const uploadedUrl = await uploadImageToStorage(formData.imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else if (!formData.imageUrl) {
          throw new Error("Please provide either an image file or URL");
        }
      }

      if (!finalImageUrl) {
        throw new Error("Please provide either an image file or URL");
      }

      // Get current user (optional - can be null)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Insert exercise into database
      const { data, error } = await supabase.from("exercises").insert({
        name: formData.name,
        description: formData.description,
        image_url: finalImageUrl,
        gif_url: null, // GIF is now optional and not exposed in UI
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
        imageFile: null,
        youtubeUrl: "",
        duration: "",
        difficulty: "Beginner",
        category: "",
        exerciseType: "physical",
      });

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to upload exercise",
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

            {/* Image Upload - File or URL */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">
                Exercise Image *
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div>
                  <label
                    htmlFor="imageFile"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-chart-1 transition-colors bg-background/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WebP (max 5MB)
                      </p>
                    </div>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.imageFile && (
                    <p className="mt-2 text-sm text-green-500">
                      ✓ {formData.imageFile.name}
                    </p>
                  )}
                </div>

                {/* OR Separator */}
                <div className="flex items-center justify-center md:col-span-1">
                  <span className="text-sm text-muted-foreground font-medium">
                    OR
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                disabled={!!formData.imageFile}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Provide either an image file or a URL
              </p>
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
                disabled={isSubmitting || isUploadingImage}
                className="w-full px-6 py-4 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-chart-1/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting || isUploadingImage ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isUploadingImage
                      ? "Uploading Image..."
                      : "Uploading Exercise..."}
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
            <li>
              Upload images directly or use URLs from Unsplash or similar
              sources
            </li>
            <li>Images should be high-quality and clearly show the exercise</li>
            <li>YouTube links should point to quality tutorial videos</li>
            <li>Write clear, helpful descriptions with proper form tips</li>
            <li>
              Choose appropriate difficulty levels for your target audience
            </li>
          </ul>
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
