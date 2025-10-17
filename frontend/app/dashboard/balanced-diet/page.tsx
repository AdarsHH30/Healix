"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
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
  X,
  Search,
  Sparkles,
  Star,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DashboardFloatingActions } from "@/components/dashboard-floating-actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";

interface NutritionPlan {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  youtubeUrl?: string | null;
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

// Dynamic color schemes for meal types
const mealTypeColors = {
  breakfast: {
    bg: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
    text: "text-orange-500",
    gradient: "from-orange-500 to-orange-600",
    icon: Coffee,
    label: "Breakfast",
  },
  lunch: {
    bg: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
    text: "text-blue-500",
    gradient: "from-blue-500 to-blue-600",
    icon: Salad,
    label: "Lunch",
  },
  dinner: {
    bg: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-500/20",
    text: "text-purple-500",
    gradient: "from-purple-500 to-purple-600",
    icon: Pizza,
    label: "Dinner",
  },
  snack: {
    bg: "from-green-500/10 to-green-500/5",
    border: "border-green-500/20",
    text: "text-green-500",
    gradient: "from-green-500 to-green-600",
    icon: Apple,
    label: "Snacks",
  },
};

const difficultyColors = {
  Easy: "bg-green-500/20 text-green-600 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  Hard: "bg-red-500/20 text-red-600 border-red-500/30",
};

export default function NutritionPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

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
          throw fetchError;
        }

        const transformedData: NutritionPlan[] = (data || []).map((plan) => ({
          id: plan.id,
          title: plan.title,
          description: plan.description,
          imageUrl: plan.image_url,
          youtubeUrl: plan.youtube_url,
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
        setError("Failed to load nutrition plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchNutritionPlans();
  }, []);

  // Filter and group plans
  const { filteredPlans, groupedPlans, totalCount } = useMemo(() => {
    const filtered = nutritionPlans.filter((plan) => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMealType =
        !selectedMealType || plan.mealType === selectedMealType;
      return matchesSearch && matchesMealType;
    });

    const grouped = {
      breakfast: filtered.filter((p) => p.mealType === "breakfast"),
      lunch: filtered.filter((p) => p.mealType === "lunch"),
      dinner: filtered.filter((p) => p.mealType === "dinner"),
      snack: filtered.filter((p) => p.mealType === "snack"),
    };

    const counts = {
      breakfast: nutritionPlans.filter((p) => p.mealType === "breakfast")
        .length,
      lunch: nutritionPlans.filter((p) => p.mealType === "lunch").length,
      dinner: nutritionPlans.filter((p) => p.mealType === "dinner").length,
      snack: nutritionPlans.filter((p) => p.mealType === "snack").length,
    };

    return {
      filteredPlans: filtered,
      groupedPlans: grouped,
      totalCount: counts,
    };
  }, [nutritionPlans, searchQuery, selectedMealType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/90 border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all hover:gap-3 group relative"
              title="Go back to dashboard"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
              <span className="absolute -bottom-8 left-0 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Go back to dashboard
              </span>
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Nutrition Plans
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-lg text-muted-foreground mt-4">
              Loading delicious plans...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6 backdrop-blur-sm">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {(
                Object.keys(mealTypeColors) as Array<
                  keyof typeof mealTypeColors
                >
              ).map((type) => {
                const config = mealTypeColors[type];
                const Icon = config.icon;
                const isSelected = selectedMealType === type;

                return (
                  <button
                    key={type}
                    onClick={() =>
                      setSelectedMealType(isSelected ? null : type)
                    }
                    className={`p-4 rounded-2xl backdrop-blur-sm border transition-all hover:scale-105 relative group ${
                      isSelected
                        ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-lg`
                        : `bg-gradient-to-br ${config.bg} ${config.border} hover:shadow-md`
                    }`}
                    title={isSelected ? `Clear ${config.label} filter` : `Filter by ${config.label}`}
                  >
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {isSelected ? `Clear ${config.label} filter` : `Filter by ${config.label}`}
                    </span>
                    <div className="flex items-center justify-between mb-2">
                      <Icon
                        className={`w-6 h-6 ${
                          isSelected ? "text-white" : config.text
                        }`}
                      />
                      <span
                        className={`text-2xl font-bold ${
                          isSelected ? "text-white" : config.text
                        }`}
                      >
                        {totalCount[type]}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        isSelected ? "text-white/90" : "text-muted-foreground"
                      }`}
                    >
                      {config.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-12 py-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-foreground placeholder:text-muted-foreground shadow-lg transition-all hover:shadow-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Clear search"
                  >
                    <X size={18} className="text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedMealType) && (
                <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                  <p className="text-sm text-muted-foreground">
                    Found{" "}
                    <span className="font-bold text-foreground">
                      {filteredPlans.length}
                    </span>{" "}
                    plans
                  </p>
                  {selectedMealType && (
                    <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium flex items-center gap-2">
                      {
                        mealTypeColors[
                          selectedMealType as keyof typeof mealTypeColors
                        ].label
                      }
                      <button
                        onClick={() => setSelectedMealType(null)}
                        className="hover:bg-background rounded-full p-0.5 transition-colors group relative"
                        title="Remove filter"
                      >
                        <X size={14} />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Remove filter
                        </span>
                      </button>
                    </span>
                  )}
                  {(searchQuery || selectedMealType) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedMealType(null);
                      }}
                      className="text-sm text-green-500 hover:text-green-400 font-medium group relative"
                      title="Remove all filters"
                    >
                      Clear all
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        Remove all filters
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Meal Sections */}
            <div className="space-y-12">
              {(
                Object.keys(groupedPlans) as Array<keyof typeof groupedPlans>
              ).map((type) => {
                const plans = groupedPlans[type];
                if (plans.length === 0) return null;

                return (
                  <MealSection
                    key={type}
                    title={mealTypeColors[type].label}
                    plans={plans}
                    mealType={type}
                  />
                );
              })}
            </div>

            {/* Empty States */}
            {nutritionPlans.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Utensils className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No nutrition plans yet
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for delicious meal ideas
                </p>
              </div>
            )}

            {filteredPlans.length === 0 && nutritionPlans.length > 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="max-w-md w-full mx-4">
                  <div className="relative">
                    {/* Animated background circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 blur-2xl animate-pulse" />
                    </div>
                    
                    {/* Main content */}
                    <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 shadow-xl">
                      {/* Icon */}
                      <div className="relative mx-auto mb-6 w-24 h-24">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl rotate-6 opacity-20 blur-sm" />
                        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 flex items-center justify-center backdrop-blur-sm">
                          <Search className="w-12 h-12 text-orange-500" />
                        </div>
                      </div>

                      {/* Text */}
                      <h3 className="text-2xl font-bold text-foreground mb-3 text-center">
                        No plans match your search
                      </h3>
                      <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                        We couldn't find any nutrition plans matching your criteria. Try adjusting your filters or search term.
                      </p>

                      {/* Active filters display */}
                      {(searchQuery || selectedMealType) && (
                        <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/50">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            Active Filters:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {searchQuery && (
                              <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 text-sm font-medium border border-orange-500/20">
                                Search: "{searchQuery}"
                              </span>
                            )}
                            {selectedMealType && (
                              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-sm font-medium border border-blue-500/20">
                                {mealTypeColors[selectedMealType as keyof typeof mealTypeColors].label}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action button */}
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedMealType(null);
                        }}
                        className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group relative"
                        title="Reset all search filters and show all plans"
                      >
                        <X size={18} />
                        Clear All Filters
                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Reset all filters
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Buttons */}
      <DashboardFloatingActions />
    </div>
  );
}

