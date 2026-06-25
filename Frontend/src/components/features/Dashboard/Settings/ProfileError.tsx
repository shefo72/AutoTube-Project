"use client";

import { motion } from "framer-motion";
import { RefreshCcw, AlertCircle } from "lucide-react";

interface ProfileErrorProps {
  error?: string;
  reset: () => void;
}

export function ProfileError({
  error = "Connection synchronization timed out.",
  reset,
}: ProfileErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background relative flex min-h-[calc(70dvh)] flex-1 flex-col items-center justify-center overflow-hidden p-6 text-center"
    >
      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/5 px-3 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-70"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
            Sync Error
          </span>
        </div>

        <h1 className="font-heading text-foreground mb-4 text-4xl leading-tight font-black tracking-tight md:text-5xl">
          Profile Data <span className="text-red-600">Offline</span>
        </h1>

        <p className="mb-12 max-w-md text-[15px] leading-relaxed text-(--text-dim)">
          We couldn&apos;t establish a secure connection to retrieve your
          profile details. This is usually a temporary glitch.
        </p>

        <button
          onClick={reset}
          className="group bg-foreground text-background hover:bg-foreground/90 flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-xl px-10 text-[13px] font-bold shadow-lg transition-all hover:scale-[1.03] active:scale-[0.97]"
        >
          <RefreshCcw
            size={16}
            className="transition-transform duration-500 group-hover:rotate-180"
          />
          Try to Re-Sync
        </button>

        {error && (
          <div className="border-border mt-16 flex items-center gap-2.5 border-t pt-6 text-left">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <div className="max-w-sm font-mono text-[11px] leading-relaxed wrap-break-word text-(--text-dim)">
              [Diagnostic: {error}]
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
