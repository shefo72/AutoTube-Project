"use client";

import { motion } from "framer-motion";
import { Eye, Loader2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { TrendingVideo } from "@/types/gap-analyzer";
import Image from "next/image";

const getScoreColor = (score: number) => {
  if (score >= 0.7) return "#34D399";
  if (score >= 0.4) return "#FBBF24";
  return "#EF4444";
};

const normalizeScore = (score: number): number => {
  return score <= 10 ? score * 10 : score;
};

interface TrendingVideoItemProps {
  video: TrendingVideo;
  index: number;
  isAnalyzing: boolean;
  isSelected: boolean;
  isAnyAnalyzing: boolean;
  onToggleSelect: () => void;
  onAnalyze: () => void;
}
export const formatViews = (views: number): string => {
  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return views.toString();
};

export function TrendingVideoItem({
  video,
  index,
  isAnalyzing,
  isAnyAnalyzing,
  isSelected,
  onToggleSelect,
  onAnalyze,
}: TrendingVideoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-4 shadow-sm transition-colors last:border-b-0 hover:bg-(--hover-overlay) lg:grid lg:grid-cols-[2.5fr_100px_100px_100px_100px_180px] lg:items-center lg:gap-4 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:bg-transparent lg:p-5 lg:shadow-none"
    >
      {/*  Video Info */}
      <div className="flex min-w-0 flex-1 items-center gap-4 lg:pr-4">
        <div className="border-border relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border lg:h-12 lg:w-20">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            sizes="80px"
            quality={60}
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="text-foreground mb-1.5 line-clamp-2 text-sm font-bold lg:mb-1 lg:truncate lg:text-[13px]"
            title={video.title}
          >
            {video.title}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-primary truncate text-[12px] font-medium lg:text-[11px]">
              {video.channelTitle}
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] lg:gap-1 lg:text-[10px]">
              <Eye size={14} className="lg:size-3" />
              {formatViews(video.viewCount)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl bg-(--surface-1) p-4 lg:contents lg:bg-transparent lg:p-0">
        {/* Gap Score */}
        <div className="flex flex-col justify-center">
          <span className="text-muted-foreground mb-1 text-[10px] font-bold tracking-wider uppercase lg:hidden">
            Gap Score
          </span>
          <span
            className="font-mono text-2xl font-extrabold lg:text-lg"
            style={{ color: getScoreColor(video.gapScore) }}
          >
            {video.gapScore}
          </span>
        </div>

        <div className="flex flex-col gap-3 lg:contents">
          {[
            {
              label: "Demand",
              v: video.demandScore,
              isRaw: true,
              c: "#7C5CFC",
            },
            {
              label: "Competition",
              v: video.competitionScore,
              isRaw: false,
              c: getScoreColor(100 - normalizeScore(video.competitionScore)),
            },
            { label: "Trend", v: video.trendScore, isRaw: false, c: "#A855F7" },
          ].map((m, mi) => {
            const displayValue = m.isRaw ? m.v : normalizeScore(m.v);

            return (
              <div key={mi} className="flex flex-col gap-1.5 lg:block lg:pr-4">
                <div className="flex items-center justify-between lg:mb-1">
                  <span className="text-muted-foreground text-[10px] font-medium lg:hidden">
                    {m.label}
                  </span>
                  <span className="text-foreground text-[11px] font-semibold">
                    {m.isRaw ? `${m.v}%` : `${Math.round(displayValue)}%`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-(--surface-2) lg:h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: m.isRaw ? `${m.v}%` : `${displayValue}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: m.c }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-3 lg:mt-0 lg:justify-end lg:pr-2">
        <Tooltip content="View Details">
          <button
            onClick={onToggleSelect}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-all lg:h-9 lg:w-9 lg:rounded-lg ${
              isSelected
                ? "bg-primary border-primary text-white shadow-md"
                : "border-border hover:border-primary/50 text-foreground bg-transparent hover:bg-(--surface-2)"
            }`}
          >
            <Eye size={18} className="lg:size-4" />
          </button>
        </Tooltip>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || isAnyAnalyzing}
          className="bg-primary/10 text-primary border-primary/30 hover:bg-primary hover:border-primary flex h-10 flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-bold transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-70 lg:h-9 lg:flex-none lg:rounded-lg lg:text-xs"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2 lg:gap-1.5">
              <Loader2 size={16} className="animate-spin lg:size-3" />
              Analyzing...
            </span>
          ) : (
            "Analyze Topic"
          )}
        </button>
      </div>
    </motion.div>
  );
}
