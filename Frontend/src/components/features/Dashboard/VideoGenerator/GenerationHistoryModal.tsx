"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Palette,
  Search,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  MessageSquare,
  Maximize,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetVideoHistoryQuery,
  useDownloadVideoMutation,
} from "@/services/videoApi";

import { Modal } from "@/components/ui/Modal";
import HistoryLoadingState from "@/components/ui/HistoryModel/HistoryLoadingState";
import EmptyState from "@/components/ui/HistoryModel/HistoryEmptyState";

interface GenerationHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function GenerationHistoryModal({
  open,
  onClose,
}: GenerationHistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPrompts, setExpandedPrompts] = useState<Set<number>>(
    new Set()
  );

  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

  const { data: historyData, isLoading } = useGetVideoHistoryQuery(undefined, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });

  const [downloadVideo] = useDownloadVideoMutation();

  const handleDownload = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const toastId = `download-${id}`;

    setDownloadingIds((prev) => new Set(prev).add(id));

    try {
      toast.loading("Preparing download link...", { id: toastId });
      const response = await downloadVideo(id).unwrap();

      if (response.downloadUrl) {
        window.open(response.downloadUrl, "_blank");
        toast.success("Download started!", { id: toastId });
      } else {
        toast.error("Download URL is invalid.", { id: toastId });
      }
    } catch {
      toast.error("Failed to fetch download link.", { id: toastId });
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const togglePrompt = (id: number) => {
    setExpandedPrompts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const safeHistoryData = Array.isArray(historyData) ? historyData : [];

  const filteredHistory = safeHistoryData.filter((item) => {
    const isCompleted = item.generationStatus?.toLowerCase() === "completed";
    const matchesSearch =
      item.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    return isCompleted && matchesSearch;
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generation History"
      subtitle="View and download your successfully generated videos."
      width="max-w-3xl"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-dim)"
              size={16}
            />
            <input
              type="text"
              placeholder="Search through your prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border focus:border-primary text-foreground h-10 w-full rounded-xl border bg-(--surface-1)/50 pr-4 pl-9 text-sm transition-all outline-none placeholder:text-(--text-dim) focus:ring-2 focus:ring-(--ring)"
            />
          </div>
        </div>

        <div className="scrollbar-thin scrollbar-thumb-(--surface-4) scrollbar-track-transparent flex max-h-[60vh] min-h-75 flex-col gap-4 overflow-y-auto pr-2 pb-2">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Loading State
              <HistoryLoadingState />
            ) : filteredHistory.length > 0 ? (
              filteredHistory.map((item, idx) => {
                const isExpanded = expandedPrompts.has(item.id);
                const promptText = item.prompt || "";
                const shouldShowExpandBtn = promptText.length > 120;
                const isThisRowDownloading = downloadingIds.has(item.id);

                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(idx * 0.05, 0.5),
                    }}
                    className="group border-border hover:border-primary/30 flex flex-col gap-4 rounded-2xl border bg-(--surface-1)/40 p-4 transition-all duration-300 hover:bg-(--surface-1)/80 sm:flex-row sm:items-start"
                  >
                    <div className="bg-primary/10 border-primary/20 relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-inner">
                      <Clapperboard size={20} className="text-primary" />
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
                              togglePrompt(item.id);
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
                          <div className="flex items-center gap-1.5 rounded-md bg-(--surface-2) px-2 py-1">
                            <Clock size={12} className="text-blue-500" />
                            {item.durationSeconds} Sec
                          </div>

                          <div className="flex items-center gap-1.5 rounded-md bg-(--surface-2) px-2 py-1">
                            <MessageSquare
                              size={12}
                              className="text-pink-500"
                            />
                            {item.voiceTone || "Neutral"}
                          </div>

                          <div className="flex items-center gap-1.5 rounded-md bg-(--surface-2) px-2 py-1">
                            <Palette size={12} className="text-purple-500" />
                            {item.videoStyle}
                          </div>

                          <div className="flex items-center gap-1.5 rounded-md bg-(--surface-2) px-2 py-1">
                            <Maximize size={12} className="text-emerald-500" />
                            {item.aspectRatio || "16:9"}
                          </div>

                          <div className="flex items-center gap-1.5 rounded-md bg-(--surface-2) px-2 py-1">
                            <Calendar size={12} className="text-orange-500" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="ml-auto flex shrink-0 items-center">
                          <button
                            onClick={(e) => handleDownload(item.id, e)}
                            disabled={isThisRowDownloading}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3.5 text-[11px] font-bold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isThisRowDownloading ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Download size={12} />
                            )}
                            Download Video
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <EmptyState
                title="No ready videos yet"
                description={
                  searchQuery
                    ? "No completed videos match your search prompt."
                    : "Your successfully generated videos will appear here once they are ready to download."
                }
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}
