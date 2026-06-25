"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { AnalyticsSummary } from "@/types/analytics";
import { Eye, Users, Clock, Activity, Video } from "lucide-react";

const formatNumber = (num: number = 0) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export function AnalyticsKPIs({ summary }: { summary?: AnalyticsSummary }) {
  const kpisData = [
    {
      label: "Total Views",
      val: formatNumber(summary?.totalViews ?? 0),
      icon: Eye,
      color: "#7C5CFC",
    },
    {
      label: "Subscribers",
      val: formatNumber(summary?.subscribers ?? 0),
      icon: Users,
      color: "#EC4899",
    },
    {
      label: "Watch Time (Hrs)",
      val: formatNumber(summary?.watchTimeHours ?? 0),
      icon: Clock,
      color: "#34D399",
    },
    {
      label: "Engagement Rate",
      val: `${summary?.avgEngagementRate ?? 0}%`,
      icon: Activity,
      color: "#FBBF24",
    },
    {
      label: "Video Count",
      val: `${summary?.videoCount ?? 0}`,
      icon: Video,
      color: "#3B82F6",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {kpisData.map((k, i) => (
        <motion.div
          key={k.label}
          {...fadeIn(0.04 + i * 0.06)}
          className="h-full"
        >
          <div className="group bg-card border-border hover:shadow-elevation-md relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-(--border-active) sm:p-5">
            <div
              className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
              style={{ background: k.color }}
            />
            <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
              <span className="text-[10px] leading-snug font-bold tracking-wide text-(--text-dim) uppercase sm:text-xs">
                {k.label}
              </span>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${k.color}15`, color: k.color }}
              >
                <k.icon size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div className="relative z-10 mt-auto flex items-end gap-2 sm:gap-3">
              <span className="text-foreground font-mono text-2xl font-extrabold tracking-tighter">
                {k.val}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
