"use client";

import { useEffect, useState } from "react";
import { Heart, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface QuoteData {
  id: string;
  text: string;
  author: string;
  category: string;
  color: string;
}

export function QuotesDisplay() {
  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteQuotes, setFavoriteQuotes] = useState<Set<string>>(new Set());
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Load quotes from database
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (data) {
          setQuotes(data);
        }
      } catch (error) {
        console.error("Error loading quotes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuotes();
  }, []);

  // Load user's favorite quotes
  useEffect(() => {
    const loadFavorites = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from("quote_favorites")
        .select("quote_id")
        .eq("user_id", userId);

      if (data) {
        setFavoriteQuotes(new Set(data.map((fav) => fav.quote_id)));
      }
    };
    loadFavorites();
  }, [userId]);

  const handleFavorite = async (quoteId: string) => {
    if (!userId) {
      alert("Please sign in to favorite quotes");
      return;
    }

    const isCurrentlyFavorited = favoriteQuotes.has(quoteId);

    if (isCurrentlyFavorited) {
      // Remove favorite
      await supabase
        .from("quote_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("quote_id", quoteId);

      const newFavorites = new Set(favoriteQuotes);
      newFavorites.delete(quoteId);
      setFavoriteQuotes(newFavorites);
    } else {
      // Add favorite
      await supabase
        .from("quote_favorites")
        .insert({ user_id: userId, quote_id: quoteId });

      const newFavorites = new Set(favoriteQuotes);
      newFavorites.add(quoteId);
      setFavoriteQuotes(newFavorites);
    }
  };

  const trackView = async (quoteId: string) => {
    await supabase.from("quote_views").insert({
      quote_id: quoteId,
      user_id: userId,
    });
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No quotes available yet.</p>
        </div>
      ) : (
        <>
          {/* All Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {quotes.map((quote) => {
              const isFavorited = favoriteQuotes.has(quote.id);

          return (
            <div
              key={quote.id}
              className="group relative bg-card rounded-xl border border-border/50 hover:border-border transition-all duration-300 overflow-hidden"
              onMouseEnter={() => trackView(quote.id)}
            >
              {/* Color Accent Bar */}
              <div
                className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: quote.color }}
              />

              {/* Card Content */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: `${quote.color}15`,
                      borderColor: `${quote.color}40`,
                      color: quote.color,
                    }}
                  >
                    <TrendingUp size={12} />
                    {quote.category}
                  </div>

                  <button
                    onClick={() => handleFavorite(quote.id)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isFavorited
                        ? "bg-red-50 dark:bg-red-950/30 scale-110"
                        : "hover:bg-accent"
                    }`}
                    aria-label={
                      isFavorited ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Heart
                      size={18}
                      className={`transition-all duration-300 ${
                        isFavorited ? "text-red-500" : "text-muted-foreground"
                      }`}
                      fill={isFavorited ? "currentColor" : "none"}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Quote Text */}
                <blockquote className="text-sm sm:text-base text-foreground/90 leading-relaxed line-clamp-4">
                  "{quote.text}"
                </blockquote>

                {/* Author */}
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  — {quote.author}
                </p>
              </div>
            </div>
          );
        })}
          </div>
        </>
      )}
    </div>
  );
}
