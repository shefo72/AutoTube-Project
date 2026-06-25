"use client";
import { motion } from "framer-motion";
import { steps } from "@/constants/landing";
import { fadeUp } from "@/lib/animations";

export function Process() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <motion.div {...fadeUp(0)} className="mb-16 text-center">
        <div className="rounded-pill mb-5 inline-flex items-center gap-2 border border-(--border-active) bg-(--accent) px-3 py-1">
          <div className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span className="text-(--accent-foreground) text-[10px] font-bold tracking-widest uppercase">
            How it works
          </span>
        </div>
        <h2
          className="font-heading text-foreground font-extrabold tracking-tight"
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
        >
          Three steps to viral.
        </h2>
      </motion.div>

      <div className="mx-auto max-w-2xl space-y-0">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            {...fadeUp(i * 0.1)}
            className="relative flex gap-6 pb-12 last:pb-0"
          >
            {i < steps.length - 1 && (
              <div className="bg-border absolute top-12 bottom-0 left-5.5 w-px" />
            )}
            <div
              className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2"
              style={{
                background: `${s.color}15`,
                borderColor: `${s.color}40`,
              }}
            >
              <s.icon size={16} color={s.color} />
            </div>
            <div className="pt-1">
              <span className="mb-1 block font-mono text-xs text-(--text-dim)">
                Step {s.n}
              </span>
              <h3 className="font-heading text-foreground mb-2 text-xl font-bold">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
