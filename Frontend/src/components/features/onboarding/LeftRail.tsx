"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo/LogoMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { stepLabels } from "@/constants/onboarding";

interface LeftRailProps {
  step: number;
  onNavigateHome: () => void;
}

export function LeftRail({ step, onNavigateHome }: LeftRailProps) {
  return (
    <div className="border-border relative z-10 flex w-full shrink-0 flex-col border-b bg-(--surface-0) px-6 py-6 md:w-80 md:border-r md:border-b-0 md:px-10 md:py-10">
      <div className="mb-8 flex items-center justify-between gap-2.5 md:mb-14 md:justify-start">
        <div
          className="group flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
          onClick={onNavigateHome}
        >
          <LogoMark size={28} />
          <span className="text-foreground text-sm font-extrabold tracking-tight">
            AutoTube
          </span>
        </div>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>

      <div className="mb-12 hidden md:block">
        <div className="mb-3 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1">
          <span className="text-[9px] font-bold tracking-[0.15em] text-indigo-500 uppercase">
            Setup Process
          </span>
        </div>
        <h2 className="font-heading text-foreground m-0 text-3xl leading-[1.15] font-extrabold tracking-tight">
          Let&apos;s get <br />
          <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            you set up.
          </span>
        </h2>
      </div>

      <div className="flex flex-row justify-between gap-0 md:flex-col md:justify-start">
        {stepLabels.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          const isLast = i === stepLabels.length - 1;

          return (
            <div
              key={s.n}
              className="group flex flex-1 flex-col items-center gap-2 md:flex-none md:flex-row md:items-stretch md:gap-4"
            >
              <div className="flex w-full flex-row items-center md:w-auto md:flex-col">
                <div
                  className={`h-0.5 flex-1 md:hidden ${
                    i === 0
                      ? "bg-transparent"
                      : done || active
                        ? "bg-foreground"
                        : "bg-border"
                  } transition-colors duration-500`}
                />

                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: done
                      ? "var(--foreground)"
                      : active
                        ? "rgba(99,102,241,0.1)"
                        : "var(--surface-0)",
                    borderColor: done
                      ? "var(--foreground)"
                      : active
                        ? "rgba(99,102,241,0.5)"
                        : "var(--border)",
                    boxShadow: active
                      ? "0 0 0 4px rgba(99,102,241,0.1)"
                      : "0 0 0 0px rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mx-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 md:mx-0"
                >
                  {done ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Check
                        size={12}
                        strokeWidth={3}
                        className="text-background"
                      />
                    </motion.div>
                  ) : (
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        active ? "text-indigo-500" : "text-(--text-dim)"
                      }`}
                    >
                      {s.n}
                    </span>
                  )}
                </motion.div>

                <div
                  className={`h-0.5 flex-1 md:hidden ${
                    isLast
                      ? "bg-transparent"
                      : step > s.n
                        ? "bg-foreground"
                        : "bg-border"
                  } transition-colors duration-500`}
                />

                {!isLast && (
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: done
                        ? "var(--foreground)"
                        : "var(--border)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="my-1.5 hidden min-h-8 w-0.5 flex-1 rounded-full md:block"
                  />
                )}
              </div>

              <div className={`md:pt-1 ${!isLast ? "md:pb-6" : ""}`}>
                <span
                  className="block text-center text-[10px] transition-all duration-300 md:text-left md:text-sm"
                  style={{
                    fontWeight: active ? 600 : 500,
                    color:
                      step >= s.n ? "var(--foreground)" : "var(--text-dim)",
                    transform: active ? "translateX(2px)" : "translateX(0)",
                  }}
                >
                  {s.l}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto hidden md:block">
        <div className="bg-border mb-5 h-px" />
        <blockquote className="text-muted-foreground m-0 mb-3 text-sm leading-[1.7] italic">
          &quot;AutoTube saves you months of trial and error. Finally, a tool
          that truly understands what creators need to scale!&quot;
        </blockquote>
        <div className="flex items-center gap-2">
          <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-linear-to-br from-pink-600 to-(--neon-pink)">
            <span className="text-[8px] font-extrabold text-white">AA</span>
          </div>
          <span className="text-[11px] text-(--text-dim)">
            Ahmed AbouZaid · 3M subscribers
          </span>
        </div>
      </div>
    </div>
  );
}
