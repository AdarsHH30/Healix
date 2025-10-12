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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-muted rounded-lg">
            <UploadIcon size={20} className="text-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-foreground">
              {totalUploads}
            </p>
            <p className="text-sm text-muted-foreground">Total Uploads</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-muted rounded-lg">
            <Heart size={20} className="text-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-foreground">
              {favoriteQuotesCount}
            </p>
            <p className="text-sm text-muted-foreground">Favorite Quotes</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-muted rounded-lg">
            <Calendar size={20} className="text-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-semibold text-foreground">
              {memberSince}
            </p>
            <p className="text-sm text-muted-foreground">Member Since</p>
          </div>
        </div>
      </div>
    </div>
  );
}
