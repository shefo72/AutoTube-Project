"use client";

import { fadeIn } from "@/lib/animations";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Image as ImageIcon,
  Clapperboard,
  Activity as ActivityIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Productivity } from "@/types/userDashboard";
import { Tooltip } from "@/components/ui/tooltip";

const D = motion.create("div");

export function ProductivityFeed({ data }: { data: Productivity }) {
  const isQuiet =
    !data ||
    (data.weeklyOutput.scripts === 0 &&
      data.weeklyOutput.thumbnails === 0 &&
      data.weeklyOutput.videos === 0 &&
      data.weeklyOutput.analyses === 0);

  const impact = data?.impactScore || 0;
  const hasImpact = impact > 0;

  return (
    <D {...fadeIn(0.48)} className="h-full">
      <div className="bg-card border-border flex h-full flex-col rounded-2xl border p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(168,85,247,0.18)] bg-[rgba(168,85,247,0.1)]">
              <ActivityIcon size={13} color="#A855F7" />
            </div>
            <span className="text-foreground text-sm font-bold">
              Productivity Snapshot
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div
            className={`relative mb-6 overflow-hidden rounded-2xl border p-4 transition-all duration-500`}
          >
            <div className="relative flex items-center gap-4">
              <Tooltip content="Performance score based on productivity, consistency, and diversity.">
                <div
                  className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border`}
                >
                  {hasImpact ? (
                    <TrendingUp size={16} className="mb-1 text-emerald-500" />
                  ) : (
                    <TrendingDown
                      size={16}
                      className="mb-1 text-(--text-dim)"
                    />
                  )}
                  <span className="text-foreground font-mono text-xl leading-none font-black">
                    {impact}
                  </span>
                </div>
              </Tooltip>

              <div className="flex-1">
                <div
                  className={`mb-1 text-[10px] font-bold tracking-widest uppercase ${
                    hasImpact ? "text-emerald-500" : "text-(--text-dim)"
                  }`}
                >
                  Impact Score
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {data?.insight ||
                    "Keep creating content to build your impact score!"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
              Last 7 Days Output
            </div>
            <div className="grid grid-cols-2 gap-3">
              <OutputCard
                title="Scripts"
                value={data?.weeklyOutput?.scripts || 0}
                icon={FileText}
                color="#A855F7"
              />
              <OutputCard
                title="Thumbnails"
                value={data?.weeklyOutput?.thumbnails || 0}
                icon={ImageIcon}
                color="#34D399"
              />
              <OutputCard
                title="Videos"
                value={data?.weeklyOutput?.videos || 0}
                icon={Clapperboard}
                color="#F472B6"
              />
              <OutputCard
                title="Analyses"
                value={data?.weeklyOutput?.analyses || 0}
                icon={Sparkles}
                color="#3B82F6"
              />
            </div>
          </div>

          {!isQuiet && data?.mostUsedFeature && (
            <div className="mt-auto pt-5">
              <div className="border-border flex items-center justify-between border-t pt-4">
                <span className="text-xs font-medium text-(--text-dim)">
                  Most Used Feature:
                </span>
                <span className="text-foreground border-border rounded-md border bg-(--surface-1) px-2.5 py-1 text-xs font-bold shadow-sm">
                  {data.mostUsedFeature}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </D>
  );
}

function OutputCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  const isZero = value === 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 ${
        isZero
          ? "border-border/50 bg-transparent opacity-60"
          : "border-border bg-(--surface-1) hover:shadow-sm"
      }`}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: isZero ? "var(--surface-2)" : `${color}15`,
          border: `1px solid ${isZero ? "transparent" : `${color}30`}`,
        }}
      >
        <Icon size={14} color={isZero ? "var(--text-dim)" : color} />
      </div>
      <div>
        <div className="text-foreground font-mono text-sm font-bold">
          {value}
        </div>
        <div className="text-[10px] font-medium text-(--text-dim)">{title}</div>
      </div>
    </div>
  );
}
