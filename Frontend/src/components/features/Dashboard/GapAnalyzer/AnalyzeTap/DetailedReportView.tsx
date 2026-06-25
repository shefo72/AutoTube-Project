"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Target,
  TrendingUp,
  Zap,
  Crosshair,
  Lightbulb,
  Search,
  Users,
  BadgeCheck,
  CircleDot,
} from "lucide-react";
import type { GapAnalysisReport } from "@/types/gap-analyzer";
import { FaYoutube as Youtube } from "react-icons/fa";
import type { LucideIcon } from "lucide-react";
import { ExportReportBtn } from "./ExportAnalysisBtn";
import { Tooltip } from "@/components/ui/tooltip";

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

const toPercentage = (value: number): string => {
  if (!value) return "0%";
  const percentage = value <= 1 ? value * 100 : value * 10;
  return `${Math.round(percentage)}%`;
};

export function DetailedReportView({
  report,
  onBack,
}: {
  report: GapAnalysisReport;
  onBack: () => void;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 pb-10"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="mb-4 flex w-full flex-col gap-5 md:flex-row md:items-start md:justify-between"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
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
            <h2
              className="text-foreground text-xl font-extrabold tracking-tight wrap-break-word md:text-2xl lg:text-[26px]"
              title={report.videoTitle}
            >
              {report.videoTitle}
            </h2>
            <div className="text-muted-foreground mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium md:text-[13px]">
              <span className="flex items-center gap-1.5">
                <Youtube size={16} className="shrink-0 text-red-500" />
                <span className="font-mono">{report.videoId}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="shrink-0" />
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleString()
                  : "Just now"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-2 sm:gap-3">
          <ExportReportBtn report={report} />
        </div>
      </motion.div>

      {/* Stats Cards (Horizontal Row) */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <StatCard
          title="Opportunity Score"
          value={toPercentage(report.opportunityScore)}
          icon={Zap}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <StatCard
          title="Competition Difficulty"
          value={toPercentage(report.competitionDifficulty)}
          icon={Target}
          color="text-rose-500"
          bg="bg-rose-500/10"
        />
        <StatCard
          title="Trend Growth"
          value={toPercentage(report.trendGrowth)}
          icon={TrendingUp}
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
      </motion.div>

      {/* Core Strengths */}
      {report.strengths && report.strengths.length > 0 && (
        <motion.div variants={itemVariants}>
          <ListSection
            title="Core Strengths"
            items={report.strengths}
            icon={BadgeCheck}
            color="text-emerald-500"
            bg="bg-emerald-500/10"
            bulletStyle="dot"
          />
        </motion.div>
      )}

      {/* Critical Weaknesses */}
      {report.weaknesses && report.weaknesses.length > 0 && (
        <motion.div variants={itemVariants}>
          <ListSection
            title="Critical Weaknesses"
            items={report.weaknesses}
            icon={AlertTriangle}
            color="text-rose-500"
            bg="bg-rose-500/10"
            bulletStyle="dot"
          />
        </motion.div>
      )}

      {/* Content Gaps */}
      {report.contentGaps && report.contentGaps.length > 0 && (
        <motion.div variants={itemVariants}>
          <ListSection
            title="Content Gaps"
            items={report.contentGaps}
            icon={Target}
            color="text-purple-500"
            bg="bg-purple-500/10"
            bulletStyle="dot"
          />
        </motion.div>
      )}

      {/* Audience Pain Points */}
      {report.audiencePainPoints && report.audiencePainPoints.length > 0 && (
        <motion.div variants={itemVariants}>
          <ListSection
            title="Audience Pain Points"
            items={report.audiencePainPoints}
            icon={Users}
            color="text-orange-500"
            bg="bg-orange-500/10"
            bulletStyle="none"
          />
        </motion.div>
      )}

      {/* Missed Opportunities */}
      {report.missedOpportunities && report.missedOpportunities.length > 0 && (
        <motion.div variants={itemVariants}>
          <ListSection
            title="Missed Opportunities"
            items={report.missedOpportunities}
            icon={Lightbulb}
            color="text-blue-500"
            bg="bg-blue-500/10"
            bulletStyle="none"
          />
        </motion.div>
      )}

      {/* Actionable Plan Section */}
      <motion.div
        variants={itemVariants}
        className="bg-card border-border overflow-hidden rounded-2xl border"
      >
        <div className="p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="text-purple-500">
              <Zap size={24} fill="currentColor" />
            </div>
            <h3 className="text-foreground text-xl font-bold tracking-tight">
              Actionable Plan
            </h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {report.seoRecommendations &&
              report.seoRecommendations.length > 0 && (
                <RecommendationBlock
                  title="SEO Enhancements"
                  items={report.seoRecommendations}
                  icon={Search}
                />
              )}
            {report.ctrOptimizationSuggestions &&
              report.ctrOptimizationSuggestions.length > 0 && (
                <RecommendationBlock
                  title="CTR Optimization"
                  items={report.ctrOptimizationSuggestions}
                  icon={Crosshair}
                />
              )}
            {report.hookImprovements && report.hookImprovements.length > 0 && (
              <RecommendationBlock
                title="Hook Improvements"
                items={report.hookImprovements}
                icon={Target}
              />
            )}
            {report.retentionImprovements &&
              report.retentionImprovements.length > 0 && (
                <RecommendationBlock
                  title="Retention Strategies"
                  items={report.retentionImprovements}
                  icon={TrendingUp}
                />
              )}
          </div>
        </div>
      </motion.div>

      {/* Viral Potential Analysis */}
      {report.viralPotentialAnalysis && (
        <motion.div
          variants={itemVariants}
          className="group bg-card border-border relative overflow-hidden rounded-2xl border transition-all duration-300 hover:border-orange-500/30 hover:shadow-sm"
        >
          <div className="absolute -top-6 -left-6 h-50 w-50 rounded-full bg-orange-500/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40" />

          <div className="relative z-10 p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-transform duration-300 group-hover:scale-110">
                <Lightbulb size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-foreground text-lg font-bold tracking-tight">
                Viral Potential Analysis
              </h3>
            </div>
            <p className="text-muted-foreground group-hover:text-foreground text-[15px] leading-relaxed transition-colors duration-300">
              {report.viralPotentialAnalysis}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}) {
  return (
    <div className="group bg-card border-border relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-muted-foreground text-[10px] leading-snug font-bold tracking-wide uppercase sm:text-xs">
          {title}
        </span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${bg} ${color}`}
        >
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <span className="text-foreground font-mono text-2xl font-black tracking-tight sm:text-3xl">
          {value}
        </span>
      </div>

      <div
        className={`absolute -top-6 -right-6 h-30 w-30 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70 ${bg}`}
      />
    </div>
  );
}

function ListSection({
  title,
  items,
  icon: Icon,
  color,
  bg,
  bulletStyle = "dot",
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
  color: string;
  bg: string;
  bulletStyle?: "dot" | "none";
}) {
  return (
    <div className="group bg-card border-border hover:border-primary/20 relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-sm sm:p-6">
      <div
        className={`absolute -top-6 -left-6 h-50 w-50 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60 ${bg}`}
      />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${bg} ${color}`}
          >
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-foreground text-base font-bold tracking-tight sm:text-lg">
            {title}
          </h3>
        </div>

        <ul className="flex flex-col gap-3.5">
          {items?.map((item: string, idx: number) => (
            <li key={idx} className="group/item flex items-start gap-3">
              {bulletStyle === "dot" && (
                <div
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 ${color.replace(
                    "text-",
                    "bg-"
                  )}`}
                />
              )}
              <span className="text-foreground text-sm leading-relaxed transition-colors duration-200">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecommendationBlock({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-(--surface-1) p-6 transition-colors duration-300 hover:bg-(--surface-2)/50">
      <div className="absolute -top-6 -left-6 h-50 w-50 rounded-full bg-purple-500/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40" />

      <div className="relative z-10">
        <h4 className="text-foreground mb-6 flex items-center gap-2.5 text-base font-bold">
          <Icon
            size={18}
            className="text-purple-500 transition-transform duration-300 group-hover:scale-110"
          />
          {title}
        </h4>
        <ul className="flex flex-col gap-4">
          {items?.map((item: string, idx: number) => (
            <li
              key={idx}
              className="text-muted-foreground group-hover:text-foreground flex items-start gap-3 text-[14px] leading-relaxed transition-colors duration-200"
            >
              <div className="mt-0.5 shrink-0 text-purple-500">
                <CircleDot size={16} />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
