"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Zap, Info } from "lucide-react";
import { guideModules, universalRules } from "@/constants/PromptGuide";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fadeUp } from "@/lib/animations";

const D = motion.create("div");

export function PromptGuidePage() {
  const [activeModuleId, setActiveModuleId] = useState(guideModules[0].id);

  const activeModule = guideModules.find((m) => m.id === activeModuleId)!;

  return (
    <div className="bg-background relative min-h-screen overflow-x-hidden font-sans">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-48">
        <div className="pointer-events-none absolute top-[-10%] left-1/2 h-125 w-200 -translate-x-1/2 opacity-30 mix-blend-screen">
          <div className="bg-primary/40 absolute inset-0 rounded-full blur-[120px]" />
        </div>

        <div
          className="at-hero-grid pointer-events-none absolute inset-0 opacity-50"
          style={{
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, black 15%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
          <D {...fadeUp(0)}>
            <div className="group border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10 mb-8 inline-flex cursor-default items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md transition-all">
              <span className="relative flex h-2 w-2">
                <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
              </span>
              <span className="text-primary text-[12px] font-bold tracking-wider uppercase">
                Prompt Engineering 101
              </span>
            </div>
          </D>

          <D {...fadeUp(0.05)}>
            <h1
              className="font-heading text-foreground mb-6 font-extrabold tracking-tight md:tracking-[-0.02em]"
              style={{
                fontSize: "clamp(40px, 6vw, 68px)",
                lineHeight: "1.05",
              }}
            >
              Engineer the <br className="hidden md:block" />
              <span
                className="inline-block bg-clip-text pb-2 text-transparent"
                style={{
                  backgroundImage: "var(--gradient-aurora)",
                  backgroundSize: "200% auto",
                  animation: "at-gradient-shift 4s ease infinite",
                  WebkitBackgroundClip: "text",
                }}
              >
                perfect prompt.
              </span>
            </h1>
          </D>

          <D {...fadeUp(0.1)}>
            <p className="text-muted-foreground mx-auto max-w-2xl text-[17px] leading-relaxed md:text-[19px]">
              Stop guessing. Start directing. Learn the exact frameworks and
              psychological triggers needed to extract agency-quality content
              from AI.
            </p>
          </D>
        </div>
      </section>

      {/* ── Universal Rules ── */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10 md:pb-28">
        <D {...fadeUp(0.15)} className="mb-10 text-center">
          <h2 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-3xl">
            The Golden Rules
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Apply these principles to any prompt, across any tool.
          </p>
        </D>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {universalRules.map((rule, i) => (
            <D key={rule.title} {...fadeUp(0.2 + i * 0.05)}>
              <div className="group border-border bg-card relative flex h-full cursor-default flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-sm">
                <div
                  className="absolute -top-16 -left-16 h-48 w-48 rounded-full opacity-0 blur-[60px] transition-all duration-700 ease-out group-hover:opacity-20"
                  style={{
                    background: rule.color,
                    transform: "scale(0.8) translate(0, 0)",
                  }}
                />
                <div className="relative z-10 flex flex-col items-start">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-[8deg]"
                    style={{
                      background: `${rule.color}10`,
                      border: `1px solid ${rule.color}25`,
                      boxShadow: `inset 0 0 12px ${rule.color}15`,
                    }}
                  >
                    <rule.icon size={20} color={rule.color} />
                  </div>
                  <h3 className="font-heading text-foreground mb-2 text-[17px] font-bold tracking-tight">
                    {rule.title}
                  </h3>
                  <p className="text-muted-foreground text-[14px] leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            </D>
          ))}
        </div>
      </section>

      <div className="at-section-divider" />

      {/* ── Specific Guides ── */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
        {/* Tabs */}
        <D
          {...fadeUp(0)}
          className="mb-12 flex flex-wrap justify-center gap-3 md:gap-4"
        >
          {guideModules.map((module) => {
            const isActive = activeModuleId === module.id;
            return (
              <motion.button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-all"
                style={{
                  background: isActive ? `${module.color}15` : "var(--card)",
                  borderColor: isActive ? `${module.color}40` : "var(--border)",
                  color: isActive ? module.color : "var(--muted-foreground)",
                }}
              >
                <module.icon size={18} />
                <span className="whitespace-nowrap">{module.title}</span>
              </motion.button>
            );
          })}
        </D>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* Left: Rules */}
            <div className="flex h-full flex-col lg:col-span-7">
              <div className="bg-card border-border flex h-full flex-col gap-4 rounded-3xl border p-6 md:p-8">
                <div className="flex flex-1 justify-center gap-6">
                  <div
                    className="flex h-12 w-20 items-center justify-center rounded-2xl border"
                    style={{
                      background: `${activeModule.color}10`,
                      borderColor: `${activeModule.color}30`,
                    }}
                  >
                    <activeModule.icon size={24} color={activeModule.color} />
                  </div>
                  <div className="gap- flex flex-col">
                    <h2 className="font-heading text-2xl font-bold tracking-tight">
                      {activeModule.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {activeModule.description}
                    </p>
                  </div>
                </div>
                {/* Formula */}
                <div className="mb-8">
                  <h3 className="mb-3 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                    The Winning Formula
                  </h3>
                  <div
                    className="rounded-xl border p-4 font-mono text-sm font-semibold tracking-tight"
                    style={{
                      background: `${activeModule.color}05`,
                      borderColor: `${activeModule.color}20`,
                      color: activeModule.color,
                    }}
                  >
                    {activeModule.formula}
                  </div>
                </div>
                {/* Dos & Don'ts */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-[#34D399] uppercase">
                      <CheckCircle2 size={16} /> Best Practices
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {activeModule.dos.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-muted-foreground flex items-start gap-2 text-sm"
                        >
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34D399]" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-[#EF4444] uppercase">
                      <XCircle size={16} /> Avoid These
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {activeModule.donts.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-muted-foreground flex items-start gap-2 text-sm"
                        >
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EF4444]" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* ── Pro Tip Section ── */}
                <div
                  className="relative overflow-hidden rounded-xl border p-5"
                  style={{
                    backgroundColor: `${activeModule.color}05`,
                    borderColor: `${activeModule.color}30`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-full w-1"
                    style={{ backgroundColor: activeModule.color }}
                  />
                  <h4
                    className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                    style={{ color: activeModule.color }}
                  >
                    <Zap size={14} /> Pro Tip
                  </h4>
                  <p className="text-foreground text-sm leading-relaxed">
                    {activeModule.proTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Example */}
            <div className="flex h-full flex-col lg:col-span-5">
              <div className="bg-card border-border relative flex h-full flex-col rounded-3xl border p-6 md:p-8">
                <div className="flex h-full flex-col">
                  <h3 className="mb-6 text-center text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                    Before & After
                  </h3>

                  {/* Bad Prompt */}
                  <div className="relative mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                    <div className="bg-background absolute -top-3 left-4 rounded-full border border-red-500/20 px-3 py-1 text-[9px] font-bold tracking-widest text-red-500 uppercase">
                      Amateur
                    </div>
                    <p className="text-muted-foreground font-mono text-[13px] leading-relaxed">
                      &quot;{activeModule.badPrompt}&quot;
                    </p>
                  </div>

                  <div
                    className="group relative mb-6 rounded-2xl border p-5 transition-all"
                    style={{
                      background: "var(--background)",
                      borderColor: `${activeModule.color}50`,
                    }}
                  >
                    <div
                      className="bg-background absolute -top-3 left-4 rounded-full border px-3 py-1 text-[9px] font-bold tracking-widest uppercase"
                      style={{
                        borderColor: `${activeModule.color}50`,
                        color: activeModule.color,
                      }}
                    >
                      Pro Prompt
                    </div>
                    <p className="text-foreground mt-2 font-mono text-[13.5px] leading-relaxed font-medium">
                      &quot;{activeModule.goodPrompt}&quot;
                    </p>
                  </div>

                  <div className="border-border rounded-xl border bg-(--surface-1)/50 p-5">
                    <h4 className="text-foreground mb-2 flex items-center gap-2 text-xs font-bold">
                      <Info size={14} className="text-(--text-dim)" /> Why this
                      works
                    </h4>
                    <p className="text-muted-foreground text-[13px] leading-relaxed">
                      {activeModule.whyItWorks}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
}
