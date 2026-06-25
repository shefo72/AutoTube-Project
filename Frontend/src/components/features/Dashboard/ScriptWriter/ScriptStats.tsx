"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import type { ScriptResponse } from "@/types/script";

interface ScriptStatsProps {
  stats: ScriptResponse["stats"] | null;
}

export function ScriptStats({ stats }: ScriptStatsProps) {
  if (!stats) return null;

  const statsData = [
    {
      label: "Word Count",
      value: stats.total_words.toString(),
      color: "#3B82F6",
    },
    { label: "Est. Duration", value: stats.duration, color: "#10B981" },
    { label: "Readability", value: stats.readability, color: "#8B5CF6" },
    {
      label: "Hook Strength",
      value: `${stats.hook_strength}`,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {statsData.map((s, i) => (
        <motion.div key={s.label} {...fadeIn(0.1 + i * 0.05)}>
          <div className="bg-card border-border flex items-center justify-between rounded-2xl border px-5 py-4 transition-all hover:border-(--surface-4)">
            <span className="text-[11px] text-(--text-dim)">{s.label}</span>
            <span
              className="font-mono text-[12px] font-extrabold tracking-tight md:text-xl"
              style={{ color: s.color }}
            >
              {s.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
