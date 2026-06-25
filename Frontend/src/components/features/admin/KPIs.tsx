"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Zap } from "lucide-react";
import { DashboardStats } from "@/types/adminDashboard";
import { fadeIn } from "@/lib/animations";

const D = motion.create("div");

export function KPIs({ data }: { data: DashboardStats | null }) {
  const kpis = data
    ? [
        {
          label: "Total Users",
          value: data.totalUsers,
          icon: Users,
          color: "#7C5CFC",
        },
        {
          label: "Active Users",
          value: data.activeUsers,
          icon: Zap,
          color: "#34D399",
        },
        {
          label: "Monthly Revenue",
          value: `$${data.monthlyRevenue}`,
          icon: DollarSign,
          color: "#FBBF24",
        },
        {
          label: "Avg Analyses/User",
          value: data.avgAnalysesPerUser.toFixed(2),
          icon: TrendingUp,
          color: "#A855F7",
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpis.map((k, i) => (
        <D key={k.label} {...fadeIn(0.04 + i * 0.05)} className="h-full">
          <div className="bg-card border-border hover:shadow-elevation-md group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-(--border-active) sm:p-5">
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
            <div className="relative z-10 mt-auto">
              <div className="mb-3 flex items-end justify-between">
                <div className="text-foreground font-mono text-2xl font-extrabold tracking-tighter">
                  {k.value}
                </div>
              </div>
            </div>
          </div>
        </D>
      ))}
    </div>
  );
}
