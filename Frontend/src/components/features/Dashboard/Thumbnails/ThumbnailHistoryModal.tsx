"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Upload,
  Sparkles,
  Search,
  DownloadCloud,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";

import HistoryLoadingState from "@/components/ui/HistoryModel/HistoryLoadingState";
import EmptyState from "@/components/ui/HistoryModel/HistoryEmptyState";
import { Modal } from "@/components/ui/Modal";
import { useThumbnailHistory, useThumbnailActions } from "@/hooks/useThumbnail";
import type { ThumbnailHistoryItem } from "@/types/thumbnail";
import { toast } from "sonner";

interface ThumbnailHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ThumbnailHistoryModal({
  open,
  onClose,
}: ThumbnailHistoryModalProps) {
  const { historyData, isFetchingHistory } = useThumbnailHistory();
  const { download } = useThumbnailActions();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPrompts, setExpandedPrompts] = useState<Set<number>>(
    new Set()
  );

  const filteredHistory = useMemo(() => {
    if (!historyData) return [];
    if (!searchQuery.trim()) return historyData;

    const query = searchQuery.toLowerCase();
    return historyData.filter((item) => {
      const textToSearch = item.prompt
        ? item.prompt.toLowerCase()
        : item.type.toLowerCase();
      return textToSearch.includes(query);
    });
  }, [historyData, searchQuery]);

  const togglePrompt = useCallback((id: number) => {
    setExpandedPrompts((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const handleDownload = useCallback(
    async (id: number, type: string) => {
      try {
        await download(id, type);
      } catch (err) {
        console.error("Download failed:", err);
        toast.error("Failed to download thumbnail. Please try again.");
      }
    },
    [download]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thumbnail History"
      subtitle="View, manage, and download your generated thumbnails."
      width="max-w-3xl"
    >
      <div className="flex flex-col gap-5">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="scrollbar-thin scrollbar-thumb-(--surface-4) scrollbar-track-transparent flex max-h-[60vh] min-h-75 flex-col gap-4 overflow-y-auto pr-2 pb-2">
          {isFetchingHistory ? (
            <HistoryLoadingState />
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, idx) => (
                  <HistoryCard
                    key={`${item.type}-${item.id}-${idx}`}
                    item={item}
                    index={idx}
                    isExpanded={expandedPrompts.has(item.id)}
                    onTogglePrompt={togglePrompt}
                    onDownload={handleDownload}
                  />
                ))
              ) : (
                <EmptyState
                  title="No thumbnails found"
                  description={
                    searchQuery.trim()
                      ? "No results match your search."
                      : "You haven't generated any thumbnails yet."
                  }
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Modal>
  );
}

function HistoryCard({
  item,
  index,
  isExpanded,
  onTogglePrompt,
  onDownload,
}: {
  item: ThumbnailHistoryItem;
  index: number;
  isExpanded: boolean;
  onTogglePrompt: (id: number) => void;
  onDownload: (id: number, type: string) => void;
}) {
  const promptText = item.prompt || "No prompt provided";
  const shouldShowExpandBtn = promptText.length > 120;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
      className="group border-border hover:border-primary/30 flex flex-col gap-4 rounded-2xl border bg-(--surface-1)/40 p-4 transition-all duration-300 hover:bg-(--surface-1)/80 sm:flex-row sm:items-start"
    >
      <div className="bg-primary/10 border-primary/20 relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-inner">
        <ImageIcon size={20} className="text-primary" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="mb-3">
          <motion.p
            layout="position"
            className={`text-foreground text-[13px] leading-relaxed font-medium transition-all ${
              !isExpanded ? "line-clamp-2" : ""
            }`}
            title={!isExpanded ? promptText : undefined}
          >
            {promptText}
          </motion.p>

          {shouldShowExpandBtn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePrompt(item.id);
              }}
              className="text-primary mt-1.5 flex cursor-pointer items-center gap-1 text-[11px] font-bold hover:underline"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp size={12} />
                </>
              ) : (
                <>
                  Read more <ChevronDown size={12} />
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-(--text-dim)">
            <div className="flex items-center gap-1.5 rounded-md bg-(--surface-2) px-2 py-1 capitalize">
              {item.type === "Generated" ? (
                <Sparkles size={12} className="text-purple-500" />
              ) : (
                <Upload size={12} className="text-blue-500" />
              )}
              {item.type}
            </div>

            <div className="flex items-center gap-1.5 rounded-md bg-(--surface-2) px-2 py-1">
              <Calendar size={12} className="text-orange-500" />
              {formatDate(item.createdAt)}
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center">
            <button
              onClick={() => onDownload(item.id, item.type)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3.5 text-[11px] font-bold shadow-sm transition-all"
            >
              <DownloadCloud size={12} />
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <Search
        className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-dim)"
        size={16}
      />
      <input
        type="text"
        placeholder="Search by prompt or type..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border focus:border-primary text-foreground h-10 w-full rounded-xl border bg-(--surface-1)/50 pr-4 pl-9 text-sm transition-all outline-none placeholder:text-(--text-dim) focus:ring-2 focus:ring-(--ring)"
      />
    </div>
  );
}
