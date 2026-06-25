"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLazyGetTrendingTopicsQuery,
  useAnalyzeVideoMutation,
} from "@/services/gapApi";
import type { TrendingVideo, TabComponentProps } from "@/types/gap-analyzer";
import { YOUTUBE_CATEGORIES } from "@/constants/gap-analyzer";
import { useCreditCheck } from "@/hooks/useCreditCheck";

import { TopicDetails } from "./TopicDetails";
import { InitialEmptyState } from "./States/InitialState";
import { NoResultsState } from "./States/NoResultsState";
import { LoadingState } from "./States/LoadingState";
import { TrendingSearchBar } from "./TrendingSearchBar";
import { TrendingVideoItem } from "./TrendingVideoItem";

type SortConfig = {
  key: keyof TrendingVideo | null;
  direction: "asc" | "desc";
};

export function TrendingTab({
  onAnalysisComplete,
  trendingState,
  setTrendingState,
  currentBalance = 0,
  onInsufficientCredits,
}: TabComponentProps) {
  const [fetchTrending, { isFetching }] = useLazyGetTrendingTopicsQuery();
  const [analyzeVideo] = useAnalyzeVideoMutation();

  const [analyzingVideoId, setAnalyzingVideoId] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });

  const { validateAction } = useCreditCheck(currentBalance);

  const {
    keyword,
    selectedCountry,
    selectedCategory,
    hasSearched,
    results,
    selectedTopic,
  } = trendingState!;

  const setKeyword = (val: string) =>
    setTrendingState?.((prev) => ({ ...prev, keyword: val }));
  const setSelectedCountry = (val: string | null) =>
    setTrendingState?.((prev) => ({ ...prev, selectedCountry: val }));
  const setSelectedCategory = (val: string | null) =>
    setTrendingState?.((prev) => ({ ...prev, selectedCategory: val }));
  const setResults = (val: TrendingVideo[]) =>
    setTrendingState?.((prev) => ({ ...prev, results: val }));
  const setHasSearched = (val: boolean) =>
    setTrendingState?.((prev) => ({ ...prev, hasSearched: val }));
  const setSelectedTopic = (val: TrendingVideo | null) =>
    setTrendingState?.((prev) => ({ ...prev, selectedTopic: val }));

  const handleSearch = async () => {
    if (!keyword.trim() && !selectedCountry && !selectedCategory) return;

    const { isAllowed, requiredCredits } = validateAction({
      action: "search",
    });

    if (!isAllowed) {
      if (onInsufficientCredits) onInsufficientCredits(requiredCredits);
      return;
    }

    try {
      const categoryObj = YOUTUBE_CATEGORIES.find(
        (c) => c.name === selectedCategory
      );
      const categoryId = categoryObj ? categoryObj.id : undefined;

      const searchParams = {
        region: selectedCountry || undefined,
        categoryId: categoryId,
        keywords: keyword.trim() || undefined,
        maxResults: 25,
      };

      const apiData = await fetchTrending(searchParams).unwrap();

      setTrendingState?.((prev) => ({
        ...prev,
        results: apiData || [],
        hasSearched: true,
      }));
      setSortConfig({ key: null, direction: "desc" });
    } catch (error) {
      console.error("Failed to fetch trending topics", error);
      setTrendingState?.((prev) => ({
        ...prev,
        results: [],
        hasSearched: true,
      }));
    }
  };

  const handleAnalyze = async (videoId: string) => {
    const { isAllowed, requiredCredits } = validateAction({
      action: "analytics",
    });

    if (!isAllowed) {
      if (onInsufficientCredits) onInsufficientCredits(requiredCredits);
      return;
    }

    setAnalyzingVideoId(videoId);
    try {
      const report = await analyzeVideo(videoId).unwrap();
      onAnalysisComplete(report);
    } catch (error) {
      console.error("Failed to analyze video", error);
    } finally {
      setAnalyzingVideoId(null);
    }
  };

  const requestSort = (key: keyof TrendingVideo) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = useMemo(() => {
    if (!results || results.length === 0) return [];

    const sortableItems = [...results];

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof TrendingVideo];
        const bValue = b[sortConfig.key as keyof TrendingVideo];

        const numA = Number(aValue) || 0;
        const numB = Number(bValue) || 0;

        if (numA < numB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (numA > numB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [results, sortConfig]);

  return (
    <div className="flex flex-col gap-6">
      <TrendingSearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSearch={handleSearch}
        isFetching={isFetching}
        sortConfig={sortConfig}
        requestSort={requestSort}
        hasResults={results && results.length > 0}
      />

      <div
        className="flex min-h-100 flex-1 flex-col transition-all duration-300 xl:grid"
        style={{
          gridTemplateColumns: selectedTopic ? "1fr 340px" : "1fr",
          gap: "1.5rem",
        }}
      >
        {isFetching ? (
          <LoadingState />
        ) : !hasSearched ? (
          <InitialEmptyState />
        ) : !results || results.length === 0 ? (
          <NoResultsState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border-border overflow-hidden rounded-2xl border"
          >
            <div className="border-border hidden gap-4 border-b bg-(--surface-1) px-5 py-4 lg:grid lg:grid-cols-[2.5fr_100px_100px_100px_100px_180px]">
              {[
                "Trending Video",
                "Gap Score",
                "Demand",
                "Competition",
                "Trend",
                "Actions",
              ].map((h) => (
                <div
                  key={h}
                  className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
                >
                  {h}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 p-4 lg:gap-0 lg:p-0">
              {sortedResults.map((row, i) => (
                <TrendingVideoItem
                  key={row.videoId}
                  video={row}
                  index={i}
                  isAnalyzing={analyzingVideoId === row.videoId}
                  isAnyAnalyzing={
                    !!analyzingVideoId && analyzingVideoId !== row.videoId
                  }
                  isSelected={selectedTopic?.videoId === row.videoId}
                  onToggleSelect={() =>
                    setSelectedTopic(
                      selectedTopic?.videoId === row.videoId ? null : row
                    )
                  }
                  onAnalyze={() => handleAnalyze(row.videoId)}
                />
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedTopic && (
            <TopicDetails
              selected={selectedTopic}
              onClose={() => setSelectedTopic(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
