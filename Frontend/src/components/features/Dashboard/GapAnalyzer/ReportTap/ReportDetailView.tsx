"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Lightbulb,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { GapAggregateData } from "@/types/gap-analyzer";
import { Tooltip } from "@/components/ui/tooltip";
import { ExportReportBtn } from "./ExportReportBtn";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const STRATEGY_CONFIG = [
  {
    key: "immediateActions",
    title: "Immediate Actions",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    key: "contentStrategy",
    title: "Content Strategy",
    icon: Lightbulb,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    key: "retentionTactics",
    title: "Retention Tactics",
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    key: "growthOpportunities",
    title: "Growth Opportunities",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
] as const;

export function ReportDetailView({
  report,
  onBack,
}: {
  report: GapAggregateData;
  onBack: () => void;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 pb-10"
    >
      <motion.div
        variants={itemVariants}
        className="mb-2 flex w-full flex-col gap-5 md:flex-row md:items-start md:justify-between"
      >
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <Tooltip content="Go Back">
            <button
              onClick={onBack}
              className="group text-muted-foreground hover:text-foreground flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-transparent transition-all duration-300 ease-in-out hover:bg-(--surface-2) active:scale-95"
            >
              <ArrowLeft
                size={20}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </button>
          </Tooltip>
          <div className="flex min-w-0 flex-1 flex-col pt-1 sm:pt-0">
            <h2 className="text-foreground text-2xl leading-snug font-extrabold tracking-tight md:text-3xl">
              Executive Channel Strategy
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Comprehensive growth and content roadmap based on aggregate gap
              analysis.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end">
          <ExportReportBtn report={report} />
        </div>
      </motion.div>

      {report.executiveSummary && (
        <motion.div variants={itemVariants}>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border">
            <div
              className={`bg-primary absolute -top-6 -left-6 h-50 w-50 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60`}
            />

            <div className="relative z-10 p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <Target size={20} />
                </div>
                <h3 className="text-foreground text-lg font-bold tracking-tight">
                  Executive Summary
                </h3>
              </div>
              <p className="text-foreground text-[15px] leading-relaxed md:text-base md:leading-loose">
                {report.executiveSummary}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {STRATEGY_CONFIG.map(({ key, title, icon, color, bg }) => {
          const items = report[key as keyof GapAggregateData] as string[];
          if (!items || items.length === 0) return null;
          return (
            <ListSection
              key={key}
              title={title}
              items={items}
              icon={icon}
              color={color}
              bg={bg}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function ListSection({
  title,
  items,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
  color: string;
  bg: string;
}) {
  return (
    <div className="group bg-card border-border hover:border-primary/20 relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-md md:p-8">
      <div
        className={`absolute -top-6 -left-6 h-50 w-50 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60 ${bg}`}
      />

      <div className="relative z-10 mb-6 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${bg} ${color}`}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <h3 className="text-foreground text-lg font-bold tracking-tight md:text-xl">
          {title}
        </h3>
      </div>

      <ul className="relative z-10 flex flex-col gap-4">
        {items.map((item, idx) => (
          <li key={idx} className="group/item flex items-start gap-3.5">
            <div
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 group-hover/item:scale-150 ${color.replace("text-", "bg-")}`}
            />
            <span className="text-foreground text-[14px] leading-relaxed transition-colors duration-200">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
