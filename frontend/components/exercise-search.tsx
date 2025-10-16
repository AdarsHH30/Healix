"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface ExerciseSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function ExerciseSearch({
  onSearch,
  placeholder = "Search exercises...",
}: ExerciseSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* <Search className=" left-4 top-1/2  " size={20} /> */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
