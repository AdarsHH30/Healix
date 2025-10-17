"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Check,
  AlertCircle,
  ImagePlus,
  MessageCircle,
  MapPin,
  Dumbbell,
  Quote,
  Utensils,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";

type UploadType = "exercise" | "quote" | "nutrition";
type ExerciseType = "physical" | "mental" | "breathing";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type QuoteCategory =
  | "Self-Compassion"
  | "Emotions"
  | "Healing"
  | "Hope"
  | "Identity"
  | "Journey"
  | "Mindset"
  | "Empowerment"
  | "Acceptance"
  | "Motivation"
  | "Inspiration"
  | "Mindfulness"
  | "Health"
  | "Wellness";
type NutritionDifficulty = "Easy" | "Medium" | "Hard";
type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type NutritionCategory =
  | "weight-loss"
  | "muscle-gain"
  | "balanced"
  | "vegan"
  | "keto"
  | "paleo"
  | "vegetarian"
  | "high-protein"
  | "low-carb";

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

interface QuoteFormData {
  text: string;
  author: string;
  category: QuoteCategory;
  color: string;
}

interface NutritionFormData {
  title: string;
  description: string;
  imageUrl: string;
  imageFile: File | null;
  youtubeUrl: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  mealType: MealType;
  category: NutritionCategory;
  prepTime: string;
  difficulty: NutritionDifficulty;
  ingredients: string;
  instructions: string;
  benefits: string;
}

// Category options based on exercise type
const categoryOptions: Record<ExerciseType, string[]> = {
  physical: [
    "cardio",
    "strength",
    "flexibility",
    "balance",
    "endurance",
    "upper body",
    "lower body",
    "core",
    "full body",
  ],
  mental: [
    "meditation",
    "mindfulness",
    "stress relief",
    "focus",
    "anxiety",
    "depression",
    "relaxation",
    "self-care",
  ],
  breathing: [
    "deep breathing",
    "box breathing",
    "4-7-8 technique",
    "pranayama",
    "stress relief",
    "relaxation",
    "energy",
  ],
};

