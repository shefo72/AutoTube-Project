"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { LEGAL_CONTENT } from "@/constants/privacyPolice";

type TabType = "privacy" | "terms";

interface LegalSectionData {
  id: string;
  title: string;
  icon: LucideIcon;
  tldr: string;
  content: string;
}

export default function LegalContent({ activeTab }: { activeTab: TabType }) {
  const router = useRouter();
  const currentContent = LEGAL_CONTENT[activeTab];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
        <div className="border-border bg-card text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
          <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
          Last Updated: May 2026
        </div>
        <h1 className="text-foreground mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          Legal & <span className="text-primary">Trust Center</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
          Transparency is our standard. Everything you need to know about how we
          handle your data and our services.
        </p>
      </div>

      {/* ── navigation tabs ─ */}
      <div className="mb-16 flex justify-center">
        <div className="border-border bg-card/50 flex rounded-2xl border p-1.5 backdrop-blur-md">
          {(["privacy", "terms"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                router.push(`/legal/${tab}`, { scroll: false });
              }}
              className={cn(
                "relative cursor-pointer rounded-xl px-8 py-3 text-sm font-medium transition-colors outline-none",
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-legal-tab"
                  className="bg-muted absolute inset-0 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 capitalize">
                {tab === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {currentContent.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32"
                >
                  <LegalCard section={section} />
                </section>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <aside className="sticky top-28 hidden w-64 shrink-0 self-start lg:block">
          <div className="text-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
            On this page
          </div>
          <nav className="border-border flex flex-col border-l-2">
            {currentContent.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="group text-muted-foreground hover:text-foreground hover:border-border-active -ml-0.5 flex cursor-pointer items-center gap-3 border-l-2 border-transparent py-2.5 pl-4 text-left text-sm transition-all"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>
      </div>
    </section>
  );
}

function LegalCard({ section }: { section: LegalSectionData }) {
  const Icon = section.icon;
  return (
    <div className="border-border bg-card hover:border-primary/30 rounded-3xl border p-6 shadow-sm transition-colors duration-300 md:p-10">
      <div className="mb-6 flex items-center gap-4">
        <div className="border-border bg-muted/50 text-primary flex h-12 w-12 items-center justify-center rounded-xl border">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          {section.title}
        </h2>
      </div>
      <TLDR text={section.tldr} />
      <div className="text-muted-foreground space-y-4 text-[15px] leading-relaxed md:text-base">
        <p>{section.content}</p>
      </div>
    </div>
  );
}

function TLDR({ text }: { text: string }) {
  return (
    <div className="border-primary/20 bg-primary/5 mb-6 flex items-start gap-4 rounded-xl border p-4 md:p-5">
      <Info className="text-primary mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <span className="text-primary mb-1 text-[11px] font-bold tracking-widest uppercase">
          TL;DR
        </span>
        <p className="text-foreground/90 text-sm leading-relaxed font-medium md:text-[15px]">
          {text}
        </p>
      </div>
    </div>
  );
}
