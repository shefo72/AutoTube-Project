"use client";
import { motion } from "framer-motion";
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import { fadeIn } from "@/lib/animations";
import { GrowthData } from "@/types/userDashboard";

const D = motion.create("div");

export function Chart({ growthData }: { growthData: GrowthData[] }) {
  const chartData = growthData.map((g) => ({
    d: g.dayName,
    v: g.value,
  }));

  return (
    <D {...fadeIn(0.3)}>
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-foreground mb-0.5 text-sm font-bold">
              Growth Overview
            </div>
            <div className="text-[11px] text-(--text-dim)">
              Weekly content performance
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="d"
              tick={{ fontSize: 10, fill: "var(--text-dim)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--text-dim)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 11,
                color: "var(--foreground)",
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#7C5CFC"
              fill="url(#areaGrad)"
              strokeWidth={2.5}
              dot={{
                r: 3,
                fill: "#7C5CFC",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "#7C5CFC",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </D>
  );
}
