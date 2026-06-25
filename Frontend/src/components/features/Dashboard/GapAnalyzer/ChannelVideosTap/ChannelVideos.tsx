"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  Search,
  Sparkles,
  PlayCircle,
  Eye,
  Loader2,
  MonitorPlay,
  SearchX,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { TopicDetails } from "../TrendingTap/TopicDetails";
import {
  useLazyGetChannelVideosQuery,
  useAnalyzeVideoMutation,
} from "@/services/gapApi";
import type { TrendingVideo, TabComponentProps } from "@/types/gap-analyzer";
import { formatViews } from "../TrendingTap/TrendingVideoItem";
import { useCreditCheck } from "@/hooks/useCreditCheck";

const getScoreColor = (score: number) => {
  if (score >= 70) return "#34D399";
  if (score >= 40) return "#FBBF24";
  return "#EF4444";
};

const normalizeScore = (score: number) => Math.min(Math.max(score, 0), 100);

type SortConfig = {
  key: keyof TrendingVideo | null;
  direction: "asc" | "desc";
};

export function AnalyzeChannel({
  onAnalysisComplete,
  channelState,
  setChannelState,
  currentBalance = 0,
  onInsufficientCredits,
}: TabComponentProps) {
  const [fetchChannelVideos, { isFetching, isError }] =
    useLazyGetChannelVideosQuery();
  const [analyzeVideo] = useAnalyzeVideoMutation();

  const [analyzingVideoId, setAnalyzingVideoId] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });

  const { validateAction } = useCreditCheck(currentBalance);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ channelHandle: string }>({
    defaultValues: {
      channelHandle: channelState.channelName || "",
    },
  });

  const handleSearch = async (handleOverride?: string) => {
    const handleToSearch = handleOverride || channelState.channelName;
    if (!handleToSearch.trim()) return;

    const { isAllowed, requiredCredits } = validateAction({
      action: "search",
    });

    if (!isAllowed) {
      if (onInsufficientCredits) onInsufficientCredits(requiredCredits);
      return;
    }

    setChannelState((prev) => ({
      ...prev,
      hasSearched: true,
      results: [],
      selectedTopic: null,
    }));

    try {
      const data = await fetchChannelVideos(handleToSearch.trim()).unwrap();

      setChannelState((prev) => ({ ...prev, results: data || [] }));
      setSortConfig({ key: null, direction: "desc" });
    } catch (error) {
      console.error("Failed to fetch channel videos", error);
      setChannelState((prev) => ({ ...prev, results: [] }));
    }
  };

  const onFormSubmit = (data: { channelHandle: string }) => {
    setChannelState((prev) => ({ ...prev, channelName: data.channelHandle }));
    handleSearch(data.channelHandle);
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
    if (!channelState.results || channelState.results.length === 0) return [];

    const sortableItems = [...channelState.results];

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
  }, [channelState.results, sortConfig]);

  const gridLayout = "2.5fr 100px 100px 100px 100px 180px";

  const sortOptions: { label: string; key: keyof TrendingVideo }[] = [
    { label: "Gap Score", key: "gapScore" },
    { label: "Demand", key: "demandScore" },
    { label: "Competition", key: "competitionScore" },
    { label: "Trend", key: "trendScore" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-border flex flex-col gap-4 rounded-2xl border p-4 shadow-sm"
      >
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex w-full flex-col gap-2"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MonitorPlay
                size={16}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-(--text-dim)"
              />
              <input
                {...register("channelHandle", {
                  required: "Channel Name is required",
                  validate: (value) =>
                    value.startsWith("@") || "Channel Name must start with '@'",
                })}
                placeholder="Enter a YouTube Channel Name (e.g. @MrBeast)"
                className={`border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border bg-(--surface-1) pr-4 pl-11 text-sm transition-all outline-none focus:ring-2 ${
                  errors.channelHandle
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isFetching}
              className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-8 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "var(--gradient-aurora)",
                backgroundSize: "200% 200%",
                animation: "at-gradient-shift 4s ease infinite",
                boxShadow: "var(--glow-primary-sm)",
              }}
            >
              {isFetching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={16} />
                </motion.div>
              ) : (
                <Search size={16} />
              )}
              {isFetching ? "Searching..." : "Search Channel"}
            </button>
          </div>

          <AnimatePresence>
            {errors.channelHandle && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="ml-2 text-xs font-medium text-red-500"
              >
                {errors.channelHandle.message}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        {channelState.results.length > 0 && (
          <div className="border-border mt-2 flex flex-wrap items-center gap-3 border-t pt-4 sm:gap-4">
            <span className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
              SORT BY
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
                        ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                        : "border-border text-foreground bg-transparent hover:bg-(--surface-2)"
                    }`}
                  >
                    {option.label}
                    {isActive && (
                      <span className="text-primary flex items-center justify-center">
                        {sortConfig.direction === "asc" ? (
                          <ArrowUp size={12} strokeWidth={3} />
                        ) : (
                          <ArrowDown size={12} strokeWidth={3} />
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

      <div
        className="flex min-h-100 flex-1 flex-col transition-all duration-300 xl:grid"
        style={{
          gridTemplateColumns: channelState.selectedTopic ? "1fr 340px" : "1fr",
          gap: "1.5rem",
        }}
      >
        {isFetching ? (
          <ChannelVideosLoadingState />
        ) : !channelState.hasSearched ? (
          <ChannelVideosEmptyState />
        ) : isError || channelState.results.length === 0 ? (
          <ChannelVideosNoResultsState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border-border overflow-hidden rounded-2xl border"
          >
            <div className="hidden lg:block">
              <div
                className="border-border grid items-center border-b bg-(--surface-1) px-5 py-3"
                style={{ gridTemplateColumns: gridLayout, gap: "16px" }}
              >
                {[
                  "Video",
                  "Gap Score",
                  "Demand",
                  "Competition",
                  "Trend",
                  "Actions",
                ].map((h, i) => (
                  <div
                    key={h}
                    className={`text-[10px] font-bold tracking-widest text-(--text-dim) uppercase ${
                      i === 5 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4 lg:gap-0 lg:p-0">
              {sortedResults.map((row, i) => {
                const isAnalyzing = analyzingVideoId === row.videoId;
                const isSelected =
                  channelState.selectedTopic?.videoId === row.videoId;
                const isAnyAnalyzing = analyzingVideoId !== null;

                return (
                  <motion.div
                    key={row.videoId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-4 shadow-sm transition-colors last:border-b-0 hover:bg-(--hover-overlay) lg:grid lg:items-center lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:bg-transparent lg:p-5 lg:shadow-none"
                    style={{
                      gridTemplateColumns: "1fr",
                    }}
                  >
                    <div className="hidden lg:contents">
                      <div
                        className="lg:grid lg:w-full lg:items-center"
                        style={{
                          gridTemplateColumns: gridLayout,
                          gap: "16px",
                          display: "grid",
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-4 pr-4">
                          <div className="border-border group relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border">
                            <Image
                              src={row.thumbnailUrl}
                              alt={row.title}
                              fill
                              sizes="80px"
                              quality={60}
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                              <PlayCircle size={16} className="text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-foreground mb-1 truncate text-[13px] font-bold"
                              title={row.title}
                            >
                              {row.title}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-primary truncate text-[11px] font-medium">
                                {row.channelTitle}
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                                <Eye size={14} className="size-3" />
                                {formatViews(row.viewCount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <span
                            className="font-mono text-lg font-extrabold"
                            style={{ color: getScoreColor(row.gapScore) }}
                          >
                            {row.gapScore}
                          </span>
                        </div>

                        {[
                          { v: row.demandScore, isRaw: true, c: "#7C5CFC" },
                          {
                            v: row.competitionScore,
                            isRaw: false,
                            c: getScoreColor(
                              100 - normalizeScore(row.competitionScore)
                            ),
                          },
                          { v: row.trendScore, isRaw: false, c: "#A855F7" },
                        ].map((m, mi) => {
                          const displayValue = m.isRaw
                            ? m.v
                            : normalizeScore(m.v);
                          return (
                            <div
                              key={mi}
                              className="flex flex-col justify-center pr-2"
                            >
                              <div className="text-foreground mb-1 text-[11px] font-semibold">
                                {m.isRaw
                                  ? `${m.v}%`
                                  : `${Math.round(displayValue)}%`}
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--surface-2)">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: m.isRaw
                                      ? `${m.v}%`
                                      : `${displayValue}%`,
                                  }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "easeOut",
                                  }}
                                  className="h-full rounded-full"
                                  style={{ background: m.c }}
                                />
                              </div>
                            </div>
                          );
                        })}

                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              setChannelState((prev) => ({
                                ...prev,
                                selectedTopic: isSelected ? null : row,
                              }))
                            }
                            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-all ${
                              isSelected
                                ? "bg-primary border-primary text-white shadow-md"
                                : "border-border hover:border-primary/50 text-foreground bg-transparent hover:bg-(--surface-2)"
                            }`}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => handleAnalyze(row.videoId)}
                            disabled={isAnalyzing || isAnyAnalyzing}
                            className="bg-primary/10 text-primary border-primary/30 hover:bg-primary hover:border-primary flex h-9 cursor-pointer items-center justify-center rounded-lg border px-4 text-xs font-bold transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isAnalyzing ? (
                              <span className="flex items-center gap-1.5">
                                <Loader2 size={14} className="animate-spin" />
                                Analyzing...
                              </span>
                            ) : (
                              "Analyze Topic"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:hidden">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="border-border group relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={row.thumbnailUrl}
                            alt={row.title}
                            fill
                            sizes="80px"
                            quality={60}
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                            <PlayCircle size={16} className="text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-foreground mb-1.5 line-clamp-2 text-sm font-bold"
                            title={row.title}
                          >
                            {row.title}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-primary truncate text-[12px] font-medium">
                              {row.channelTitle}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                              <Eye size={14} />
                              {formatViews(row.viewCount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 rounded-xl bg-(--surface-1) p-4">
                        <div className="flex flex-col justify-center">
                          <span className="text-muted-foreground mb-1 text-[10px] font-bold tracking-wider uppercase">
                            Gap Score
                          </span>
                          <span
                            className="font-mono text-2xl font-extrabold"
                            style={{ color: getScoreColor(row.gapScore) }}
                          >
                            {row.gapScore}
                          </span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {[
                            {
                              label: "Demand",
                              v: row.demandScore,
                              isRaw: true,
                              c: "#7C5CFC",
                            },
                            {
                              label: "Competition",
                              v: row.competitionScore,
                              isRaw: false,
                              c: getScoreColor(
                                100 - normalizeScore(row.competitionScore)
                              ),
                            },
                            {
                              label: "Trend",
                              v: row.trendScore,
                              isRaw: false,
                              c: "#A855F7",
                            },
                          ].map((m, mi) => {
                            const displayValue = m.isRaw
                              ? m.v
                              : normalizeScore(m.v);
                            return (
                              <div key={mi} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground text-[10px] font-medium">
                                    {m.label}
                                  </span>
                                  <span className="text-foreground text-[11px] font-semibold">
                                    {m.isRaw
                                      ? `${m.v}%`
                                      : `${Math.round(displayValue)}%`}
                                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-(--surface-2)">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: m.isRaw
                                        ? `${m.v}%`
                                        : `${displayValue}%`,
                                    }}
                                    transition={{
                                      duration: 0.5,
                                      ease: "easeOut",
                                    }}
                                    className="h-full rounded-full"
                                    style={{ background: m.c }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-end gap-3">
                        <button
                          onClick={() =>
                            setChannelState((prev) => ({
                              ...prev,
                              selectedTopic: isSelected ? null : row,
                            }))
                          }
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-all ${
                            isSelected
                              ? "bg-primary border-primary text-white shadow-md"
                              : "border-border hover:border-primary/50 text-foreground bg-transparent hover:bg-(--surface-2)"
                          }`}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleAnalyze(row.videoId)}
                          disabled={isAnalyzing || isAnyAnalyzing}
                          className="bg-primary/10 text-primary border-primary/30 hover:bg-primary hover:border-primary flex h-10 flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-bold transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isAnalyzing ? (
                            <span className="flex items-center gap-2">
                              <Loader2 size={16} className="animate-spin" />
                              Analyzing...
                            </span>
                          ) : (
                            "Analyze Topic"
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {channelState.selectedTopic && (
            <TopicDetails
              selected={channelState.selectedTopic}
              onClose={() =>
                setChannelState((prev) => ({ ...prev, selectedTopic: null }))
              }
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChannelVideosEmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
      <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <MonitorPlay size={28} className="text-primary" />
      </div>
      <h3 className="text-foreground text-lg font-bold">Search a Channel</h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        Enter a YouTube Channel Handle (e.g. @MrBeast) to discover their videos
        and find content gap opportunities.
      </p>
    </div>
  );
}

function ChannelVideosNoResultsState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
        <SearchX size={28} className="text-rose-500" />
      </div>
      <h3 className="text-foreground text-lg font-bold">No Videos Found</h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        We couldn&apos;t find any videos for this channel. Double-check the
        Channel Name and try again.
      </p>
    </div>
  );
}

function ChannelVideosLoadingState() {
  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      <div className="hidden lg:block">
        <div
          className="border-border grid border-b bg-(--surface-1) px-5 py-3"
          style={{
            gridTemplateColumns: "2.5fr 100px 100px 100px 100px 180px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-16 animate-pulse rounded bg-(--surface-2)"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 lg:gap-0 lg:p-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-4 shadow-sm last:border-0 lg:grid lg:grid-cols-[2.5fr_100px_100px_100px_100px_180px] lg:items-center lg:gap-4 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:bg-transparent lg:p-5 lg:shadow-none"
          >
            <div className="flex items-center gap-3">
              <div className="h-16 w-28 animate-pulse rounded-md bg-(--surface-2) lg:h-12 lg:w-20" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-(--surface-2)" />
                <div className="h-2.5 w-1/2 animate-pulse rounded bg-(--surface-2)" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl bg-(--surface-1) p-4 lg:contents lg:bg-transparent lg:p-0">
              <div className="h-6 w-12 animate-pulse rounded bg-(--surface-2)" />
              <div className="flex flex-col gap-3 lg:contents">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-3 w-full animate-pulse rounded bg-(--surface-2) lg:w-12"
                  />
                ))}
              </div>
            </div>

            <div className="mt-2 flex justify-end gap-2 lg:mt-0">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-(--surface-2) lg:h-8 lg:w-8" />
              <div className="h-10 flex-1 animate-pulse rounded-lg bg-(--surface-2) lg:h-8 lg:w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
