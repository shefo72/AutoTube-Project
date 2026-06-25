/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Type,
  Music,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import Image from "next/image";
import { fadeIn } from "@/lib/animations";
import { CopyBtn } from "@/components/ui/CopyBtn";
import { EmptyState } from "./EmptyState";
import { SCRIPT_SECTION_KEYS, CONTENT_TABS } from "@/constants/all-on-one";
const D = motion.create("div");

interface ContentWorkspaceProps {
  data: any;
  tab: string;
  isGen: boolean;
  setTab: (tab: string) => void;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}

function WorkspaceLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
        <div className="border-t-primary/60 absolute inset-2 animate-spin rounded-full border-2 border-transparent" />
        <div className="bg-primary/10 relative flex h-16 w-16 items-center justify-center rounded-full shadow-inner">
          <Loader2 size={28} className="text-primary animate-spin" />
        </div>
      </div>
      <h3 className="text-foreground mb-2 text-xl font-extrabold tracking-tight">
        Crafting Your Content...
      </h3>
      <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
        Our AI is writing the script, designing the thumbnail, and composing
        your video. This usually takes a minute.
      </p>
    </div>
  );
}

function TimeSlotCard({ slot }: { slot: any }) {
  return (
    <div className="border-border/30 bg-muted/20 rounded-xl border p-4">
      <div className="bg-primary/10 text-primary mb-3 inline-block rounded-lg px-2.5 py-1 text-xs font-bold">
        ⏱ {slot.duration_range}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h5 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-blue-500 uppercase">
            <Video size={11} /> Visuals
          </h5>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {slot.visual_prompt}
          </p>
        </div>
        <div>
          <h5 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-purple-500 uppercase">
            <Mic size={11} /> Voiceover
          </h5>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {slot.voiceover}
          </p>
        </div>
        <div>
          <h5 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-emerald-500 uppercase">
            <Type size={11} /> On-screen Text
          </h5>
          <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
            {slot.on_screen_text ?? "None"}
          </p>
        </div>
        <div>
          <h5 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-amber-500 uppercase">
            <Music size={11} /> Audio FX
          </h5>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {slot.sound_effects}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScriptSectionCard({ section }: { section: any }) {
  if (!section || !section.time_slots) return null;
  return (
    <div className="border-border/40 bg-card rounded-2xl border p-5">
      <h4 className="border-border/40 text-primary mb-4 border-b pb-2.5 text-sm font-bold tracking-wider uppercase">
        {section.section_name}
      </h4>
      <div className="flex flex-col gap-4">
        {section.time_slots.map((slot: any, idx: number) => (
          <TimeSlotCard key={idx} slot={slot} />
        ))}
      </div>
    </div>
  );
}

function VideoLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
        <div className="border-t-primary/60 absolute inset-2 animate-spin rounded-full border-2 border-transparent" />
        <div className="bg-primary/10 relative flex h-16 w-16 items-center justify-center rounded-full shadow-inner">
          <Loader2 size={28} className="text-primary animate-spin" />
        </div>
      </div>
      <h3 className="text-foreground mb-2 text-xl font-extrabold tracking-tight">
        Rendering Your Video…
      </h3>
      <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
        Our AI engine is composing scenes, syncing voiceovers, and applying
        effects. This usually takes a few minutes. Sit back — we&lsquo;ll update
        automatically!
      </p>
    </div>
  );
}

