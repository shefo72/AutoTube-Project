"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fadeUp } from "@/lib/animations";
import { categories, faqData } from "@/constants/FAQs";
import { Tooltip } from "../ui/tooltip";

const D = motion.create("div");

export function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const currentFaqs = faqData[activeCategory] || [];

  const filteredFaqs = searchQuery.trim()
    ? Object.entries(faqData).flatMap(([, items]) =>
        items.filter(
          (f) =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : currentFaqs;

  return (
    <div className="bg-background relative min-h-screen overflow-x-hidden font-sans">
      <Navbar />

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
                Support & FAQs
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
              Frequently Asked <br className="hidden md:block" />
              <span
                className="inline-block bg-clip-text pb-2 text-transparent"
                style={{
                  backgroundImage: "var(--gradient-aurora)",
                  backgroundSize: "200% auto",
                  animation: "at-gradient-shift 4s ease infinite",
                  WebkitBackgroundClip: "text",
                }}
              >
                Questions.
              </span>
            </h1>
          </D>

          <D {...fadeUp(0.1)}>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-[17px] leading-relaxed md:text-[19px]">
              Everything you need to know about AutoTube and how it works.{" "}
              <br className="hidden sm:block" />
              Can&apos;t find what you&apos;re looking for? Reach out to our
              team.
            </p>
          </D>

          {/* Search Bar */}
          <D {...fadeUp(0.15)}>
            <div className="relative mx-auto max-w-lg">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-(--text-dim)">
                <Search size={16} />
              </div>
              <input
                id="faq-search"
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border text-foreground focus:shadow-glow-primary-sm h-12 w-full rounded-xl border bg-(--surface-1) pr-5 pl-11 font-sans text-sm transition-all outline-none placeholder:text-(--text-dim) focus:border-(--border-active)"
              />
            </div>
          </D>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20 md:px-10 md:pb-28">
        {!searchQuery.trim() && (
          <D
            {...fadeUp(0)}
            className="mb-12 flex flex-wrap justify-center gap-3 md:gap-4"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <Tooltip key={cat.id} content={cat.description}>
                  <motion.button
                    id={`faq-category-${cat.id}`}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenIndex(0);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
                    style={{
                      background: isActive ? `${cat.color}15` : "var(--card)",
                      borderColor: isActive
                        ? `${cat.color}40`
                        : "var(--border)",
                      color: isActive ? cat.color : "var(--muted-foreground)",
                      boxShadow: isActive ? `0 0 15px ${cat.color}20` : "none",
                    }}
                  >
                    <cat.icon size={18} />

                    <span className="hidden whitespace-nowrap md:block">
                      {cat.label}
                    </span>
                  </motion.button>
                </Tooltip>
              );
            })}
          </D>
        )}

        {searchQuery.trim() && (
          <D {...fadeUp(0)} className="mb-8 text-center">
            <span className="text-muted-foreground text-sm">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}{" "}
              for &ldquo;{searchQuery}&rdquo;
            </span>
          </D>
        )}

        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <FAQItem
              key={`${activeCategory}-${i}-${faq.q}`}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
            />
          ))}

          {filteredFaqs.length === 0 && (
            <D {...fadeUp(0)} className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--accent)">
                <Search size={24} className="text-accent-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                No questions found. Try a different search term.
              </p>
            </D>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({
  q,
  a,
  isOpen,
  onClick,
  index,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <D {...fadeUp(index * 0.04)}>
      <motion.div
        layout
        className="border-border rounded-card overflow-hidden border transition-all duration-300"
        style={{
          background: isOpen ? "var(--surface-1)" : "var(--card)",
          borderColor: isOpen ? "var(--border-active)" : undefined,
        }}
      >
        <button
          onClick={onClick}
          id={`faq-item-${index}`}
          className="group flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent p-5 text-left md:p-6"
          aria-expanded={isOpen}
        >
          <span
            className="font-heading text-sm font-semibold transition-colors md:text-base"
            style={{
              color: isOpen
                ? "var(--foreground)"
                : "var(--secondary-foreground)",
            }}
          >
            {q}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all"
            style={{
              background: isOpen ? "var(--accent)" : "var(--hover-overlay)",
              color: isOpen ? "var(--accent-foreground)" : "var(--text-dim)",
            }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pt-0 pb-5 md:px-6 md:pb-6">
                <div className="bg-border mb-4 h-px" />
                <p className="text-muted-foreground m-0 text-sm leading-relaxed">
                  {a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </D>
  );
}
