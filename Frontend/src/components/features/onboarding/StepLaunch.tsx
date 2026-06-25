"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Rocket } from "lucide-react";
import { FaYoutube as Youtube } from "react-icons/fa";
import { niches, goals } from "@/constants/onboarding";
import { stepAnimation } from "@/lib/animations";

interface StepLaunchProps {
  selNiches: Set<string>;
  selGoals: Set<string>;
  channelId: string;
  loading: boolean;
  onBack: () => void;
  onFinish: () => void;
}

export function StepLaunch({
  selNiches,
  selGoals,
  channelId,
  loading,
  onBack,
  onFinish,
}: StepLaunchProps) {
  if (loading) {
    return (
      <motion.div
        {...stepAnimation}
        className="flex h-full min-h-75 flex-col items-center justify-center gap-6 py-12"
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute h-20 w-20 rounded-full bg-indigo-500/20 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <Loader2 size={36} className="text-indigo-500" strokeWidth={2.5} />
          </motion.div>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h3 className="text-foreground m-0 text-lg font-bold tracking-tight">
            Generating Workspace...
          </h3>
          <p className="m-0 text-sm font-medium text-(--text-dim)">
            Configuring AI models for your specific niches.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...stepAnimation} className="flex h-full flex-col">
      <div className="mb-8">
        <h2 className="text-foreground m-0 mb-3 text-2xl leading-[1.15] font-extrabold tracking-tight sm:text-3xl">
          You&apos;re all set!
        </h2>
        <p className="m-0 text-[13px] leading-relaxed font-medium text-(--text-dim)">
          Review your tailored setup below. Your AI co-pilot is ready to launch.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4">
        <div className="border-border/60 rounded-2xl border bg-(--surface-1)/40 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
              Selected Niches
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...selNiches].map((id) => {
              const n = niches.find((x) => x.id === id);
              return n ? (
                <span
                  key={id}
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-500 transition-colors hover:bg-indigo-500/20"
                >
                  <n.icon size={13} strokeWidth={2.5} /> {n.label}
                </span>
              ) : null;
            })}
            {selNiches.size === 0 && (
              <span className="text-xs text-(--text-dim) italic">
                None selected
              </span>
            )}
          </div>
        </div>

        <div className="border-border/60 rounded-2xl border bg-(--surface-1)/40 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
              Target Goals
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...selGoals].map((id) => {
              const g = goals.find((x) => x.id === id);
              return g ? (
                <span
                  key={id}
                  className="border-border text-foreground flex items-center gap-1.5 rounded-lg border bg-(--surface-2) px-3 py-1.5 text-xs font-medium transition-colors hover:bg-(--hover-overlay)"
                >
                  <g.icon size={13} className="text-(--text-dim)" /> {g.label}
                </span>
              ) : null;
            })}
            {selGoals.size === 0 && (
              <span className="text-xs text-(--text-dim) italic">
                None selected
              </span>
            )}
          </div>
        </div>

        <div className="border-border/60 rounded-2xl border bg-(--surface-1)/40 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
              Connected Channel
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {channelId ? (
              <span className="border-border text-foreground flex items-center gap-2 rounded-lg border bg-(--surface-2) px-3 py-1.5 text-xs font-medium transition-colors hover:bg-(--hover-overlay)">
                <Youtube size={14} className="text-red-500" />
                <span className="font-mono tracking-wide">{channelId}</span>
              </span>
            ) : (
              <span className="text-xs text-(--text-dim) italic">
                Skipped for now
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-3">
        <button
          onClick={onBack}
          className="border-border hover:text-foreground flex h-12 cursor-pointer items-center gap-2 rounded-xl border bg-transparent px-5 text-xs font-semibold text-(--text-dim) transition-all hover:bg-(--surface-2)"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <motion.button
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          onClick={onFinish}
          className="shadow-elevation-sm relative flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border-none text-xs font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          style={{
            background: "var(--gradient-aurora)",
            backgroundSize: "200% 200%",
            animation: "at-gradient-shift 4s ease infinite",
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity hover:opacity-100" />
          <motion.div
            variants={{
              hover: { rotate: 12, scale: 1.1 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Rocket size={16} fill="currentColor" fillOpacity={0.2} />
          </motion.div>
          Launch AutoTube
        </motion.button>
      </div>
    </motion.div>
  );
}
