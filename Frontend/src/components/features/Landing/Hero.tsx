"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { stats } from "@/constants/landing";
import { heroFadeUp } from "@/lib/animations";

export function Hero() {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  return (
    <section className="relative min-h-screen overflow-hidden pt-36 pb-24 md:pt-44">
      <div
        className="at-hero-grid pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left — Text */}
          <div>
            <motion.div {...heroFadeUp(0)}>
              <div className="rounded-pill mb-8 inline-flex items-center gap-2 border border-(--border-active) bg-(--accent) px-3 py-1.5">
                <Zap size={10} className="text-primary" />
                <span className="text-[11px] font-semibold text-(--accent-foreground)">
                  Gap Analyzer v2 is live
                </span>
                <ChevronRight
                  size={12}
                  className="text-(--accent-foreground)"
                />
              </div>
            </motion.div>

            <motion.div {...heroFadeUp(0.05)}>
              <h1
                className="font-heading text-foreground mb-6 leading-[0.95] font-extrabold tracking-[-0.04em]"
                style={{ fontSize: "clamp(44px, 6vw, 76px)" }}
              >
                Find what{" "}
                <span
                  className="animate-gradient-shift inline-block bg-size-[200%_200%] bg-clip-text pr-2 text-transparent"
                  style={{
                    backgroundImage: "var(--gradient-aurora)",
                    WebkitBackgroundClip: "text",
                    paddingBottom: 4,
                  }}
                >
                  YouTube
                </span>
                <br />
                is missing.
              </h1>
            </motion.div>

            <motion.div {...heroFadeUp(0.1)}>
              <p className="text-muted-foreground mb-8 max-w-lg text-lg leading-relaxed">
                AutoTube finds untapped content gaps, generates complete video
                packages, and grows your channel — all from one AI-powered
                workspace.
              </p>
            </motion.div>

            <motion.div
              {...heroFadeUp(0.15)}
              className="mb-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            >
              <Button
                variant="primary"
                onClick={() => go("/signup")}
                iconRight={<ArrowRight size={15} />}
                style={{ boxShadow: "var(--glow-primary)" }}
              >
                Start for free
              </Button>

              <div className="text-muted-foreground/80 flex items-center gap-2 text-sm font-medium">
                <ShieldCheck size={16} className="text-primary/70" />
                <span>No credit card required</span>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div {...heroFadeUp(0.2)} className="flex flex-wrap gap-6">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      background: `${s.color}15`,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    <s.icon size={15} color={s.color} />
                  </div>
                  <div>
                    <div className="text-foreground font-mono text-base font-bold tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-[10px] text-(--text-dim)">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Bento Preview */}
          <motion.div {...heroFadeUp(0.1)} className="relative hidden md:block">
            <div className="at-glass-card shadow-elevation-lg p-1">
              <div className="border-border flex items-center gap-1.5 border-b px-3 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                <div className="ml-2 flex h-5 flex-1 items-center rounded bg-(--hover-overlay) px-2">
                  <span className="font-mono text-[9px] text-(--text-dim)">
                    app.autotube.io/dashboard
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "2.8K", l: "Analyses", c: "#7C5CFC" },
                    { v: "94", l: "Videos", c: "#A855F7" },
                    { v: "1.2M", l: "Views", c: "#34D399" },
                  ].map((k) => (
                    <div
                      key={k.l}
                      className="border-border rounded-lg border bg-(--surface-1) p-3"
                    >
                      <div className="mb-1 text-[9px] text-(--text-dim)">
                        {k.l}
                      </div>
                      <div
                        className="font-mono text-sm font-bold tracking-tight"
                        style={{ color: k.c }}
                      >
                        {k.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-border flex h-32 items-end gap-1 rounded-lg border bg-(--surface-1) p-3">
                  {[40, 55, 35, 70, 60, 85, 75, 95, 80, 65, 90, 100].map(
                    (h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{
                          delay: 0.5 + i * 0.05,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex-1 rounded-sm"
                        style={{
                          background: `linear-gradient(to top, ${i % 2 === 0 ? "#7C5CFC" : "#A855F7"}40, ${i % 2 === 0 ? "#7C5CFC" : "#A855F7"})`,
                        }}
                      />
                    )
                  )}
                </div>
                <div className="border-border overflow-hidden rounded-lg border bg-(--surface-1)">
                  {[94, 91, 89].map((score, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2"
                      style={{
                        borderBottom:
                          i < 2 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <div className="flex-1 space-y-1">
                        <div
                          className="h-1.5 rounded-full bg-(--surface-3)"
                          style={{ width: `${60 + i * 12}%` }}
                        />
                        <div
                          className="h-1 rounded-full bg-(--surface-3)"
                          style={{ width: "30%" }}
                        />
                      </div>
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-[10px] font-bold"
                        style={{
                          background: "#7C5CFC18",
                          border: "1px solid #7C5CFC30",
                          color: "#9B80FF",
                        }}
                      >
                        {score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="absolute -inset-8 -z-10 rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(124,92,252,0.08) 0%, transparent 70%)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
