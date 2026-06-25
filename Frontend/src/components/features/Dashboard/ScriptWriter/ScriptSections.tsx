"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  PenTool,
  AlertCircle,
  X,
  Target,
  Keyboard,
  AlignLeft,
  ChevronDown,
  MessageSquare,
  List,
  CheckCircle,
} from "lucide-react";
import { fadeIn } from "@/lib/animations";
import { CopyBtn } from "@/components/ui/CopyBtn";
import { ExportScriptBtn } from "./ExportScriptBtn";
import type { ScriptResponse, ScriptSectionData } from "@/types/script";
import SectionRenderer from "./SectionRenderer";

const D = motion.create("div");

interface ScriptSectionsProps {
  scriptData: ScriptResponse | null;
  isGenerating: boolean;
  error: string | null;
  clearError: () => void;
}

const formatTextContent = (data?: ScriptSectionData | ScriptSectionData[]) => {
  if (!data) return "Content currently unavailable.";

  if (Array.isArray(data)) {
    return data
      .map((chapter, index) => {
        const title = chapter.title || `Chapter ${index + 1}`;
        const visuals =
          chapter.actions_and_visuals || chapter.visual_prompt || "N/A";
        const speech = chapter.presenter_speech || chapter.voiceover || "N/A";
        return `### ${title}\n\n[VISUALS]: ${visuals}\n\n[SPEECH]: ${speech}`;
      })
      .join("\n\n----------------------------------------\n\n");
  }

  const visuals = data.actions_and_visuals || data.visual_prompt || "N/A";
  const speech = data.presenter_speech || data.voiceover || "N/A";
  const text = data.on_screen_text
    ? `\n\n[ON-SCREEN TEXT]: ${data.on_screen_text}`
    : "";
  const sfx = data.sound_effects
    ? `\n\n[SOUND EFFECTS]: ${data.sound_effects}`
    : "";

  return `[VISUALS]: ${visuals}\n\n[SPEECH]: ${speech}${text}${sfx}`;
};

