"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fadeIn } from "@/lib/animations";
import { ContentCategory } from "@/types/analytics";

const COLORS = ["#7C5CFC", "#A855F7", "#F472B6", "#34D399"];

export function CategoriesPie({
  categories,
}: {
  categories: ContentCategory[];
}) {
  const chartData = categories.map((c, i) => ({
    name: c.category,
    value: c.percentage,
    color: COLORS[i % COLORS.length],
  }));

  const isDataEmpty = chartData.every((c) => c.value === 0);
  const displayData = isDataEmpty
    ? [{ name: "No Data", value: 100, color: "var(--surface-3)" }]
    : chartData;

  return (
    <motion.div {...fadeIn(0.36)} className="h-full w-full">
      <div className="border-border bg-card flex h-full flex-col rounded-2xl border p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] sm:p-5">
        <div className="mb-2 sm:mb-4">
          <h3 className="text-foreground mb-0.5 text-sm font-bold tracking-tight">
            Content Categories
          </h3>
        </div>

        <div className="relative flex min-h-55 w-full flex-1 items-center justify-center py-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {!isDataEmpty && (
                <Tooltip content={<CustomTooltip />} cursor={false} />
              )}
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={6}
              >
                {displayData.map((e, index) => (
                  <Cell key={`cell-${index}`} fill={e.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-foreground text-2xl font-extrabold tracking-tight">
              100%
            </span>
            <span className="mt-0.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
              Total
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 sm:mt-2">
          {chartData.map((c) => (
            <div
              key={c.name}
              className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors hover:bg-(--hover-overlay)"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-2.5 w-2.5 rounded-full shadow-sm"
                  style={{ background: c.color }}
                />
                <span className="text-[12px] font-medium text-(--text-dim)">
                  {c.name}
                </span>
              </div>
              <span className="text-foreground font-mono text-[12px] font-bold">
                {c.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: {
      name: string;
      value: number;
      color?: string;
    };
    fill?: string;
  }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="border-border/60 bg-card/90 rounded-xl border p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className="h-2 w-2 rounded-full shadow-sm"
            style={{ background: data.color || (payload[0].fill as string) }}
          />
          <span className="text-[11px] font-medium text-(--text-dim)">
            {data.name}
          </span>
          <span className="text-foreground text-[11px] font-bold">
            {data.value.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};