export default function UploadPage() {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<UploadType>("exercise");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initialize Supabase client
  const supabase = createClient();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const [quoteData, setQuoteData] = useState<QuoteFormData>({
    text: "",
    author: "",
    category: "Motivation",
    color: "#FF5C5C",
  });

  const [nutritionData, setNutritionData] = useState<NutritionFormData>({
    title: "",
    description: "",
    imageUrl: "",
    imageFile: null,
    youtubeUrl: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    mealType: "breakfast",
    category: "balanced",
    prepTime: "",
    difficulty: "Easy",
    ingredients: "",
    instructions: "",
    benefits: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Clear image preview if URL is being set
    if (name === "imageUrl" && value) {
      setImagePreview(null);
    }

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

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Update the appropriate form data based on upload type
      if (uploadType === "exercise") {
        setFormData((prev) => ({ ...prev, imageFile: file, imageUrl: "" }));
      } else if (uploadType === "nutrition") {
        setNutritionData((prev) => ({
          ...prev,
          imageFile: file,
          imageUrl: "",
        }));
      }
      setMessage(null);
    }
  };

  const uploadImageToStorage = async (
    file: File,
    type: "exercise" | "nutrition" = "exercise"
  ): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath =
        type === "exercise"
          ? `exercise-images/${fileName}`
          : `nutrition-images/${fileName}`;

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
      // Validate inputs
      if (!formData.name.trim()) {
        throw new Error("Exercise name is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.category.trim()) {
        throw new Error("Please select a category");
      }
      if (!formData.youtubeUrl.trim()) {
        throw new Error("YouTube URL is required");
      }

      let finalImageUrl = formData.imageUrl;

      // If user uploaded a file, upload it to Supabase Storage
      if (formData.imageFile) {
        const uploadedUrl = await uploadImageToStorage(
          formData.imageFile,
          "exercise"
        );
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

      // Prepare exercise data
      const exerciseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image_url: finalImageUrl,
        gif_url: null, // GIF is now optional and not exposed in UI
        youtube_url: formData.youtubeUrl.trim(),
        duration: formData.duration.trim() || null,
        difficulty: formData.difficulty,
        category: formData.category.trim(),
        exercise_type: formData.exerciseType,
        created_by: user?.id || null,
        is_active: true,
      };

      // Insert exercise into database
      const { data: insertedData, error } = await supabase
        .from("exercises")
        .insert(exerciseData)
        .select();

      if (error) {
        throw new Error(
          error.message || "Failed to upload exercise to database"
        );
      }

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
      setImagePreview(null);

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to upload exercise",
      });
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate inputs
      if (!quoteData.text.trim()) {
        throw new Error("Quote text is required");
      }
      if (!quoteData.author.trim()) {
        throw new Error("Author is required");
      }
      if (!quoteData.category) {
        throw new Error("Category is required");
      }
      if (!quoteData.color) {
        throw new Error("Color is required");
      }

      // Get current user (optional - can be null)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
      }


      // Prepare quote data - match database schema
      const quoteDataToInsert = {
        quote_text: quoteData.text.trim(), // Changed from 'text' to 'quote_text'
        author: quoteData.author.trim(),
        category: quoteData.category,
        color: quoteData.color,
        created_by: user?.id || null,
        is_active: true,
      };


      // Insert quote into database (ID will be auto-generated as UUID)
      const { data: insertedData, error } = await supabase
        .from("quotes")
        .insert(quoteDataToInsert)
        .select();

      if (error) {
        throw new Error(error.message || "Failed to upload quote to database");
      }


      setMessage({
        type: "success",
        text: "Quote uploaded successfully!",
      });

      // Reset form
      setQuoteData({
        text: "",
        author: "",
        category: "Motivation",
        color: "#FF5C5C",
      });

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to upload quote",
      });
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNutritionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate inputs
      if (!nutritionData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!nutritionData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!nutritionData.ingredients.trim()) {
        throw new Error("Ingredients are required");
      }
      if (!nutritionData.instructions.trim()) {
        throw new Error("Instructions are required");
      }
      if (!nutritionData.benefits.trim()) {
        throw new Error("Benefits are required");
      }

      let finalImageUrl = nutritionData.imageUrl;

      // If user uploaded a file, upload it to Supabase Storage
      if (nutritionData.imageFile) {
        const uploadedUrl = await uploadImageToStorage(
          nutritionData.imageFile,
          "nutrition"
        );
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else if (!nutritionData.imageUrl) {
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

      // Process arrays from comma-separated strings
      const ingredientsArray = nutritionData.ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const instructionsArray = nutritionData.instructions
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const benefitsArray = nutritionData.benefits
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);


      // Insert nutrition plan into database
      const { data: _data, error } = await supabase
        .from("nutrition_plans")
        .insert({
          title: nutritionData.title,
          description: nutritionData.description,
          image_url: finalImageUrl,
          youtube_url: nutritionData.youtubeUrl.trim() || null,
          calories: nutritionData.calories,
          protein: nutritionData.protein,
          carbs: nutritionData.carbs,
          fats: nutritionData.fats,
          meal_type: nutritionData.mealType,
          category: nutritionData.category,
          prep_time: nutritionData.prepTime,
          difficulty: nutritionData.difficulty,
          ingredients: ingredientsArray,
          instructions: instructionsArray,
          benefits: benefitsArray,
          created_by: user?.id || null,
          is_active: true,
        });

      if (error) {
        throw new Error(
          error.message || "Failed to upload nutrition plan to database"
        );
      }

      setMessage({
        type: "success",
        text: "Nutrition plan uploaded successfully!",
      });

      // Reset form
      setNutritionData({
        title: "",
        description: "",
        imageUrl: "",
        imageFile: null,
        youtubeUrl: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        mealType: "breakfast",
        category: "balanced",
        prepTime: "",
        difficulty: "Easy",
        ingredients: "",
        instructions: "",
        benefits: "",
      });
      setImagePreview(null);

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to upload nutrition plan",
      });
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-chart-1/30 border-t-chart-1 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-muted/20 rounded-2xl border border-border p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-6">
              You must be logged in to upload content. Please log in to
              continue.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full px-6 py-3 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-chart-1/50 transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
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
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">
              Upload Content
            </h1>

            <div className="w-[100px]" />
          </div>

          {/* Upload Type Tabs */}
          <div className="flex gap-2 mt-4 bg-muted/30 p-1 rounded-xl max-w-2xl mx-auto">
            <button
              onClick={() => {
                setUploadType("exercise");
                setMessage(null);
                setImagePreview(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                uploadType === "exercise"
                  ? "bg-chart-1 text-white shadow-lg shadow-chart-1/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Dumbbell size={18} />
              Exercise
            </button>
            <button
              onClick={() => {
                setUploadType("nutrition");
                setMessage(null);
                setImagePreview(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                uploadType === "nutrition"
                  ? "bg-chart-1 text-white shadow-lg shadow-chart-1/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Utensils size={18} />
              Nutrition
            </button>
            <button
              onClick={() => {
                setUploadType("quote");
                setMessage(null);
                setImagePreview(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                uploadType === "quote"
                  ? "bg-chart-1 text-white shadow-lg shadow-chart-1/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Quote size={18} />
              Quote
            </button>
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
              {uploadType === "exercise" ? (
                <Upload size={24} className="text-chart-1" />
              ) : uploadType === "nutrition" ? (
                <Utensils size={24} className="text-chart-1" />
              ) : (
                <Quote size={24} className="text-chart-1" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {uploadType === "exercise"
                  ? "Add New Exercise"
                  : uploadType === "nutrition"
                  ? "Add Nutrition Plan"
                  : "Add New Quote"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {uploadType === "exercise"
                  ? "Fill in the details to add an exercise to the database"
                  : uploadType === "nutrition"
                  ? "Add a healthy meal or nutrition plan with recipe details"
                  : "Share an inspiring quote with the community"}
              </p>
            </div>
          </div>

          {uploadType === "exercise" ? (
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
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 For nutrition plans, use the Nutrition tab above
                </p>
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
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground"
                >
                  <option value="">Select a category</option>
                  {categoryOptions[formData.exerciseType].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
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
                  Exercise Image *{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Choose one option)
                  </span>
                </label>

                {/* File Upload Option */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Option 1: Upload Image File
                  </p>

                  {/* Image Preview if file selected */}
                  {imagePreview && formData.imageFile && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-green-500">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Check size={14} />
                        Uploaded
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, imageFile: null }));
                          setImagePreview(null);
                        }}
                        className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  {!imagePreview && (
                    <label
                      htmlFor="imageFile"
                      className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                        formData.imageUrl
                          ? "border-border/30 bg-background/30 cursor-not-allowed"
                          : "border-border hover:border-chart-1 bg-background/50"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center p-6">
                        <ImagePlus className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="text-sm font-semibold text-foreground mb-1">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WebP, GIF (max 5MB)
                        </p>
                        {formData.imageUrl && (
                          <p className="text-xs text-yellow-500 mt-2">
                            Image URL is set. Clear URL to upload file.
                          </p>
                        )}
                      </div>
                      <input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={!!formData.imageUrl}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground font-medium">
                      OR
                    </span>
                  </div>
                </div>

                {/* URL Input Option */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Option 2: Use Image URL
                  </p>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    disabled={!!formData.imageFile}
                    placeholder="https://images.unsplash.com/photo-example.jpg"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground transition-all ${
                      formData.imageUrl && !formData.imageFile
                        ? "bg-green-500/5 border-green-500"
                        : formData.imageFile
                        ? "bg-background/30 border-border/30 opacity-50 cursor-not-allowed"
                        : "bg-background border-border"
                    }`}
                  />
                  {formData.imageUrl && !formData.imageFile && (
                    <div className="flex items-center gap-2 text-xs text-green-500">
                      <Check size={14} />
                      <span>URL set successfully</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, imageUrl: "" }))
                        }
                        className="ml-auto text-red-500 hover:text-red-400 underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Helper Text */}
                <p className="text-xs text-muted-foreground">
                  💡 <span className="font-medium">Tip:</span> Use high-quality
                  images from{" "}
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-chart-1 hover:underline"
                  >
                    Unsplash
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://pexels.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-chart-1 hover:underline"
                  >
                    Pexels
                  </a>
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
          ) : uploadType === "nutrition" ? (
            <form onSubmit={handleNutritionSubmit} className="space-y-6">
              {/* Food Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Food/Meal Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={nutritionData.title}
                  onChange={(e) =>
                    setNutritionData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                  placeholder="e.g., Grilled Chicken Salad, Protein Smoothie Bowl"
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
                  value={nutritionData.description}
                  onChange={(e) =>
                    setNutritionData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={3}
                  placeholder="Brief description of the meal and its nutritional value..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Image Upload - File or URL */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-foreground">
                  Food Image *{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Choose one option)
                  </span>
                </label>

                {/* Image Preview */}
                {imagePreview && nutritionData.imageFile && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-green-500">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Check size={14} />
                      Uploaded
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNutritionData((prev) => ({
                          ...prev,
                          imageFile: null,
                        }));
                        setImagePreview(null);
                      }}
                      className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                {!imagePreview && (
                  <label
                    htmlFor="nutritionImageFile"
                    className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                      nutritionData.imageUrl
                        ? "border-border/30 bg-background/30 cursor-not-allowed"
                        : "border-border hover:border-chart-1 bg-background/50"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center p-6">
                      <ImagePlus className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Click to upload food image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WebP (max 5MB)
                      </p>
                    </div>
                    <input
                      id="nutritionImageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (!file.type.startsWith("image/")) {
                            setMessage({
                              type: "error",
                              text: "Please select a valid image file",
                            });
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            setMessage({
                              type: "error",
                              text: "Image file size should be less than 5MB",
                            });
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                          setNutritionData((prev) => ({
                            ...prev,
                            imageFile: file,
                            imageUrl: "",
                          }));
                          setMessage(null);
                        }
                      }}
                      disabled={!!nutritionData.imageUrl}
                      className="hidden"
                    />
                  </label>
                )}

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground font-medium">
                      OR
                    </span>
                  </div>
                </div>

                {/* URL Input */}
                <input
                  type="url"
                  name="imageUrl"
                  value={nutritionData.imageUrl}
                  onChange={(e) =>
                    setNutritionData((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  disabled={!!nutritionData.imageFile}
                  placeholder="https://images.unsplash.com/photo-example.jpg"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground transition-all ${
                    nutritionData.imageUrl && !nutritionData.imageFile
                      ? "bg-green-500/5 border-green-500"
                      : nutritionData.imageFile
                      ? "bg-background/30 border-border/30 opacity-50 cursor-not-allowed"
                      : "bg-background border-border"
                  }`}
                />
              </div>

              {/* Macros Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Calories *
                  </label>
                  <input
                    type="text"
                    value={nutritionData.calories}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        calories: e.target.value,
                      }))
                    }
                    required
                    placeholder="450 kcal"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Protein *
                  </label>
                  <input
                    type="text"
                    value={nutritionData.protein}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        protein: e.target.value,
                      }))
                    }
                    required
                    placeholder="30g"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Carbs *
                  </label>
                  <input
                    type="text"
                    value={nutritionData.carbs}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        carbs: e.target.value,
                      }))
                    }
                    required
                    placeholder="45g"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fats *
                  </label>
                  <input
                    type="text"
                    value={nutritionData.fats}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        fats: e.target.value,
                      }))
                    }
                    required
                    placeholder="15g"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Meal Type & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Meal Type *
                  </label>
                  <select
                    value={nutritionData.mealType}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        mealType: e.target.value as MealType,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={nutritionData.category}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        category: e.target.value as NutritionCategory,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="high-protein">High Protein</option>
                    <option value="low-carb">Low Carb</option>
                  </select>
                </div>
              </div>

              {/* Prep Time & Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prep Time *
                  </label>
                  <input
                    type="text"
                    value={nutritionData.prepTime}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        prepTime: e.target.value,
                      }))
                    }
                    required
                    placeholder="e.g., 15 min, 30-45 min"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={nutritionData.difficulty}
                    onChange={(e) =>
                      setNutritionData((prev) => ({
                        ...prev,
                        difficulty: e.target.value as NutritionDifficulty,
                      }))
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ingredients *
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (one per line)
                  </span>
                </label>
                <textarea
                  value={nutritionData.ingredients}
                  onChange={(e) =>
                    setNutritionData((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    }))
                  }
                  required
                  rows={6}
                  placeholder="2 chicken breasts&#10;1 cup quinoa&#10;2 tbsp olive oil&#10;Mixed greens"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Instructions *
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (one step per line)
                  </span>
                </label>
                <textarea
                  value={nutritionData.instructions}
                  onChange={(e) =>
                    setNutritionData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  required
                  rows={6}
                  placeholder="Preheat oven to 375°F&#10;Season chicken with herbs&#10;Bake for 25-30 minutes&#10;Serve with quinoa and greens"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Health Benefits *
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (one per line)
                  </span>
                </label>
                <textarea
                  value={nutritionData.benefits}
                  onChange={(e) =>
                    setNutritionData((prev) => ({
                      ...prev,
                      benefits: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                  placeholder="High in protein for muscle building&#10;Rich in omega-3 fatty acids&#10;Supports heart health&#10;Boosts metabolism"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  YouTube Recipe URL
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (optional)
                  </span>
                </label>
                <input
                  type="url"
                  value={nutritionData.youtubeUrl}
                  onChange={(e) =>
                    setNutritionData((prev) => ({
                      ...prev,
                      youtubeUrl: e.target.value,
                    }))
                  }
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
                        : "Uploading Nutrition Plan..."}
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload Nutrition Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-6">
              {/* Quote Text */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quote Text *
                </label>
                <textarea
                  name="text"
                  value={quoteData.text}
                  onChange={(e) =>
                    setQuoteData((prev) => ({ ...prev, text: e.target.value }))
                  }
                  required
                  rows={4}
                  placeholder="Enter an inspiring quote..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={quoteData.author}
                  onChange={(e) =>
                    setQuoteData((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                  required
                  placeholder="e.g., Albert Einstein, Unknown"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={quoteData.category}
                  onChange={(e) =>
                    setQuoteData((prev) => ({
                      ...prev,
                      category: e.target.value as QuoteCategory,
                    }))
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground"
                >
                  <option value="Self-Compassion">Self-Compassion</option>
                  <option value="Emotions">Emotions</option>
                  <option value="Healing">Healing</option>
                  <option value="Hope">Hope</option>
                  <option value="Identity">Identity</option>
                  <option value="Journey">Journey</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Empowerment">Empowerment</option>
                  <option value="Acceptance">Acceptance</option>
                  <option value="Motivation">Motivation</option>
                  <option value="Inspiration">Inspiration</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Health">Health</option>
                  <option value="Wellness">Wellness</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Color *
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (for UI display)
                  </span>
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={quoteData.color}
                    onChange={(e) =>
                      setQuoteData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="h-12 w-20 rounded-lg cursor-pointer border-2 border-border"
                  />
                  <input
                    type="text"
                    value={quoteData.color}
                    onChange={(e) =>
                      setQuoteData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    placeholder="#FF5C5C"
                    className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Popular colors: #FF5C5C (red), #0DADD0 (blue), #FFD890
                  (yellow), #90EE90 (green), #FFDAB9 (peach)
                </p>
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
                      Uploading Quote...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload Quote
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-8 p-6 bg-muted/10 rounded-xl border border-border">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertCircle size={18} className="text-chart-1" />
            {uploadType === "exercise"
              ? "Tips for uploading exercises"
              : uploadType === "nutrition"
              ? "Tips for uploading nutrition plans"
              : "Tips for uploading quotes"}
          </h3>
          {uploadType === "exercise" ? (
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>
                Upload images directly or use URLs from Unsplash or similar
                sources
              </li>
              <li>
                Images should be high-quality and clearly show the exercise
              </li>
              <li>YouTube links should point to quality tutorial videos</li>
              <li>Write clear, helpful descriptions with proper form tips</li>
              <li>
                Choose appropriate difficulty levels for your target audience
              </li>
            </ul>
          ) : uploadType === "nutrition" ? (
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Use appetizing, high-quality images of the food</li>
              <li>
                Be accurate with nutritional information (calories, macros)
              </li>
              <li>List ingredients in order of quantity used</li>
              <li>Write clear, step-by-step cooking instructions</li>
              <li>Include health benefits and dietary information</li>
              <li>YouTube links to recipe videos are optional but helpful</li>
            </ul>
          ) : (
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Choose quotes that are meaningful and inspiring</li>
              <li>Verify the author attribution before submitting</li>
              <li>Select the most relevant category for the quote</li>
              <li>Pick a color that represents the mood/theme of the quote</li>
              <li>Keep quotes concise and impactful</li>
              <li>Avoid duplicate quotes - check existing ones first</li>
            </ul>
          )}
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