export function ScriptSections({
  scriptData,
  isGenerating,
  error,
  clearError,
}: ScriptSectionsProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["intro", "hook"])
  );
  const [copied, setCopied] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpanded((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const dynamicSections = [];

  if (scriptData) {
    if (scriptData.hook_and_intro) {
      dynamicSections.push({
        id: "intro",
        label: "Hook & Introduction",
        timing: "0:00 - 1:00",
        color: "#8B5CF6",
        icon: MessageSquare,
        content: formatTextContent(scriptData.hook_and_intro),
        rawData: scriptData.hook_and_intro,
      });
    } else if (scriptData.hook) {
      dynamicSections.push({
        id: "hook",
        label: "The Hook",
        timing: "0:00 - 0:05",
        color: "#F43F5E",
        icon: Target,
        content: formatTextContent(scriptData.hook),
        rawData: scriptData.hook,
      });
      if (scriptData.introduction) {
        dynamicSections.push({
          id: "intro",
          label: "Introduction",
          timing: "0:05 - 0:15",
          color: "#8B5CF6",
          icon: MessageSquare,
          content: formatTextContent(scriptData.introduction),
          rawData: scriptData.introduction,
        });
      }
    }

    if (scriptData.main_content) {
      dynamicSections.push({
        id: "main",
        label: "Main Content",
        timing: "Body",
        color: "#3B82F6",
        icon: List,
        content: formatTextContent(scriptData.main_content),
        rawData: scriptData.main_content,
      });
    }

    if (scriptData.cta_outro) {
      dynamicSections.push({
        id: "cta",
        label: "Call to Action & Outro",
        timing: "Outro",
        color: "#10B981",
        icon: CheckCircle,
        content: formatTextContent(scriptData.cta_outro),
        rawData: scriptData.cta_outro,
      });
    }
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {/* error handling */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-border bg-card flex items-center gap-4 rounded-2xl border px-5 py-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <AlertCircle size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <h4 className="text-foreground text-sm font-bold">
                  Writer&apos;s Block (System Error)
                </h4>
                <p className="text-muted-foreground text-sm font-medium">
                  {error}
                </p>
              </div>
              <button
                onClick={clearError}
                className="text-muted-foreground hover:bg-surface-2 hover:text-foreground ml-2 shrink-0 cursor-pointer rounded-xl p-2 transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <D {...fadeIn(0.1)} className="pt-2">
        {/* blank */}
        {!isGenerating && !scriptData && (
          <div className="border-border bg-surface-1/50 flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
            <div className="bg-surface-2 text-muted-foreground/50 mb-5 flex h-20 w-20 items-center justify-center rounded-full shadow-inner">
              <FileText size={36} strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-foreground text-xl font-bold">
              The Blank Page Awaits
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
              Enter your video concept above. The AI will structure a viral
              hook, engaging intro, and high-retention script sections.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                key="skeleton-gen"
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-surface-1 border-border relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border py-24 md:py-32"
              >
                <div className="bg-surface-2 border-border/50 shadow-glow-primary-sm relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-md">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <PenTool size={28} className="text-primary/80" />
                  </motion.div>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
                  <h3 className="font-heading text-foreground text-xl font-bold md:text-2xl">
                    Drafting the Narrative...
                  </h3>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Keyboard size={14} className="animate-pulse" />
                    <span>Optimizing hooks and writing scenes</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/*Top Hooks & Titles */}
          {!isGenerating && scriptData && (
            <>
              <motion.div {...fadeIn(0.2)}>
                <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
                  <div className="border-border bg-muted/10 flex items-center justify-between gap-1 border-b px-3 py-4 md:px-6">
                    <div>
                      <h2 className="text-foreground text-sm font-bold">
                        Video SEO & Metadata
                      </h2>
                      <p className="mt-0.5 text-[11px] font-medium text-(--text-dim)">
                        Optimized description and hook variations
                      </p>
                    </div>
                    <ExportScriptBtn
                      scriptTitle="AutoTube_Script"
                      sections={dynamicSections}
                      metadata={
                        scriptData
                          ? {
                              description:
                                scriptData.description_data.video_description,
                              hooks:
                                scriptData.description_data
                                  .top_5_hook_sentences,
                            }
                          : undefined
                      }
                    />
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="group border-border/50 hover:border-border relative flex flex-col rounded-2xl border bg-(--surface-1) p-5 transition-colors">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                              <AlignLeft size={14} strokeWidth={2.5} />
                            </div>
                            <span className="text-foreground text-xs font-bold tracking-wide uppercase">
                              Smart Description
                            </span>
                          </div>
                          <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <CopyBtn
                              text={
                                scriptData.description_data.video_description
                              }
                              id="seo-desc"
                              copied={copied}
                              onCopy={copy}
                            />
                          </div>
                        </div>
                        <p className="text-[14px] leading-[1.7] text-(--secondary-foreground)">
                          {scriptData.description_data.video_description}
                        </p>
                      </div>

                      <div className="group border-border/50 hover:border-border relative flex flex-col rounded-2xl border bg-(--surface-1) p-6 transition-colors">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
                              <Target size={16} />
                            </div>
                            <span className="text-foreground text-[13px] font-bold tracking-wide uppercase">
                              Top Hooks & Titles
                            </span>
                          </div>
                          <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <CopyBtn
                              text={scriptData.description_data.top_5_hook_sentences.join(
                                "\n"
                              )}
                              id="seo-hooks"
                              copied={copied}
                              onCopy={copy}
                            />
                          </div>
                        </div>
                        <ul className="flex flex-col gap-4">
                          {scriptData.description_data.top_5_hook_sentences.map(
                            (grabber, index) => (
                              <li
                                key={index}
                                className="group/item flex items-start gap-3.5 rounded-lg transition-colors"
                              >
                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EF4444]/10 text-[14px] font-bold text-[#EF4444]">
                                  {index + 1}
                                </div>
                                <span className="group-hover/item:text-foreground text-[14px] leading-[1.6] text-(--secondary-foreground) transition-colors">
                                  {grabber}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Script Sections */}
              <motion.div {...fadeIn(0.25)}>
                <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
                  <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                    <div className="text-foreground text-sm font-bold">
                      Script Sections
                    </div>
                  </div>
                  {dynamicSections.map((section, idx) => {
                    const open = expanded.has(section.id);
                    const Icon = section.icon;

                    return (
                      <div
                        key={section.id}
                        style={{
                          borderBottom:
                            idx < dynamicSections.length - 1
                              ? "1px solid var(--border)"
                              : "none",
                        }}
                      >
                        <div
                          role="button"
                          onClick={() => toggle(section.id)}
                          className="flex w-full cursor-pointer items-center gap-3 border-none px-5 py-4 text-left transition-colors hover:bg-(--hover-overlay)"
                          style={{
                            background: open
                              ? "var(--subtle-overlay)"
                              : "transparent",
                          }}
                        >
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                            style={{
                              background: `${section.color}12`,
                              border: `1px solid ${section.color}20`,
                            }}
                          >
                            <Icon size={14} color={section.color} />
                          </div>
                          <div className="flex-1">
                            <span className="text-foreground text-sm font-semibold">
                              {section.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {open && (
                              <div onClick={(e) => e.stopPropagation()}>
                                <CopyBtn
                                  text={section.content}
                                  id={section.id}
                                  copied={copied}
                                  onCopy={copy}
                                />
                              </div>
                            )}
                            <motion.div
                              animate={{ rotate: open ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={14} color="var(--text-dim)" />
                            </motion.div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pt-2 pb-5 md:px-6 md:pb-6">
                                <SectionRenderer
                                  data={section.rawData}
                                  videoType={scriptData.video_type}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </D>
    </div>
  );
}
