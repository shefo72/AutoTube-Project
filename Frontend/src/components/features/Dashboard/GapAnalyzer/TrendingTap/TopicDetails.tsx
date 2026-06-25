/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  badgeColors,
  badgeLabel,
  scoreColor,
  YOUTUBE_CATEGORIES,
} from "@/constants/gap-analyzer";
import type { BadgeType } from "@/types/gap-analyzer";

const getCategoryName = (id: number | string) => {
  const category = YOUTUBE_CATEGORIES.find((cat) => cat.id === Number(id));
  return category ? category.name : "General";
};

const normalizeScore = (score: number): number => {
  return score < 10 ? score * 10 : score;
};

export function TopicDetails({
  selected,
  onClose,
}: {
  selected: any;
  onClose: () => void;
}) {
  if (!selected) return null;

  const title = selected.keyword || selected.title || "Unknown Topic";
  const gapScore = selected.gapScore || 0;
  const demand = selected.demand ?? selected.demandScore ?? 0;
  const competition = selected.competition ?? selected.competitionScore ?? 0;
  const trend = selected.trend ?? selected.trendScore ?? 0;

  let badgeKey: string = selected.badge ?? "";
  if (!badgeKey) {
    if (gapScore >= 0.7) badgeKey = "golden";
    else if (gapScore >= 0.4) badgeKey = "emerging";
    else badgeKey = "easy-win";
  }

  const isBadgeType = (key: string): key is BadgeType => key in badgeColors;

  const theme = isBadgeType(badgeKey)
    ? badgeColors[badgeKey]
    : {
        bg: "rgba(124, 92, 252, 0.1)",
        text: "#7C5CFC",
        border: "rgba(124, 92, 252, 0.2)",
      };
  const label = isBadgeType(badgeKey) ? badgeLabel[badgeKey] : "Standard";

  const stat1Label =
    selected.searchVolume !== undefined ? "Search Vol" : "Views";
  const stat1Value = selected.searchVolume ?? selected.viewCount ?? 0;

  const stat2Label = selected.avgViews !== undefined ? "Avg Views" : "Likes";
  const stat2Value = selected.avgViews ?? selected.likeCount ?? 0;

  const difficulty =
    competition < 30 ? "Easy" : competition < 60 ? "Medium" : "Hard";

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.24 }}
    >
      <div className="bg-card border-border sticky top-20 rounded-2xl border p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                background: theme.bg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
            >
              {label}
            </span>
            <div className="text-foreground mt-2.5 text-sm leading-relaxed font-bold">
              {title}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-(--text-dim) transition-colors hover:bg-(--hover-overlay)"
          >
            <X size={14} />
          </button>
        </div>

        <div className="border-border mb-5 border-t border-b py-6 text-center">
          <div
            className="font-mono text-5xl leading-none font-extrabold tracking-tighter"
            style={{ color: scoreColor ? scoreColor(gapScore) : "#7C5CFC" }}
          >
            {gapScore}
          </div>
          <div className="mt-1.5 text-[11px] text-(--text-dim)">Gap Score</div>
        </div>

        <div className="mb-5 space-y-4">
          {[
            { label: "Demand", value: demand, color: "#7C5CFC", isRaw: true },
            {
              label: "Competition",
              value: competition,
              color:
                competition < 0.3
                  ? "#34D399"
                  : competition < 0.6
                    ? "#FBBF24"
                    : "#EF4444",
              isRaw: false,
            },
            { label: "Trend", value: trend, color: "#A855F7", isRaw: false },
          ].map((m) => {
            const displayValue = m.isRaw ? m.value : normalizeScore(m.value);

            return (
              <div key={m.label}>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-[11px] text-(--text-dim)">
                    {m.label}
                  </span>
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{ color: m.color }}
                  >
                    {m.isRaw ? `${m.value}%` : `${Math.round(displayValue)}%`}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-(--surface-2)">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${displayValue}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {[
            {
              label: stat1Label,
              value:
                typeof stat1Value === "number"
                  ? stat1Value.toLocaleString()
                  : stat1Value,
            },
            {
              label: stat2Label,
              value:
                typeof stat2Value === "number"
                  ? stat2Value.toLocaleString()
                  : stat2Value,
            },
            { label: "Category", value: getCategoryName(selected.category) },
            { label: "Difficulty", value: difficulty },
          ].map((s) => (
            <div
              key={s.label}
              className="border-border rounded-xl border bg-(--surface-1) px-3 py-3"
            >
              <div className="mb-1 text-[9px] font-bold tracking-widest text-(--text-dim) uppercase">
                {s.label}
              </div>
              <div
                className="text-foreground truncate font-mono text-sm font-bold"
                title={String(s.value)}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