// Meal Section Component
function MealSection({
  title,
  plans,
  mealType,
}: {
  title: string;
  plans: NutritionPlan[];
  mealType: keyof typeof mealTypeColors;
}) {
  const colors = mealTypeColors[mealType];
  const Icon = colors.icon;

  return (
    <section className="scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
          >
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {plans.length} {plans.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <NutritionCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}

// Nutrition Card Component
function NutritionCard({ plan }: { plan: NutritionPlan }) {
  const [showDetails, setShowDetails] = useState(false);
  const colors = mealTypeColors[plan.mealType];
  const MealIcon = colors.icon;

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className="group cursor-pointer"
      >
        <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          {/* Background Image */}
          <Image
            src={plan.imageUrl}
            alt={plan.title}
            width={500}
            height={320}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-800 uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Star size={12} fill="currentColor" />
              {plan.category}
            </span>
          </div>

          {/* Difficulty & Time */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border ${
                difficultyColors[plan.difficulty]
              }`}
            >
              {plan.difficulty}
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/70 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/20">
              <Clock size={14} />
              {plan.prepTime}
            </span>
          </div>

          {/* Meal Type Badge */}
          <div
            className={`absolute bottom-24 right-4 p-3 rounded-xl bg-gradient-to-br ${colors.bg} backdrop-blur-md shadow-xl border ${colors.border}`}
          >
            <MealIcon size={22} className={colors.text} />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg group-hover:text-green-400 transition-colors">
              {plan.title}
            </h3>
            <p className="text-sm text-white/90 line-clamp-2 mb-4 drop-shadow-md">
              {plan.description}
            </p>

            {/* Macros */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm">
                <Flame size={16} className="text-orange-400" />
                <span className="text-xs font-bold text-white">
                  {plan.calories}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm">
                <Zap size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-white">
                  {plan.protein}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm">
                <TrendingUp size={16} className="text-yellow-400" />
                <span className="text-xs font-bold text-white">
                  {plan.carbs}
                </span>
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-background rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 scrollbar-hide relative"
            onClick={(e) => e.stopPropagation()}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg hover:scale-110 group"
              title="Close details"
            >
              <X size={20} />
              <span className="absolute -bottom-10 right-0 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                Close details
              </span>
            </button>

            {/* Header Image */}
            <div className="relative h-80">
              <Image
                src={plan.imageUrl}
                alt={plan.title}
                width={800}
                height={320}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
                    <Star size={12} fill="currentColor" />
                    {plan.category}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border ${
                      difficultyColors[plan.difficulty]
                    }`}
                  >
                    {plan.difficulty}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                    <Clock size={14} />
                    {plan.prepTime}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {plan.title}
                </h2>
                <p className="text-white/95 text-lg drop-shadow-md">
                  {plan.description}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Nutrition Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 hover:scale-105 transition-transform">
                  <Flame size={24} className="text-orange-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">
                    {plan.calories}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Calories
                  </p>
                </div>
                <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:scale-105 transition-transform">
                  <Zap size={24} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">
                    {plan.protein}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Protein
                  </p>
                </div>
                <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 hover:scale-105 transition-transform">
                  <TrendingUp
                    size={24}
                    className="text-yellow-500 mx-auto mb-2"
                  />
                  <p className="text-xl font-bold text-foreground">
                    {plan.carbs}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Carbs
                  </p>
                </div>
                <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 hover:scale-105 transition-transform">
                  <Heart size={24} className="text-red-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground">
                    {plan.fats}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Fats
                  </p>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Utensils size={20} className="text-green-500" />
                  </div>
                  Ingredients
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plan.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground">
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Sparkles size={20} className="text-blue-500" />
                  </div>
                  Instructions
                </h4>
                <div className="space-y-4">
                  {plan.instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground pt-1">
                        {instruction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Heart size={20} className="text-purple-500" />
                  </div>
                  Benefits
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-foreground">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* YouTube Video Button */}
              {plan.youtubeUrl && (
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Youtube size={20} className="text-red-500" />
                    </div>
                    Video Tutorial
                  </h4>
                  <a
                    href={plan.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group relative"
                    title="Watch cooking tutorial on YouTube"
                  >
                    <Youtube size={24} />
                    <span>Watch Recipe Video</span>
                    <ExternalLink size={18} />
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Watch cooking tutorial on YouTube
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
