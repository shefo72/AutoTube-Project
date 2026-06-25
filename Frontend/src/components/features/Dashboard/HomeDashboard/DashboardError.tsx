"use client";

import { motion } from "framer-motion";
import { RefreshCcw, Terminal, Activity, Unplug } from "lucide-react";

interface DashboardErrorProps {
  error?: string;
  reset: () => void;
}

export function DashboardError({
  error = "Failed to communicate with the central server. Connection timed out.",
  reset,
}: DashboardErrorProps) {
  return (
    <div className="relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden p-5 md:p-10">
      <div className="via-background to-background pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-red-900/10" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center"
      >
        <div className="mb-6 flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
            System Disconnected
          </span>
        </div>

        <div className="mb-6 flex justify-center text-(--border-active)">
          <Unplug size={48} strokeWidth={1} />
        </div>

        <h2
          className="font-heading text-foreground mb-4 font-extrabold tracking-tight"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: "1.05" }}
        >
          Data feed{" "}
          <span className="bg-linear-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            interrupted.
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-lg text-[16px] leading-relaxed md:text-[18px]">
          We couldn&apos;t retrieve your dashboard metrics. This is usually a
          temporary hiccup in the data pipeline.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="border-border mt-10 w-full rounded-2xl border bg-(--surface-1)/40 p-5 text-left font-mono shadow-inner backdrop-blur-xl md:p-6"
        >
          <div className="border-border/50 mb-3 flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-(--text-dim)">
              <Terminal size={14} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Diagnostic Log
              </span>
            </div>
            <Activity size={14} className="text-red-500/50" />
          </div>

          <div className="flex flex-col gap-2 text-[13px] sm:text-[14px]">
            <div className="text-red-400/90">
              <span className="mr-2 text-red-500/50">[ERR_FETCH]</span>
              {error}
            </div>
            <div className="flex items-center gap-2 text-(--text-dim)">
              <span className="text-primary/50 mr-2">[SYS_WAIT]</span>
              Awaiting manual override
              <span className="text-foreground animate-pulse font-bold">_</span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={reset}
          className="group bg-foreground text-background relative mt-10 inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3.5 text-sm font-bold transition-transform hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 flex h-full w-full transform-[skew(-12deg)_translateX(-100%)] justify-center group-hover:transform-[skew(-12deg)_translateX(100%)] group-hover:duration-1000">
            <div className="relative h-full w-8 bg-white/20" />
          </div>
          <RefreshCcw
            size={16}
            className="transition-transform duration-500 group-hover:-rotate-180"
          />
          Restart Engine
        </button>
      </motion.div>
    </div>
  );
}
