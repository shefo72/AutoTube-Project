/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Calendar, Sparkles, Loader2, AlertCircle } from "lucide-react";
import type {
  GapAnalysisReport,
  TabComponentProps,
} from "@/types/gap-analyzer";
import { useLazyGetGapAnalysisReportQuery } from "@/services/gapApi";

import { DetailedReportView } from "./DetailedReportView";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/tooltip";

const toPercentage = (value: number): string => {
  if (!value) return "0%";
  const percentage = value <= 1 ? value * 100 : value * 10;
  return `${Math.round(percentage)}%`;
};

export function AnalyzeTopic({
  historyAnalyses,
  preSelectedTopic,
  clearPreSelectedTopic,
  onReportGenerated,
}: TabComponentProps) {
  const [selectedTopic, setSelectedTopic] = useState<GapAnalysisReport | null>(
    preSelectedTopic || null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [fetchReport] = useLazyGetGapAnalysisReportQuery();

  useEffect(() => {
    if (preSelectedTopic) {
      setSelectedTopic(preSelectedTopic);
      clearPreSelectedTopic();
    }
  }, [preSelectedTopic, clearPreSelectedTopic]);

  const handleGenerateGlobalReport = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const fullReportData = await fetchReport().unwrap();
      onReportGenerated(fullReportData);
    } catch (error) {
      console.error("Error generating aggregate report:", error);
      setGenerateError("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const displayAnalyses = historyAnalyses || [];

  return (
    <div className="relative min-h-150 w-full">
      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            <HistoryListView
              reports={displayAnalyses}
              onSelect={(r) => {
                setGenerateError(null);
                setSelectedTopic(r);
              }}
              onGenerateGlobal={handleGenerateGlobalReport}
              isGenerating={isGenerating}
              generateError={generateError}
            />
          </motion.div>
        ) : (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <DetailedReportView
              report={selectedTopic}
              onBack={() => {
                setSelectedTopic(null);
                setGenerateError(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HistoryListView({
  reports,
  onSelect,
  onGenerateGlobal,
  isGenerating,
  generateError,
}: {
  reports: GapAnalysisReport[];
  onSelect: (report: GapAnalysisReport) => void;
  onGenerateGlobal: () => void;
  isGenerating: boolean;
  generateError: string | null;
}) {
  if (!reports || reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-border flex w-full flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center"
      >
        <div className="border-border mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-(--surface-2) shadow-inner">
          <Target size={32} className="text-primary opacity-80" />
        </div>
        <h3 className="text-foreground text-lg font-bold">No Analyses Yet</h3>
        <p className="mt-2 max-w-sm text-sm text-(--text-dim)">
          Analyze a topic from the trending tab to see it here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-foreground text-base font-bold tracking-tight sm:text-lg">
            Recent Analyses
          </h3>
          <p className="text-muted-foreground text-xs">
            Select or view your previously analyzed video topics.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Tooltip
            content={
              reports.length < 2
                ? "Analyze at least 2 videos to unlock."
                : "Generate your comprehensive strategy report."
            }
          >
            <Button
              size="md"
              onClick={onGenerateGlobal}
              disabled={isGenerating || reports.length === 1}
              variant="primary"
            >
              {isGenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} className="animate-pulse" />
              )}
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </Tooltip>

          {generateError && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-rose-500">
              <AlertCircle size={12} />
              {generateError}
            </span>
          )}
        </div>
      </div>

      {/* ── Grid Mapping ── */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id || report.videoId}
            onClick={() => onSelect(report)}
            className="group bg-card border-border hover:border-primary/40 relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="via-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="bg-primary/10 text-primary rounded-md px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                  Analyzed
                </span>
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
                  <Calendar size={12} />
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : "Just now"}
                </span>
              </div>

              <h4 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-[15px] leading-snug font-bold transition-colors">
                {report.videoTitle}
              </h4>
            </div>

            <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-wider uppercase">
                  Opportunity
                </span>
                <span className="font-mono text-sm font-black text-emerald-500">
                  {toPercentage(report.opportunityScore)}
                </span>
              </div>
              <div className="bg-border h-8 w-px" />
              <div className="flex flex-col text-right">
                <span className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-wider uppercase">
                  Difficulty
                </span>
                <span className="font-mono text-sm font-black text-rose-500">
                  {toPercentage(report.competitionDifficulty)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
