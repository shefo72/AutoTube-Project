"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { TopVideo } from "@/types/analytics";
import { ArrowDownRight, ArrowUpRight, SearchX } from "lucide-react";

export function TopVideos({ videos }: { videos: TopVideo[] }) {
  const isEmpty = !videos || videos.length === 0;

  return (
    <motion.div {...fadeIn(0.48)} className="h-full">
      <div className="bg-card border-border h-full rounded-2xl border p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
        <div className="mb-5">
          <div className="text-foreground text-sm font-bold tracking-tight">
            Top Videos
          </div>
          <div className="mt-0.5 text-[11px] font-medium text-(--text-dim)">
            Based on views
          </div>
        </div>

        {isEmpty ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <div className="relative mb-3 flex h-12 w-12 items-center justify-center">
              <div className="border-primary/20 bg-primary/10 absolute inset-0 rounded-full border" />
              <SearchX
                size={20}
                className="text-primary relative z-10"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              No videos found
            </p>
            <p className="text-[11px] text-(--text-dim)">
              Generate content to populate this list.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {videos.map((v, i) => (
              <div
                key={v.title}
                className="group border-border -mx-2 flex items-center justify-between gap-3 border-b px-3 py-3.5 transition-all last:border-0 hover:rounded-xl hover:bg-(--hover-overlay)"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${i === 0 ? "bg-primary/10 text-primary" : "border-border/50 border bg-(--surface-1) text-(--text-dim)"}`}
                  >
                    <span className="font-mono text-[11px] font-bold">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground group-hover:text-primary truncate text-[12px] font-semibold transition-colors">
                      {v.title}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-foreground font-mono text-[12px] font-bold">
                    {v.views}
                  </span>
                  <div
                    className="flex items-center gap-1 rounded-full px-2 py-1"
                    style={{
                      background: v.up
                        ? "rgba(52,211,153,0.1)"
                        : "rgba(239,68,68,0.1)",
                    }}
                  >
                    {v.up ? (
                      <ArrowUpRight
                        size={12}
                        color="#34D399"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <ArrowDownRight
                        size={12}
                        color="#EF4444"
                        strokeWidth={2.5}
                      />
                    )}
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: v.up ? "#34D399" : "#EF4444" }}
                    >
                      {v.ctr}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
