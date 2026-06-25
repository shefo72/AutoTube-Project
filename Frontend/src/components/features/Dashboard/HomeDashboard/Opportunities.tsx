"use client";
import { useRouter } from "next/navigation";
import { fadeIn } from "@/lib/animations";
import { motion } from "framer-motion";
import { TrendingUp, ChevronRight, SearchX } from "lucide-react";
import { Opportunity } from "@/types/userDashboard";

const D = motion.create("div");

export function Opportunities({
  opportunities,
}: {
  opportunities: Opportunity[];
}) {
  const router = useRouter();

  const isEmpty = !opportunities || opportunities.length === 0;
  return (
    <D {...fadeIn(0.42)}>
      <div className="bg-card border-border h-full rounded-2xl border p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(124,92,252,0.18)] bg-[rgba(124,92,252,0.1)]">
              <TrendingUp size={13} color="#7C5CFC" />
            </div>
            <span className="text-foreground text-sm font-bold">
              Top Opportunities
            </span>
          </div>
          {!isEmpty && (
            <button
              onClick={() => router.push("/dashboard/gap-analyzer")}
              className="text-primary hover:text-primary-hover flex cursor-pointer items-center gap-1 border-none bg-transparent text-[10px] font-medium"
            >
              See all <ChevronRight size={10} />
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="flex h-60 flex-col items-center justify-center text-center">
            <SearchX
              size={32}
              className="mb-3 text-(--border-active) opacity-50"
            />
            <p className="text-muted-foreground text-sm font-medium">
              No opportunities found yet.
            </p>
            <p className="text-[11px] text-(--text-dim)">
              Run a Gap Analysis to discover new trends.
            </p>
          </div>
        ) : (
          opportunities.map((o, i) => (
            <div
              key={o.keyword}
              className="-mx-3 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-(--hover-overlay)"
              style={{
                borderBottom:
                  i < opportunities.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(124,92,252,0.15)] bg-[rgba(124,92,252,0.08)]">
                <span className="text-primary font-mono text-sm font-extrabold">
                  {Math.round(o.gapScore)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-foreground mb-1.5 truncate text-[12px] font-semibold">
                  {o.keyword}
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-(--surface-2)">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${o.gapScore}%` }}
                    transition={{
                      delay: 0.6 + i * 0.1,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-aurora)" }}
                  />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[11px] font-bold text-[#34D399]">
                  {o.demandScore.toFixed(1)}{" "}
                </div>
                <div className="font-mono text-[9px] font-medium tracking-wider text-(--text-dim) uppercase">
                  Demand
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </D>
  );
}
