"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  PlaySquare,
  Eye,
  ExternalLink,
  TrendingUp,
  Target,
} from "lucide-react";

import HistoryLoadingState from "@/components/ui/HistoryModel/HistoryLoadingState";
import EmptyState from "@/components/ui/HistoryModel/HistoryEmptyState";
import { Modal } from "@/components/ui/Modal";

import {
  useLazyGetHighGrowthChannelsQuery,
  useLazyGetEasyWinsChannelsQuery,
} from "@/services/gapApi";
import type { YouTubeChannel } from "@/types/gap-analyzer";

function formatNumber(num: number): string {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

interface ChannelListModalProps {
  open: boolean;
  onClose: () => void;
  listType: "high-growth" | "easy-wins" | null;
}

export function ChannelListModal({
  open,
  onClose,
  listType,
}: ChannelListModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);

  const [fetchHighGrowth, { isFetching: loadingHigh, isError: errorHigh }] =
    useLazyGetHighGrowthChannelsQuery();
  const [fetchEasyWins, { isFetching: loadingEasy, isError: errorEasy }] =
    useLazyGetEasyWinsChannelsQuery();

  const isFetching = loadingHigh || loadingEasy;
  const isError = errorHigh || errorEasy;

  useEffect(() => {
    if (!open || !listType) return;

    const fetchChannels = async () => {
      try {
        if (listType === "high-growth") {
          const data = await fetchHighGrowth().unwrap();
          setChannels(data);
        } else if (listType === "easy-wins") {
          const data = await fetchEasyWins().unwrap();
          setChannels(data);
        }
      } catch (err) {
        console.error("Failed to fetch channels:", err);
      }
    };

    fetchChannels();
  }, [open, listType, fetchHighGrowth, fetchEasyWins]);

  const filteredChannels = useMemo(() => {
    if (!channels.length) return [];
    if (!searchQuery.trim()) return channels;

    const query = searchQuery.toLowerCase();
    return channels.filter(
      (channel) =>
        channel.title.toLowerCase().includes(query) ||
        channel.description?.toLowerCase().includes(query)
    );
  }, [channels, searchQuery]);

  const modalConfig = {
    "high-growth": {
      title: "High-Growth Channels",
      subtitle: "Channels experiencing rapid subscriber and view growth.",
      icon: TrendingUp,
    },
    "easy-wins": {
      title: "Easy Wins Channels",
      subtitle: "Channels with content gaps you can easily capitalize on.",
      icon: Target,
    },
  };

  const currentConfig = listType ? modalConfig[listType] : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={currentConfig?.title || "Channels List"}
      subtitle={currentConfig?.subtitle || "View and analyze channel data."}
      width="max-w-3xl"
    >
      <div className="flex flex-col gap-5">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="scrollbar-thin scrollbar-thumb-(--surface-4) scrollbar-track-transparent flex max-h-[60vh] min-h-75 flex-col gap-4 overflow-y-auto pr-2 pb-2">
          {isFetching ? (
            <HistoryLoadingState />
          ) : isError ? (
            <EmptyState
              title="Failed to load channels"
              description="An error occurred while fetching the data. Please try again."
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredChannels.length > 0 ? (
                filteredChannels.map((channel, idx) => (
                  <ChannelCard key={channel.id} channel={channel} index={idx} />
                ))
              ) : (
                <EmptyState
                  title="No channels found"
                  description={
                    searchQuery.trim()
                      ? "No channels match your search query."
                      : "The list is currently empty."
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

function ChannelCard({
  channel,
  index,
}: {
  channel: YouTubeChannel;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
      className="group border-border hover:border-primary/30 flex flex-col gap-4 rounded-2xl border bg-(--surface-1)/40 p-4 transition-all duration-300 hover:bg-(--surface-1)/80 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="text-foreground truncate text-sm font-bold"
              title={channel.title}
            >
              {channel.title}
            </h3>
            <a
              href={`https://youtube.com/channel/${channel.channelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary text-(--text-dim) transition-colors"
              title="Open Channel on YouTube"
            >
              <ExternalLink size={14} />
            </a>
          </div>
          <p className="mt-1 line-clamp-1 text-[12px] font-medium text-(--text-dim)">
            {channel.description || "No description provided."}
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          <div className="text-foreground flex items-center gap-1.5 rounded-lg bg-(--surface-2) px-2.5 py-1.5 text-[11px] font-semibold">
            <Users size={12} className="text-blue-500" />
            {formatNumber(channel.subscriberCount)}
          </div>

          <div className="text-foreground flex items-center gap-1.5 rounded-lg bg-(--surface-2) px-2.5 py-1.5 text-[11px] font-semibold">
            <Eye size={12} className="text-green-500" />
            {formatNumber(channel.totalViews)}
          </div>

          <div className="text-foreground flex items-center gap-1.5 rounded-lg bg-(--surface-2) px-2.5 py-1.5 text-[11px] font-semibold">
            <PlaySquare size={12} className="text-purple-500" />
            {formatNumber(channel.videoCount)}
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
        placeholder="Search channels by name or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border focus:border-primary text-foreground h-10 w-full rounded-xl border bg-(--surface-1)/50 pr-4 pl-9 text-sm transition-all outline-none placeholder:text-(--text-dim) focus:ring-2 focus:ring-(--ring)"
      />
    </div>
  );
}
