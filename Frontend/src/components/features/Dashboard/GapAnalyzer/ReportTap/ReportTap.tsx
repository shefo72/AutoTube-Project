/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, Sparkles, ChevronRight } from "lucide-react";
import type { TabComponentProps, GapAggregateData } from "@/types/gap-analyzer";

import { ReportDetailView } from "./ReportDetailView";

export function ReportTap({
  historyReports,
  preSelectedReport,
  clearPreSelectedReport,
}: TabComponentProps) {
  const [selectedReport, setSelectedReport] = useState<GapAggregateData | null>(
    null
  );

  useEffect(() => {
    if (preSelectedReport) {
      setSelectedReport(preSelectedReport);
      clearPreSelectedReport?.();
    }
  }, [preSelectedReport, clearPreSelectedReport]);

  const displayReports = historyReports || [];

  return (
    <div className="relative min-h-150 w-full">
      <AnimatePresence mode="wait">
        {!selectedReport ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            <ReportsListView
              reports={displayReports}
              onSelect={setSelectedReport}
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
            <ReportDetailView
              report={selectedReport}
              onBack={() => setSelectedReport(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportsListView({
  reports,
  onSelect,
}: {
  reports: GapAggregateData[];
  onSelect: (r: GapAggregateData) => void;
}) {
  if (!reports || reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-border flex w-full flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center"
      >
        <div className="border-border mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-(--surface-2) shadow-inner">
          <Briefcase size={32} className="text-primary opacity-80" />
        </div>
        <h3 className="text-foreground text-lg font-bold">
          No Strategies Generated
        </h3>
        <p className="mt-2 max-w-sm text-sm text-(--text-dim)">
          Analyze your channel from the trending tab and generate a global
          report to see it here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {reports.map((report, index) => (
        <div
          key={index}
          onClick={() => onSelect(report)}
          className="group bg-card border-border hover:border-primary/40 relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="via-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                <Sparkles size={12} /> Strategic Report
              </span>
              <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
                <Calendar size={12} />
                Just now
              </span>
            </div>

            <h4 className="text-foreground group-hover:text-primary mb-3 text-[16px] leading-snug font-bold transition-colors">
              Channel Growth Strategy
            </h4>

            <p className="text-muted-foreground line-clamp-3 text-[13px] leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>

          <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground text-[11px] font-medium">
              4 Strategic Pillars
            </span>
            <div className="text-primary transition-transform group-hover:translate-x-1">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
