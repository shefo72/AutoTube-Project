"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/Button";

export function CTA() {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <motion.div
        {...fadeUp(0)}
        className="border-border bg-card relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border p-10 text-center md:p-20"
      >
        <div className="relative z-10 flex flex-col items-center">
          {/* ── Visual Social Proof ── */}
          <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex -space-x-3">
              <div className="border-background flex h-9 w-9 items-center justify-center rounded-full border-2 bg-linear-to-br from-[#7C5CFC] to-[#A855F7] text-[10px] font-bold text-white">
                AS
              </div>
              <div className="border-background flex h-9 w-9 items-center justify-center rounded-full border-2 bg-linear-to-br from-[#F472B6] to-[#EC4899] text-[10px] font-bold text-white">
                LR
              </div>
              <div className="border-background flex h-9 w-9 items-center justify-center rounded-full border-2 bg-linear-to-br from-[#34D399] to-[#10B981] text-[10px] font-bold text-white">
                MH
              </div>
              <div className="border-background text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full border-2 bg-(--surface-2) text-[10px] font-bold backdrop-blur-md">
                +25k
              </div>
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              Join <strong className="text-foreground">25,000+</strong> creators
              growing their channels
            </div>
          </div>

          <h2
            className="font-heading text-foreground mb-6 font-extrabold tracking-tight"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: "1.1" }}
          >
            Ready to find your next <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-[#7C5CFC] via-[#A855F7] to-[#F472B6] bg-clip-text text-transparent">
              viral video idea?
            </span>
          </h2>

          <p className="text-muted-foreground mx-auto mb-10 max-w-xl text-lg leading-relaxed">
            Stop guessing. Start growing. Let AI analyze the data, write your
            scripts, and build your entire video package in seconds.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => go("/signup")}
              iconRight={<ArrowRight size={16} />}
              className="h-12 w-full rounded-xl text-[15px] font-bold sm:w-auto"
              style={{
                boxShadow: "0 0 24px rgba(124,92,252,0.4)",
              }}
            >
              Start using AutoTube
            </Button>

            <div className="text-muted-foreground/80 flex items-center justify-center gap-2 text-sm font-medium">
              <ShieldCheck size={18} className="text-primary/80" />
              <span>No credit card required</span>
            </div>
          </div>

          <p className="text-muted-foreground mt-6 flex items-center justify-center gap-1.5 text-xs font-medium">
            <Sparkles size={12} className="text-[#7C5CFC]" />
            No credit card required. Free tier available.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
