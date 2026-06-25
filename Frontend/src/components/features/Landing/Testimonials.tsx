"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/constants/landing";
import { fadeUp } from "@/lib/animations";

export function Testimonials() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden py-16 md:py-28" id="testimonials">
      <motion.div {...fadeUp(0)} className="mb-10 px-4 text-center md:mb-14">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--border-active) bg-(--accent) px-3 py-1">
          <div className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span className="text-[10px] font-bold tracking-widest text-(--accent-foreground) uppercase">
            Wall of Love
          </span>
        </div>
        <h2 className="font-heading text-foreground mb-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[52px]">
          Loved by content creators.
        </h2>
        <div className="mb-2 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />
          ))}
        </div>
        <p className="text-sm text-(--text-dim)">4.9/5 from 2,400+ reviews</p>
      </motion.div>

      {/* Marquee row */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-(--background) to-transparent sm:w-20 md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-(--background) to-transparent sm:w-20 md:w-32" />

        <div
          className="animate-marquee flex gap-4 hover:[animation-play-state:paused] md:gap-5"
          style={{ width: "max-content" }}
        >
          {doubled.map((t, i) => (
            <div
              key={i}
              className="border-border bg-card rounded-card flex h-auto min-h-45 w-70 shrink-0 flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-(--surface-4) hover:shadow-lg sm:w-75 md:min-h-52.5 md:w-85 md:p-6"
            >
              <div>
                <div className="mb-3 flex gap-1 md:mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={12} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
                <p className="text-secondary-foreground line-clamp-3 text-sm leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="mt-auto flex items-center gap-3 pt-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white shadow-sm md:h-10 md:w-10 md:text-[15px]"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-bold">
                    {t.name}
                  </span>
                  <span className="text-[11px] text-(--text-dim)">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