export function ContentWorkspace({
  data,
  tab,
  setTab,
  copied,
  onCopy,
  isGen,
}: ContentWorkspaceProps) {
  if (isGen) {
    return (
      <div className="flex min-w-0 flex-1 flex-col p-4 pt-0 md:p-6 md:pl-0">
        <div className="border-border/40 bg-card flex h-full w-full items-center justify-center rounded-2xl border shadow-sm">
          <WorkspaceLoadingState />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-w-0 flex-1 flex-col p-4 pt-0 md:p-6 md:pl-0">
        <div className="border-border/40 bg-card flex h-full w-full items-center justify-center rounded-2xl border shadow-sm">
          <EmptyState />
        </div>
      </div>
    );
  }

  const { thumbnailUrl, videoUrl, script, status } = data;

  const getMediaUrl = (path: string | null | undefined) => {
    if (!path) return null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_MEDIA_URL || "";
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${cleanBase}${cleanPath}`;
  };

  const fullThumbnailUrl = getMediaUrl(thumbnailUrl);
  const fullVideoUrl = getMediaUrl(videoUrl);

  const isCompleted = status === "Completed";
  const isFailed = status === "Failed";

  const handleDownloadThumbnail = async () => {
    if (!fullThumbnailUrl) return;
    try {
      const response = await fetch(fullThumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AutoTube-Thumbnail-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download thumbnail:", error);
    }
  };

  return (
    <D
      {...fadeIn(0.15)}
      className="mb-15 flex min-w-0 flex-1 flex-col p-4 pt-0 md:p-6 md:pl-0 lg:mb-0"
    >
      <div className="border-border/40 bg-card flex h-full w-full flex-col overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border/40 bg-muted/5 flex shrink-0 flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2.5">
              <h1 className="text-foreground truncate text-lg font-bold tracking-tight md:text-xl">
                Generated Pack
              </h1>
              {isFailed ? (
                <span className="flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-600">
                  <AlertCircle size={10} strokeWidth={2.5} /> Failed
                </span>
              ) : isCompleted ? (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600">
                  <CheckCircle2 size={10} strokeWidth={2.5} /> Completed
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-600">
                  <Loader2 size={10} className="animate-spin" />{" "}
                  {status ?? "Rendering…"}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-[12px] font-medium">
              Script · Thumbnail · Video
            </p>
          </div>
        </div>

        <div className="scrollbar-none border-border/40 bg-muted/5 flex shrink-0 overflow-x-auto border-b px-3 md:px-5">
          <div className="flex gap-1.5">
            {CONTENT_TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`group relative flex cursor-pointer items-center gap-1.5 px-3 py-3.5 text-[13px] font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon
                    size={14}
                    className={
                      active
                        ? "text-primary"
                        : "text-muted-foreground/70 group-hover:text-foreground"
                    }
                  />
                  {t.label}
                  {active && (
                    <motion.div
                      layoutId="allinone-tab-indicator"
                      className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="scrollbar-none bg-background/30 flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <D
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mx-auto max-w-4xl"
            >
              {tab === "script" && script && (
                <div className="space-y-5">
                  <div className="group border-border/40 bg-card relative rounded-2xl border p-5 transition-all hover:shadow-sm">
                    <div className="mb-2.5 flex items-center justify-between">
                      <div className="text-primary flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                        <FileText size={13} /> Smart Description
                      </div>
                      <CopyBtn
                        text={script.smart_description}
                        id="smart-desc"
                        copied={copied}
                        onCopy={onCopy}
                      />
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      {script.smart_description}
                    </p>

                    {script.stats && (
                      <div className="border-border/30 mt-4 flex flex-wrap gap-2 border-t pt-3">
                        {[
                          { label: "Words", value: script.stats.total_words },
                          { label: "Duration", value: script.stats.duration },
                          {
                            label: "Readability",
                            value: script.stats.readability,
                          },
                          { label: "Hook", value: script.stats.hook_strength },
                        ].map((stat) => (
                          <span
                            key={stat.label}
                            className="border-border/40 bg-muted/40 text-muted-foreground rounded-lg border px-2.5 py-1 text-[11px] font-medium"
                          >
                            <span className="text-foreground font-bold">
                              {stat.value}
                            </span>{" "}
                            {stat.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-border/40 bg-card rounded-2xl border p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        Top Hooks
                      </h4>
                      <CopyBtn
                        text={script.top_hooks.join("\n")}
                        id="top-hooks"
                        copied={copied}
                        onCopy={onCopy}
                      />
                    </div>
                    <ul className="flex flex-col gap-3">
                      {script.top_hooks.map((hook: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="bg-primary/10 text-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                            {i + 1}
                          </span>
                          <span className="text-foreground/80">{hook}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {SCRIPT_SECTION_KEYS.map((key) => (
                    <ScriptSectionCard key={key} section={script[key]} />
                  ))}
                </div>
              )}

              {tab === "thumbnails" && (
                <div className="flex flex-col items-center gap-6 pt-4">
                  {fullThumbnailUrl ? (
                    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
                      <div className="border-border/50 relative aspect-video w-full overflow-hidden rounded-2xl border shadow-lg">
                        <Image
                          src={fullThumbnailUrl}
                          alt="AI-generated thumbnail"
                          fill
                          className="object-cover"
                          unoptimized
                          priority
                        />
                      </div>

                      <button
                        onClick={handleDownloadThumbnail}
                        className="bg-primary text-primary-foreground flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:opacity-90 active:scale-95"
                      >
                        <Download size={16} />
                        Download Thumbnail
                      </button>
                    </div>
                  ) : (
                    <div className="border-border/50 flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center opacity-60">
                      <ImageIcon
                        size={44}
                        className="text-muted-foreground mb-3"
                      />
                      <p className="text-muted-foreground text-sm font-medium">
                        Thumbnail is still rendering…
                      </p>
                    </div>
                  )}
                </div>
              )}

              {tab === "video" && (
                <div className="flex flex-col items-center justify-center pt-4">
                  {isCompleted && fullVideoUrl ? (
                    <div className="border-border/50 w-full max-w-3xl overflow-hidden rounded-2xl border bg-black shadow-xl">
                      <video
                        src={fullVideoUrl}
                        controls
                        className="aspect-video w-full outline-none"
                      />
                    </div>
                  ) : isFailed ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                        <AlertCircle size={32} className="text-red-500" />
                      </div>
                      <h3 className="text-foreground mb-2 text-xl font-bold">
                        Video Generation Failed
                      </h3>
                      <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                        Something went wrong during video compositing. Please
                        try generating a new pack.
                      </p>
                    </div>
                  ) : (
                    <VideoLoadingSkeleton />
                  )}
                </div>
              )}
            </D>
          </AnimatePresence>
        </div>
      </div>
    </D>
  );
}
