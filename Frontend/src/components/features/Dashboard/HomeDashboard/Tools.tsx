"use client";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fadeIn } from "@/lib/animations";
import { tools } from "@/constants/user-dashboard";

const D = motion.create("div");
export function Tools() {
  const router = useRouter();

  return (
    <D {...fadeIn(0.36)} className="h-full">
      <div className="bg-card border-border flex h-full flex-col rounded-2xl border p-5">
        <div className="text-foreground mb-5 text-xs font-extrabold tracking-wide uppercase">
          Tools
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3">
          {tools.map((t) => (
            <motion.button
              key={t.label}
              onClick={() => router.push(t.path)}
              whileTap={{ scale: 0.97 }}
              className="group border-border hover:shadow-elevation-md relative flex cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-xl border bg-(--surface-1) p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-(--border-active)"
            >
              <div
                className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                style={{ background: t.color }}
              />

              {t.hot && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.12)] px-1.5 py-0.5">
                  <Flame size={8} color="#FBBF24" />
                  <span className="text-[8px] font-bold text-[#FBBF24]">
                    HOT
                  </span>
                </div>
              )}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  background: `${t.color}12`,
                  border: `1px solid ${t.color}20`,
                }}
              >
                <t.icon size={15} color={t.color} />
              </div>
              <div>
                <div className="text-foreground mb-0.5 text-[12px] font-semibold">
                  {t.label}
                </div>
                <div className="text-[10px] leading-relaxed text-(--text-dim)">
                  {t.desc}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </D>
  );
}
