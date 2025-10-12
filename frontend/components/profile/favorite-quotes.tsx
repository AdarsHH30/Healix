"use client";

import { Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface QuoteData {
  id: string;
  quote_text: string;
  author: string;
  category: string;
  text?: string;
}

interface FavoriteQuotesProps {
  quotes: QuoteData[];
  favoriteQuoteIds: Set<string>;
  onRemoveFavorite: (quoteId: string) => void;
}

export function FavoriteQuotes({
  quotes,
  favoriteQuoteIds,
  onRemoveFavorite,
}: FavoriteQuotesProps) {
  const router = useRouter();
  const favoriteQuotes = quotes.filter((quote) =>
    favoriteQuoteIds.has(quote.id)
  );

  if (favoriteQuotes.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-dashed p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-4 bg-muted rounded-full w-fit mx-auto">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Favorite Quotes Yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Start building your collection of motivational quotes. Visit the
              Mental Health section to find quotes that inspire you.
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/mental-health")}
            className="gap-2"
            size="sm"
          >
            <Heart size={14} />
            Explore Quotes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <Heart size={20} className="text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Favorite Quotes
            </h3>
            <p className="text-sm text-muted-foreground">
              Quotes that inspire you
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
          {favoriteQuotes.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-muted/30 rounded-lg border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="inline-flex px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground border">
                {quote.category}
              </span>
              <button
                onClick={() => onRemoveFavorite(quote.id)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Remove from favorites"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>

            <blockquote className="text-sm text-foreground leading-relaxed mb-3">
              &quot;{quote.text || quote.quote_text}&quot;
            </blockquote>

            <p className="text-xs text-muted-foreground">— {quote.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
