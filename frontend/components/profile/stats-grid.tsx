"use client";

import { Upload as UploadIcon, Heart, Calendar } from "lucide-react";

interface StatsGridProps {
  totalUploads: number;
  favoriteQuotesCount: number;
  memberSince: string;
}

export function StatsGrid({
  totalUploads,
  favoriteQuotesCount,
  memberSince,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-card rounded-lg border p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 bg-muted rounded-lg">
            <UploadIcon size={18} className="sm:w-5 sm:h-5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              {totalUploads}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total Uploads
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 bg-muted rounded-lg">
            <Heart size={18} className="sm:w-5 sm:h-5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              {favoriteQuotesCount}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Favorite Quotes
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-4 sm:p-5 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 bg-muted rounded-lg">
            <Calendar size={18} className="sm:w-5 sm:h-5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg sm:text-xl font-semibold text-foreground">
              {memberSince}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Member Since
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
