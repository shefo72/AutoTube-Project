/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import { fadeIn } from "@/lib/animations";
import { GrowthTrend } from "@/types/analytics";

const ttStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "var(--foreground)",
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  padding: "10px 14px",
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function SubscribersChart({ trends }: { trends: GrowthTrend[] }) {
  const chartData = trends.map((t) => ({
    name: new Date(t.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    subs: t.subscribers,
  }));

  return (
    <motion.div {...fadeIn(0.42)}>
      <div className="bg-card border-border h-full rounded-2xl border p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-foreground mb-1 text-base font-bold tracking-tight">
              Subscribers Growth
            </h3>
            <p className="text-xs font-medium text-(--text-dim)">
              Subscriber changes over time
            </p>
          </div>
          <div className="border-border/60 bg-muted/30 flex items-center gap-2 rounded-full border px-3 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-foreground text-[11px] font-bold tracking-wide uppercase">
              Subscribers
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity={0.4} />
                <stop offset="80%" stopColor="#34D399" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
              opacity={0.5}
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--text-dim)", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />

            <YAxis
              domain={["dataMin", "auto"]}
              tick={{ fontSize: 11, fill: "var(--text-dim)", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatNumber}
              width={40}
              tickMargin={8}
            />

            <Tooltip
              contentStyle={ttStyle}
              cursor={{
                stroke: "#34D399",
                strokeWidth: 1,
                strokeDasharray: "4 4",
                opacity: 0.5,
              }}
              formatter={(value: any) => [
                <span key="val" className="text-foreground font-bold">
                  {Number(value).toLocaleString()}
                </span>,
                <span key="lbl" className="text-muted-foreground">
                  Subscribers
                </span>,
              ]}
              labelStyle={{
                color: "var(--text-dim)",
                marginBottom: "4px",
                fontWeight: 600,
              }}
            />

            <Area
              type="monotone"
              dataKey="subs"
              stroke="#34D399"
              fill="url(#subsGradient)"
              strokeWidth={3}
              activeDot={{
                r: 6,
                fill: "#34D399",
                stroke: "var(--card)",
                strokeWidth: 3,
                style: {
                  filter: "drop-shadow(0px 4px 8px rgba(52, 211, 153, 0.4))",
                },
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
