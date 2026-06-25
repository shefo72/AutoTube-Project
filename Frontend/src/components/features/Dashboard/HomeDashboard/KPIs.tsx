"use client";
import { Coins, Crosshair, Users, Play } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

const D = motion.create("div");

export function KPIs({
  totalAnalyses,
  videosGenerated,
  scriptsGenerated,
  thumbnailsGenerated,
}: {
  totalAnalyses: number;
  videosGenerated: number;
  thumbnailsGenerated: number;
  scriptsGenerated: number;
}) {
  const kpis = [
    {
      label: "Total Analyses",
      value: totalAnalyses.toString(),
      icon: Crosshair,
      color: "#7C5CFC",
      sparkData: [30, 40, 35, 50, 45, 60, 55],
    },
    {
      label: "Videos Generated",
      value: videosGenerated.toString(),
      icon: Play,
      color: "#A855F7",
      sparkData: [10, 15, 12, 20, 18, 25, 30],
    },
    {
      label: "Scripts Generated",
      value: scriptsGenerated.toString(),
      icon: Coins,
      color: "#F472B6",
      sparkData: [60, 55, 70, 65, 80, 75, 90],
    },
    {
      label: "Thumbnails Generated",
      value: thumbnailsGenerated,
      icon: Users,
      color: "#34D399",
      sparkData: [60, 55, 70, 65, 80, 75, 90],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
      {kpis.map((k, i) => (
        <D key={k.label} {...fadeIn(0.05 + i * 0.06)} className="h-full">
          <div className="group bg-card border-border hover:shadow-elevation-md relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-(--border-active) sm:p-5">
            <div
              className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
              style={{ background: k.color }}
            />
            <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
              <span className="text-[10px] leading-snug font-bold tracking-wide text-(--text-dim) uppercase sm:text-xs">
                {k.label}
              </span>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${k.color}15`, color: k.color }}
              >
                <k.icon size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div className="relative z-10 mt-auto">
              <div
                className={`text-foreground mb-3 font-mono font-extrabold tracking-tighter ${k.label === "User Persona" ? "text-lg" : "text-2xl"}`}
              >
                {k.value}
              </div>
              <div className="relative flex h-6 items-end gap-1">
                {k.sparkData.map((v, si) => (
                  <motion.div
                    key={si}
                    initial={{ height: 0 }}
                    animate={{
                      height: `${(v / Math.max(...k.sparkData)) * 100}%`,
                    }}
                    transition={{
                      delay: 0.3 + si * 0.04,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="min-h-0.5 flex-1 rounded-sm"
                    style={{
                      background:
                        si === k.sparkData.length - 1
                          ? k.color
                          : `${k.color}40`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </D>
      ))}
    </div>
  );
}
