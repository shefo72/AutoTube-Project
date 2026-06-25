"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ourStory,
  values,
  teamMembers,
  impactStats,
} from "@/constants/about-us";
import { Button } from "../ui/Button";
const D = motion.create("div");

export function AboutPage() {
  const router = useRouter();

  return (
    <div className="bg-background relative min-h-screen overflow-x-hidden font-sans">
      <Navbar />

      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44">
        <div
          className="at-hero-grid pointer-events-none absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
          <D {...fadeUp(0)}>
            <div className="rounded-pill mb-8 inline-flex items-center gap-2 border border-(--border-active) bg-(--accent) px-3 py-1.5">
              <Heart size={10} className="text-primary" />
              <span className="text-accent-foreground text-[11px] font-semibold">
                Our Story
              </span>
            </div>
          </D>

          <D {...fadeUp(0.05)}>
            <h1
              className="font-heading text-foreground mb-6 leading-[0.95] font-extrabold tracking-[-0.04em]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Built by creators,{" "}
              <span
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage: "var(--gradient-aurora)",
                  backgroundSize: "200% 200%",
                  animation: "at-gradient-shift 4s ease infinite",
                  WebkitBackgroundClip: "text",
                }}
              >
                for creators.
              </span>
            </h1>
          </D>

          <D {...fadeUp(0.1)}>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed">
              AutoTube was born from a simple frustration: finding great video
              topics shouldn&apos;t take longer than making the video itself.
              We&apos;re on a mission to democratise YouTube growth with AI.
            </p>
          </D>

          <D {...fadeUp(0.15)} className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => router.push("/signup")}>
              Join 50K+ Creators <ArrowRight size={15} />
            </Button>
          </D>
        </div>
      </section>

      {/* impactStats */}
      <section className="mx-auto max-w-5xl px-5 pb-20 md:px-10 md:pb-28">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {impactStats.map((s, i) => (
            <D key={s.label} {...fadeUp(i * 0.05)}>
              <div className="group border-border bg-card relative h-full overflow-hidden rounded-2xl border p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-(--border-active) hover:shadow-xl">
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${s.color}15 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: `${s.color}10`,
                      border: `1px solid ${s.color}25`,
                      boxShadow: `inset 0 2px 10px ${s.color}15`,
                    }}
                  >
                    <s.icon
                      size={20}
                      color={s.color}
                      className="transition-transform duration-500 group-hover:rotate-10"
                    />
                  </div>

                  <div className="text-foreground mb-1.5 font-mono text-xl font-extrabold tracking-tight md:text-2xl">
                    {s.value}
                  </div>

                  <div className="text-[11px] font-bold tracking-widest text-(--text-dim) uppercase">
                    {s.label}
                  </div>
                </div>
              </div>
            </D>
          ))}
        </div>
      </section>

      <div className="at-section-divider" />

      {/*Our Journey */}
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
        <D {...fadeUp(0)} className="mb-16 text-center">
          <div className="border-primary/20 bg-primary/5 mb-6 inline-flex cursor-default items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            <span className="text-primary text-[11px] font-bold tracking-widest uppercase">
              Our Journey
            </span>
          </div>
          <h2
            className="font-heading text-foreground mb-5 font-extrabold tracking-tight md:tracking-[-0.02em]"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: "1.1" }}
          >
            From side project to <br className="hidden sm:block" />
            <span
              className="inline-block bg-clip-text pb-2 text-transparent"
              style={{
                backgroundImage: "var(--gradient-aurora)",
                backgroundSize: "200% auto",
                animation: "at-gradient-shift 4s ease infinite",
                WebkitBackgroundClip: "text",
              }}
            >
              global platform.
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg">
            Every line of code and every milestone is a testament to the
            creators who believed in our vision from day one.
          </p>
        </D>

        <div className="mx-auto max-w-2xl space-y-0">
          {ourStory.map((m, i) => (
            <D
              key={`${m.year}-${m.title}`}
              {...fadeUp(i * 0.08)}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              {i < ourStory.length - 1 && (
                <div className="bg-border absolute top-12 bottom-0 left-5.5 w-px" />
              )}
              <div
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-transform duration-300 hover:scale-110"
                style={{
                  background: `${m.color}15`,
                  borderColor: `${m.color}40`,
                }}
              >
                <m.icon size={16} color={m.color} />
              </div>
              <div className="pt-1">
                <span className="mb-1 block font-mono text-xs text-(--text-dim)">
                  {m.year}
                </span>
                <h3 className="font-heading text-foreground mb-2 text-xl font-bold">
                  {m.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </D>
          ))}
        </div>
      </section>

      <div className="at-section-divider" />

      {/*   Our Values  */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-32">
        <D {...fadeUp(0)} className="mb-20 text-center">
          <div className="border-primary/20 bg-primary/5 hover:bg-primary/10 mb-6 inline-flex cursor-default items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            <span className="text-primary text-[11px] font-bold tracking-widest uppercase">
              Our Values
            </span>
          </div>
          <h2
            className="font-heading text-foreground mb-5 font-extrabold tracking-tight md:tracking-[-0.02em]"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: "1.1" }}
          >
            What drives us <br className="hidden sm:block" />
            <span
              className="inline-block bg-clip-text pb-2 text-transparent"
              style={{
                backgroundImage: "var(--gradient-aurora)",
                backgroundSize: "200% auto",
                animation: "at-gradient-shift 4s ease infinite",
                WebkitBackgroundClip: "text",
              }}
            >
              every single day.
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-[17px] leading-relaxed md:text-[19px]">
            These aren&apos;t just words on a wall. They are the non-negotiable
            principles that shape every line of code, every design, and every
            decision we make.
          </p>
        </D>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {values.map((v, i) => (
            <D key={v.title} {...fadeUp(i * 0.08)}>
              <div className="group border-border relative flex h-full cursor-default flex-col justify-between overflow-hidden rounded-3xl border bg-(--surface-1)/40 p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-sm">
                <div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(600px circle at 100% 0%, ${v.color}15, transparent 40%)`,
                  }}
                />

                <div className="relative z-10 flex flex-col items-start">
                  <div
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-[8deg]"
                    style={{
                      background: `${v.color}10`,
                      border: `1px solid ${v.color}25`,
                      boxShadow: `inset 0 0 12px ${v.color}15`,
                    }}
                  >
                    <v.icon size={22} color={v.color} />
                  </div>

                  <div>
                    <h3 className="font-heading text-foreground mb-3 text-[19px] font-bold tracking-tight">
                      {v.title}
                    </h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              </div>
            </D>
          ))}
        </div>
      </section>

      <div className="at-section-divider" />

      {/* The Team*/}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-25">
        <D {...fadeUp(0)} className="mb-16 text-center">
          <div className="rounded-pill mb-5 inline-flex items-center gap-2 border border-(--border-active) bg-(--accent) px-3 py-1">
            <div className="bg-primary h-1.5 w-1.5 rounded-full" />
            <span className="text-accent-foreground text-[10px] font-bold tracking-widest uppercase">
              The Team
            </span>
          </div>
          <h2
            className="font-heading text-foreground mb-4 font-extrabold tracking-tight"
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
          >
            Meet the humans <br className="hidden sm:block" />
            behind{" "}
            <span
              className="inline-block bg-clip-text pb-2 text-transparent"
              style={{
                backgroundImage: "var(--gradient-aurora)",
                backgroundSize: "200% auto",
                animation: "at-gradient-shift 4s ease infinite",
                WebkitBackgroundClip: "text",
              }}
            >
              AutoTube.
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-[17px] leading-relaxed">
            A small, focused team of creators, engineers, and AI researchers
            obsessed with YouTube growth.
          </p>
        </D>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => {
            return (
              <D key={member.name} {...fadeUp(i * 0.05)}>
                <div className="group border-border bg-card relative flex h-full cursor-default flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="pointer-events-none absolute -right-4 -bottom-6 z-0 -rotate-12 opacity-[0.06] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:opacity-[0.12]"
                    style={{ color: member.color }}
                  >
                    <member.icon size={150} strokeWidth={0.75} />
                  </div>

                  {member.socials && (
                    <div className="border-border/40 bg-background/60 absolute top-5 right-5 z-20 flex -translate-y-2 items-center gap-2.5 rounded-full border px-3 py-1.5 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:opacity-0">
                      {member.socials.slice(0, 3).map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-(--text-dim) transition-all duration-300 hover:scale-110"
                          style={
                            {
                              "--hover-social": member.color,
                            } as React.CSSProperties
                          }
                        >
                          <social.icon
                            size={15}
                            className="hover:text-(--hover-social)"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-center justify-between">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[18px] font-bold tracking-wide text-white shadow-sm transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.avatar}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading text-foreground mb-1 text-lg font-bold tracking-tight">
                        {member.name}
                      </h3>

                      <div className="mb-3 flex items-center gap-2">
                        <p
                          className="text-[12px] font-bold tracking-wide uppercase"
                          style={{ color: member.color }}
                        >
                          {member.role}
                        </p>
                      </div>

                      <p className="text-muted-foreground text-[14px] leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </D>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
