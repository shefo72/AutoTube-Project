"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type {
  GapAnalyzerTabId,
  GapAnalysisReport,
  TabComponentProps,
  TrendingSearchState,
  GapAggregateData,
  ChannelSearchState,
} from "@/types/gap-analyzer";
import { useGetDiscoveryStatsQuery } from "@/services/gapApi";
import { useUsageCredits } from "@/services/billingApi";

import NavigationBar from "./NavigationBar";
import GapAnalyzerLoading from "@/app/dashboard/gap-analyzer/loading";
import { InsufficientCreditsModal } from "@/components/ui/InsufficientCreditsModal";
import { Stats } from "./Stats";

import { AnalyzeChannel } from "./ChannelVideosTap/ChannelVideos";
import { ChannelListModal } from "./ChannelListModal";
import { AnalyzeTopic } from "./AnalyzeTap/AnalyzeTopicTap";
import { TrendingTab } from "./TrendingTap/TrendingTap";
import { ReportTap } from "./ReportTap/ReportTap";
import { HistoryTab } from "./HistoryTap/HistoryTap";

type TabComponent = React.ComponentType<TabComponentProps>;

const TAB_COMPONENTS: Record<GapAnalyzerTabId, TabComponent> = {
  trending: TrendingTab,
  analyze_topic: AnalyzeTopic,
  analyze_channel: AnalyzeChannel,
  reports: ReportTap,
  history: HistoryTab,
};

export function GapAnalyzerPage() {
  const [activeTab, setActiveTab] = useState<GapAnalyzerTabId>("trending");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());
  const { isLoading: isInitialLoading } = useGetDiscoveryStatsQuery();

  // ─── Credit Guard State ───
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [requiredCost, setRequiredCost] = useState(0);

  const { creditsGranted, totalUsed } = useUsageCredits();
  const currentBalance = creditsGranted - totalUsed;

  const handleInsufficientCredits = useCallback((cost: number) => {
    setRequiredCost(cost);
    setIsCreditModalOpen(true);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalListType, setModalListType] = useState<
    "high-growth" | "easy-wins" | null
  >(null);

  const [trendingState, setTrendingState] = useState<TrendingSearchState>({
    keyword: "",
    selectedCountry: null,
    selectedCategory: null,
    hasSearched: false,
    results: [],
    selectedTopic: null,
  });

  const [channelState, setChannelState] = useState<ChannelSearchState>({
    channelName: "",
    hasSearched: false,
    results: [],
    selectedTopic: null,
  });

  const [historyAnalyses, setHistoryAnalyses] = useState<GapAnalysisReport[]>(
    []
  );
  const [historyReports, setHistoryReports] = useState<GapAggregateData[]>([]);
  const [preSelectedTopic, setPreSelectedTopic] =
    useState<GapAnalysisReport | null>(null);
  const [preSelectedReport, setPreSelectedReport] =
    useState<GapAggregateData | null>(null);

  const toggleSave = useCallback((id: number) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAnalysisComplete = useCallback(
    (analysisData: GapAnalysisReport) => {
      setHistoryAnalyses((prev) => {
        if (prev.some((a) => a.id === analysisData.id)) return prev;
        return [analysisData, ...prev];
      });
      setPreSelectedTopic(analysisData);
      setActiveTab("analyze_topic");
    },
    []
  );

  const handleReportGenerated = useCallback((reportData: GapAggregateData) => {
    setHistoryReports((prev) => {
      return [reportData, ...prev];
    });
    setPreSelectedReport(reportData);
    setActiveTab("reports");
  }, []);

  const clearPreSelectedTopic = useCallback(
    () => setPreSelectedTopic(null),
    []
  );
  const clearPreSelectedReport = useCallback(
    () => setPreSelectedReport(null),
    []
  );

  const openModal = useCallback((type: "high-growth" | "easy-wins") => {
    setModalListType(type);
    setIsModalOpen(true);
  }, []);

  if (isInitialLoading) {
    return <GapAnalyzerLoading />;
  }

  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-5 md:p-8">
          <Stats onOpenModal={openModal} />
          <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <ActiveTabComponent
                savedItems={savedItems}
                onToggleSave={toggleSave}
                historyAnalyses={historyAnalyses}
                preSelectedTopic={preSelectedTopic}
                clearPreSelectedTopic={clearPreSelectedTopic}
                onAnalysisComplete={handleAnalysisComplete}
                historyReports={historyReports}
                preSelectedReport={preSelectedReport}
                clearPreSelectedReport={clearPreSelectedReport}
                onReportGenerated={handleReportGenerated}
                trendingState={trendingState}
                setTrendingState={setTrendingState}
                channelState={channelState}
                setChannelState={setChannelState}
                currentBalance={currentBalance}
                onInsufficientCredits={handleInsufficientCredits}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ChannelListModal
        open={isModalOpen}
        listType={modalListType}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ── Credit Guard Modal ── */}
      <InsufficientCreditsModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        requiredCredits={requiredCost}
        currentBalance={currentBalance}
      />
    </>
  );
}
