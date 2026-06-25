"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe2,
  ChevronDown,
  Check,
  BarChart2,
  Loader2,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { CountryDropdown } from "../CountrySearch";
import { YOUTUBE_CATEGORIES } from "@/constants/gap-analyzer";
import { Button } from "@/components/ui/Button";

import type { TrendingVideo } from "@/types/gap-analyzer";

type SortConfig = {
  key: keyof TrendingVideo | null;
  direction: "asc" | "desc";
};

interface SearchBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  selectedCountry: string | null;
  setSelectedCountry: (val: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (val: string | null) => void;
  onSearch: () => void;
  isFetching: boolean;
  sortConfig: SortConfig;
  requestSort: (key: keyof TrendingVideo) => void;
  hasResults: boolean;
}

export function TrendingSearchBar({
  keyword,
  setKeyword,
  selectedCountry,
  setSelectedCountry,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  isFetching,
  sortConfig,
  requestSort,
  hasResults,
}: SearchBarProps) {
  const [openDropdown, setOpenDropdown] = useState<
    "country" | "category" | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions: { label: string; key: keyof TrendingVideo }[] = [
    { label: "Gap Score", key: "gapScore" },
    { label: "Demand", key: "demandScore" },
    { label: "Competition", key: "competitionScore" },
    { label: "Trend", key: "trendScore" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-border relative z-20 flex flex-col gap-4 rounded-2xl border p-4 shadow-sm"
      ref={dropdownRef}
    >
      <div className="flex flex-col gap-3 md:flex-row">
        {/* Keyword Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search by keyword or channel..."
            className="border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border bg-(--surface-1) pr-4 pl-11 text-sm transition-all outline-none focus:ring-2"
          />
        </div>

        {/* Country Dropdown */}
        <div className="relative w-full md:w-56">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "country" ? null : "country")
            }
            className="border-border flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border bg-(--surface-1) px-4 text-sm transition-all hover:bg-(--surface-2)"
          >
            <div className="text-muted-foreground flex items-center gap-2 truncate">
              <Globe2 size={16} className="shrink-0" />
              <span
                className={`truncate ${selectedCountry ? "text-foreground font-medium" : ""}`}
              >
                {selectedCountry || "All Countries"}
              </span>
            </div>
            <ChevronDown size={14} className="shrink-0" />
          </button>
          <AnimatePresence>
            {openDropdown === "country" && (
              <CountryDropdown
                selectedCountry={selectedCountry}
                onSelect={(c) => {
                  setSelectedCountry(c);
                  setOpenDropdown(null);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full md:w-52">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "category" ? null : "category")
            }
            className="border-border flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border bg-(--surface-1) px-4 text-sm transition-all hover:bg-(--surface-2)"
          >
            <div className="text-muted-foreground flex items-center gap-2 truncate">
              <BarChart2 size={16} className="shrink-0" />
              <span
                className={`truncate ${selectedCategory ? "text-foreground font-medium" : ""}`}
              >
                {selectedCategory || "All Categories"}
              </span>
            </div>
            <ChevronDown size={14} className="shrink-0" />
          </button>
          <AnimatePresence>
            {openDropdown === "category" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="border-border bg-card absolute top-14 left-0 w-full overflow-hidden rounded-xl border shadow-lg"
              >
                <div className="max-h-60 overflow-y-auto p-1.5">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setOpenDropdown(null);
                    }}
                    className="text-foreground w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm hover:bg-(--surface-2)"
                  >
                    All Categories
                  </button>
                  {YOUTUBE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setOpenDropdown(null);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-(--surface-2)"
                    >
                      <span
                        className={
                          selectedCategory === cat.name
                            ? "text-primary font-bold"
                            : "text-foreground"
                        }
                      >
                        {cat.name}
                      </span>
                      {selectedCategory === cat.name && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <Button
          onClick={onSearch}
          disabled={
            isFetching ||
            (!keyword.trim() && !selectedCountry && !selectedCategory)
          }
          className="h-12 px-6"
        >
          {isFetching ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          <span className="ml-2">{isFetching ? "Searching..." : "Search"}</span>
        </Button>
      </div>

      {hasResults && (
        <div className="border-border mt-2 flex flex-wrap items-center gap-3 border-t pt-4 sm:gap-4">
          <span className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
            SORT
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {sortOptions.map((option) => {
              const isActive = sortConfig.key === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => requestSort(option.key)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border text-foreground bg-transparent hover:bg-(--surface-2)"
                  }`}
                >
                  {option.label}
                  {isActive && (
                    <span className="text-primary flex items-center justify-center">
                      {sortConfig.direction === "asc" ? (
                        <ArrowDown size={12} strokeWidth={3} />
                      ) : (
                        <ArrowUp size={12} strokeWidth={3} />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
