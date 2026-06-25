import React from "react";
import { motion } from "framer-motion";
import { Target, Flame, FileText, MonitorPlay, History } from "lucide-react";
import type { GapAnalyzerTab, GapAnalyzerTabId } from "@/types/gap-analyzer";
import { Tooltip } from "@/components/ui/tooltip";

export const TABS: GapAnalyzerTab[] = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "analyze_channel", label: "Channel Videos", icon: MonitorPlay },
  { id: "analyze_topic", label: "Analyze Topic", icon: Target },
  { id: "reports", label: "Report", icon: FileText },
  { id: "history", label: "History", icon: History },
];

type NavigationBarProps = {
  activeTab: GapAnalyzerTabId;
  setActiveTab: React.Dispatch<React.SetStateAction<GapAnalyzerTabId>>;
};

export default function NavigationBar({
  activeTab,
  setActiveTab,
}: NavigationBarProps) {
  return (
    <div className="border-border/60 mb-6 border-b">
      <div className="scrollbar-hide w-full overflow-x-auto">
        <div className="flex w-full min-w-max items-center justify-between gap-6 px-5 sm:justify-around sm:gap-10 md:px-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <Tooltip key={tab.id} content={tab.label}>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex cursor-pointer items-center gap-2.5 pt-2 pb-4 text-sm font-semibold transition-colors outline-none ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={
                      isActive
                        ? ""
                        : "transition-transform duration-300 group-hover:scale-110"
                    }
                  />

                  <span className="hidden sm:inline">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="minimal-active-tab"
                      className="bg-primary absolute right-0 -bottom-px left-0 h-0.5 rounded-t-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
