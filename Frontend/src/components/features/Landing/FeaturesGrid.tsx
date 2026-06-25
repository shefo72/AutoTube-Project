"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { tools } from "@/constants/landing";
import { fadeUp } from "@/lib/animations";

const getBentoClasses = (i: number) => {
  switch (i) {
    case 0:
      return "md:col-span-2 lg:col-span-2";
    case 1:
      return "md:col-span-1 lg:col-span-1";
    case 2:
      return "md:col-span-1 lg:col-span-1";
    case 3:
      return "md:col-span-1 lg:col-span-2";
    case 4:
      return "md:col-span-2 lg:col-span-2";
    case 5:
      return "md:col-span-1 lg:col-span-1";
    default:
      return "col-span-1";
  }
};

export function FeaturesGrid() {
  const router = useRouter();
  const go = (path: string) => router.push(path);
  const [selectedTool, setSelectedTool] = useState<(typeof tools)[0] | null>(
    null
  );

  const handleCardClick = useCallback((tool: (typeof tools)[0]) => {
    setSelectedTool(tool);
  }, []);

  return (
    <section
      className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
      id="features"
    >
      <motion.div {...fadeUp(0)} className="mb-16 text-center">
        <div className="rounded-pill mb-5 inline-flex items-center gap-2 border border-(--border-active) bg-(--accent) px-3 py-1">
          <div className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span className="text-[10px] font-bold tracking-widest text-(--accent-foreground) uppercase">
            Features
          </span>
        </div>
        <h2
          className="font-heading text-foreground mb-4 font-extrabold tracking-tight"
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
        >
          Six tools. One unfair advantage.
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-lg">
          Everything you need to dominate YouTube — research, create, publish,
          and grow.
        </p>
      </motion.div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t, i) => {
          const bentoClass = getBentoClasses(i);
          return (
            <motion.div
              key={t.title}
              {...fadeUp(i * 0.06)}
              onClick={() => handleCardClick(t)}
              className={bentoClass}
            >
              <div className="group border-border bg-card hover:border-primary/30 hover:shadow-glow-sm rounded-card relative flex h-full min-h-55 cursor-pointer flex-col justify-between overflow-hidden border p-6 transition-all duration-300 hover:-translate-y-1">
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 80% 0%, ${t.color}15 0%, transparent 70%)`,
                  }}
                />
                <div className="absolute top-5 right-5 flex items-center justify-center opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:translate-x-1 md:group-hover:-translate-y-1 md:group-hover:opacity-100">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md"
                    style={{
                      borderColor: `${t.color}30`,
                      background: `${t.color}10`,
                    }}
                  >
                    <ArrowUpRight size={14} color={t.color} />
                  </div>
                </div>

                <div className="relative z-10 flex flex-1 flex-col">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: `${t.color}12`,
                      border: `1px solid ${t.color}25`,
                    }}
                  >
                    <t.icon size={20} color={t.color} />
                  </div>

                  <div className="mt-auto">
                    <h3 className="font-heading text-foreground mb-2 text-xl font-bold">
                      {t.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div {...fadeUp(0.3)} className="mt-12 flex justify-center">
        <Button
          variant="primary"
          onClick={() => go("/dashboard")}
          iconRight={<ArrowRight size={14} />}
          whileHover={{ scale: 1.04 }}
        >
          Explore All Features
        </Button>
      </motion.div>

      {/* model */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedTool(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card border-border relative w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  background: `linear-gradient(90deg, ${selectedTool.color}, ${selectedTool.color}80)`,
                }}
              />
              <div className="p-7">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        background: `${selectedTool.color}15`,
                        border: `1px solid ${selectedTool.color}30`,
                      }}
                    >
                      <selectedTool.icon size={22} color={selectedTool.color} />
                    </div>
                    <div>
                      <h3 className="text-foreground text-lg font-bold">
                        {selectedTool.title}
                      </h3>
                      <p className="text-[11px] text-(--text-dim)">
                        {selectedTool.desc}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTool(null)}
                    className="hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-(--text-dim) transition-colors hover:bg-(--hover-overlay)"
                  >
                    <X size={15} />
                  </button>
                </div>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {selectedTool.detail}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  iconRight={<ArrowRight size={13} />}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedTool(null);
                    go(selectedTool.to);
                  }}
                  className="rounded-xl"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${selectedTool.color}, ${selectedTool.color}cc)`,
                    boxShadow: `0 0 20px ${selectedTool.color}30`,
                  }}
                >
                  Try {selectedTool.title}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
