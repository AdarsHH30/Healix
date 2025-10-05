"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Filter,
  MessageCircle,
  MapPin,
  Utensils,
  Apple,
  Coffee,
  Pizza,
  Salad,
  Clock,
  TrendingUp,
  Heart,
  Zap,
  Flame,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";
import { supabase } from "@/lib/supabase";

interface NutritionPlan {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  category: "weight-loss" | "muscle-gain" | "balanced" | "vegan" | "keto";
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  instructions: string[];
  benefits: string[];
}

export default function NutritionPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch nutrition plans from Supabase
  useEffect(() => {
    async function fetchNutritionPlans() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("nutrition_plans")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Supabase error:", fetchError);
          throw fetchError;
        }

        // Transform data to match the NutritionPlan interface
        const transformedData: NutritionPlan[] = (data || []).map((plan) => ({
          id: plan.id,
          title: plan.title,
          description: plan.description,
          imageUrl: plan.image_url,
          calories: plan.calories,
          protein: plan.protein,
          carbs: plan.carbs,
          fats: plan.fats,
          mealType: plan.meal_type,
          category: plan.category,
          prepTime: plan.prep_time,
          difficulty: plan.difficulty,
          ingredients: plan.ingredients || [],
          instructions: plan.instructions || [],
          benefits: plan.benefits || [],
        }));

        setNutritionPlans(transformedData);
      } catch (err) {
        console.error("Error fetching nutrition plans:", err);
        setError("Failed to load nutrition plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchNutritionPlans();
  }, []);

  // Filter nutrition plans
  const filteredPlans = useMemo(() => {
    return nutritionPlans.filter((plan) => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMealType =
        selectedMealType === "all" || plan.mealType === selectedMealType;
      const matchesCategory =
        selectedCategory === "all" || plan.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" || plan.difficulty === selectedDifficulty;

      return (
        matchesSearch && matchesMealType && matchesCategory && matchesDifficulty
      );
    });
  }, [
    searchQuery,
    selectedMealType,
    selectedCategory,
    selectedDifficulty,
    nutritionPlans,
  ]);

  // Get meal type counts
  const mealTypeCounts = {
    breakfast: nutritionPlans.filter((p) => p.mealType === "breakfast").length,
    lunch: nutritionPlans.filter((p) => p.mealType === "lunch").length,
    dinner: nutritionPlans.filter((p) => p.mealType === "dinner").length,
    snack: nutritionPlans.filter((p) => p.mealType === "snack").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <Utensils className="w-6 h-6 text-green-500" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Nutrition Plans
              </h1>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">
              Loading nutrition plans...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <Coffee className="w-8 h-8 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-500">
                    {mealTypeCounts.breakfast}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Breakfast Plans
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <Salad className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">
                    {mealTypeCounts.lunch}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Lunch Ideas
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <Pizza className="w-8 h-8 text-purple-500" />
                  <span className="text-2xl font-bold text-purple-500">
                    {mealTypeCounts.dinner}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Dinner Recipes
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <Apple className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">
                    {mealTypeCounts.snack}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Healthy Snacks
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-border/50">
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search nutrition plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Meal Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Meal Type
                  </label>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground"
                  >
                    <option value="all">All Meals</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snacks</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground"
                  >
                    <option value="all">All Categories</option>
                    <option value="balanced">Balanced</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground"
                  >
                    <option value="all">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredPlans.length}
                </span>{" "}
                nutrition plans
              </p>
              {(selectedMealType !== "all" ||
                selectedCategory !== "all" ||
                selectedDifficulty !== "all" ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMealType("all");
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                  }}
                  className="text-sm text-green-500 hover:text-green-400 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Nutrition Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPlans.map((plan) => (
                <NutritionCard key={plan.id} plan={plan} />
              ))}
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-16">
                <Utensils className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No nutrition plans found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40 flex flex-col gap-3 md:gap-4">
        <button
          onClick={() => setIsMapOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Open Hospital Map"
        >
          <MapPin size={24} />
        </button>

        <button
          onClick={() => setIsChatbotOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-chart-1 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {/* Popups */}
      <ChatbotPopup
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
      <MapPopup isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </div>
  );
}

// Nutrition Card Component
function NutritionCard({ plan }: { plan: NutritionPlan }) {
  const [showDetails, setShowDetails] = useState(false);

  const mealTypeIcons = {
    breakfast: Coffee,
    lunch: Salad,
    dinner: Pizza,
    snack: Apple,
  };

  const categoryColors = {
    "weight-loss": "from-red-500/20 to-orange-500/20 border-red-500/30",
    "muscle-gain": "from-blue-500/20 to-purple-500/20 border-blue-500/30",
    balanced: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    vegan: "from-lime-500/20 to-green-500/20 border-lime-500/30",
    keto: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  };

  const difficultyColors = {
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const MealIcon = mealTypeIcons[plan.mealType];

  return (
    <div
      className={`group bg-gradient-to-br ${
        categoryColors[plan.category]
      } backdrop-blur-sm rounded-2xl overflow-hidden border hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={plan.imageUrl}
          alt={plan.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
              difficultyColors[plan.difficulty]
            }`}
          >
            {plan.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-md flex items-center gap-1">
            <Clock size={12} />
            {plan.prepTime}
          </span>
        </div>
        <div className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md">
          <MealIcon size={20} className="text-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
          {plan.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {plan.description}
        </p>

        {/* Macros */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame size={14} className="text-orange-500" />
            </div>
            <p className="text-xs font-bold text-foreground">{plan.calories}</p>
            <p className="text-xs text-muted-foreground">Cal</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap size={14} className="text-blue-500" />
            </div>
            <p className="text-xs font-bold text-foreground">{plan.protein}</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp size={14} className="text-yellow-500" />
            </div>
            <p className="text-xs font-bold text-foreground">{plan.carbs}</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Heart size={14} className="text-red-500" />
            </div>
            <p className="text-xs font-bold text-foreground">{plan.fats}</p>
            <p className="text-xs text-muted-foreground">Fats</p>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          {showDetails ? "Hide Details" : "View Recipe"}
        </button>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {/* Ingredients */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Utensils size={16} />
                Ingredients
              </h4>
              <ul className="space-y-1">
                {plan.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">
                Instructions
              </h4>
              <ol className="space-y-1">
                {plan.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="font-semibold text-green-500">
                      {index + 1}.
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Heart size={16} className="text-red-500" />
                Health Benefits
              </h4>
              <ul className="space-y-1">
                {plan.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-red-500 mt-0.5">♥</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
