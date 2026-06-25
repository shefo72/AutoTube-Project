"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Clapperboard, AlertCircle, X, Loader2 } from "lucide-react";
import { fadeIn } from "@/lib/animations";

interface VideoPreviewProps {
  isCompleted: boolean;
  isGenerating: boolean;
  isDownloading: boolean;
  error: string | null;
  clearError: () => void;
  activeStyle?: string;
  onDownload: () => void;
  videoUrl: string | null;
}

export function VideoPreview({
  isCompleted,
  isGenerating,
  isDownloading,
  error,
  clearError,
  activeStyle = "Cinematic",
  onDownload,
  videoUrl,
}: VideoPreviewProps) {
  return (
    <motion.div
      {...fadeIn(0.12)}
      className="flex h-full min-w-0 flex-1 flex-col gap-4"
    >
      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-border bg-card flex items-center gap-4 rounded-2xl border px-5 py-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <AlertCircle size={20} strokeWidth={2.5} />
              </div>

              <div className="flex flex-1 flex-col gap-0.5">
                <h4 className="text-foreground text-sm font-bold">
                  Rendering Failed
                </h4>
                <p className="text-muted-foreground text-sm font-medium">
                  {error}
                </p>
              </div>

              <button
                onClick={clearError}
                className="text-muted-foreground hover:text-foreground ml-2 shrink-0 cursor-pointer rounded-xl p-2 transition-all hover:bg-(--surface-2) active:scale-95"
                aria-label="Dismiss error"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border-border flex h-full flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b bg-(--surface-0)/50 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-foreground truncate text-sm font-bold">
                Project Render
              </span>
              {isCompleted && !isGenerating && (
                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  Ready
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-(--text-dim)">
              {isCompleted && !isGenerating
                ? "Video successfully generated"
                : "Awaiting Generation..."}
            </span>
          </div>

          <button
            onClick={onDownload}
            disabled={!isCompleted || isGenerating || isDownloading}
            className="border-border hover:text-foreground flex h-9 cursor-pointer items-center gap-2 rounded-lg border bg-transparent px-3.5 text-xs font-medium text-(--text-dim) transition-all hover:bg-(--hover-overlay) disabled:cursor-not-allowed disabled:text-(--text-dim) disabled:opacity-50 disabled:hover:bg-transparent"
          >
            {isDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Download Video
          </button>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center bg-(--surface-0) p-6">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="skeleton-gen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="border-border relative flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 rounded-2xl border bg-(--surface-1)/50 py-20 backdrop-blur-sm md:py-28"
              >
                <div className="border-border/60 relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-(--surface-2) shadow-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="border-primary/30 absolute inset-0 rounded-2xl border border-dashed"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-primary flex items-center justify-center"
                  >
                    <Clapperboard size={24} strokeWidth={1.5} />
                  </motion.div>
                </div>

                <div className="flex flex-col items-center gap-1.5 px-4 text-center">
                  <h3 className="text-foreground text-lg font-bold tracking-tight">
                    Generating Video
                  </h3>
                  <p className="text-muted-foreground text-[13px] font-medium">
                    Applying{" "}
                    <span className="text-foreground font-semibold">
                      {activeStyle}
                    </span>{" "}
                    visual styling
                  </p>
                </div>

                <div className="mt-2 flex w-56 flex-col gap-2 md:w-64">
                  <div className="flex justify-between px-0.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                    <span>Processing</span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ...
                    </motion.span>
                  </div>
                  <div className="border-border/50 h-1.5 w-full overflow-hidden rounded-full border bg-(--surface-2)">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 15, ease: "circOut" }}
                      className="bg-primary h-full rounded-full"
                    >
                      <div className="h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : isCompleted && videoUrl ? (
              <motion.div
                key="rendered-video-player"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-border relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl border bg-black shadow-2xl transition-all duration-300"
              >
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="h-full w-full object-contain focus:outline-none"
                />
              </motion.div>
            ) : isCompleted ? (
              <motion.div
                key="rendered-video-loading-url"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-border relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl border bg-black shadow-2xl transition-all duration-300"
              >
                <Loader2 size={32} className="animate-spin text-white/50" />
              </motion.div>
            ) : (
              /* 4. Empty State */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="border-border mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border bg-(--surface-2) shadow-inner">
                  <Clapperboard
                    size={32}
                    color="var(--text-dim)"
                    opacity={0.7}
                  />
                </div>
                <div className="text-foreground mb-2 text-base font-bold tracking-tight">
                  No Video Rendered
                </div>
                <div className="max-w-65 text-xs leading-relaxed text-(--text-dim)">
                  Configure your settings on the left and click{" "}
                  <strong className="text-foreground font-semibold">
                    Generate Video
                  </strong>{" "}
                  to start rendering.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
