"use client";

import {
  FileSearch,
  TrendingUp,
  Target,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { fadeIn } from "@/lib/animations";
import { motion } from "framer-motion";
import { useGetDiscoveryStatsQuery } from "@/services/gapApi";

const D = motion.create("div");

export function Stats({
  onOpenModal,
}: {
  onOpenModal: (type: "high-growth" | "easy-wins") => void;
}) {
  const { data: stats } = useGetDiscoveryStatsQuery();

  const Data = [
    {
      label: "Topics Analyzed",
      value: stats?.topicsAnalyzed?.toLocaleString() || "0",
      icon: FileSearch,
      color: "#7C5CFC",
    },
    {
      label: "Easy Wins Found",
      value: `${stats?.easyWinsPercentage || 0}%`,
      icon: Trophy,
      color: "#34D399",
      onClickType: "easy-wins" as const,
      clickable: true,
    },
    {
      label: "Avg Gap Score",
      value: `${stats?.avgGapPercentage || 25}%`,
      icon: Target,
      color: "#A855F7",
    },
    {
      label: "High-Growth Channels",
      value: stats?.highGrowthChannels?.toLocaleString() || "0",
      icon: TrendingUp,
      color: "#F472B6",
      onClickType: "high-growth" as const,
      clickable: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      {Data.map((k, i) => (
        <D key={k.label} {...fadeIn(0.04 + i * 0.05)} className="h-full">
          <div
            onClick={() =>
              k.clickable && k.onClickType && onOpenModal(k.onClickType)
            }
            className={`group bg-card border-border hover:shadow-elevation-md relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-(--border-active) sm:p-5 ${
              k.clickable ? "cursor-pointer" : ""
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <span className="text-[10px] leading-snug font-bold tracking-wide text-(--text-dim) uppercase sm:text-xs">
                {k.label}
              </span>

              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${k.color}15`,
                    color: k.color,
                  }}
                >
                  <k.icon size={16} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              <span className="text-foreground font-mono text-2xl font-black tracking-tight sm:text-3xl">
                {k.value}
              </span>

              {k.clickable && (
                <div className="group-hover:bg-primary flex h-7 w-7 items-center justify-center rounded-lg bg-(--surface-2) text-(--text-dim) transition-colors group-hover:text-white">
                  <ArrowUpRight size={14} />
                </div>
              )}
            </div>

            <div
              className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
              style={{ background: k.color }}
            />
          </div>
        </D>
      ))}
    </div>
  );
}
