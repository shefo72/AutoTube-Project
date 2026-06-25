"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, FileText, BookText, History, Wand2, X } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

import { useCreditCheck } from "@/hooks/useCreditCheck";

import {
  ScriptToneOptions,
  ScriptLengthOptions,
} from "@/constants/user-dashboard";

interface ScriptConfigProps {
  onGenerate: (topic: string, tone: string, length: string) => void;
  isGenerating: boolean;
  onOpenHistory: () => void;
  currentBalance: number;
  onInsufficientCredits: (cost: number) => void;
}

export function ScriptConfig({
  onGenerate,
  isGenerating,
  onOpenHistory,
  currentBalance,
  onInsufficientCredits,
}: ScriptConfigProps) {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("7 minutes");
  const [showGuideTip, setShowGuideTip] = useState(true);

  const { validateAction } = useCreditCheck(currentBalance);

  const MAX_CHARS = 2000;
  const MIN_CHARS = 25;

  const handleGenerate = () => {
    if (prompt.length >= MIN_CHARS && !isGenerating) {
      const { isAllowed, requiredCredits } = validateAction({
        action: "script",
      });

      if (!isAllowed) {
        onInsufficientCredits(requiredCredits);
        return;
      }

      setShowGuideTip(false);
      onGenerate(prompt, tone, length);
    }
  };

  return (
    <motion.div {...fadeIn(0.05)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex items-center gap-3 px-1">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-inner">
            <FileText size={16} />
          </div>
          <div>
            <h2 className="font-heading text-foreground text-xl font-bold tracking-tight">
              AI Script Studio
            </h2>
            <p className="text-muted-foreground mt-0.5 text-[12px] font-medium">
              Describe your video concept and let AI craft a viral,
              high-retention script.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenHistory}
          className="border-border hover:text-foreground flex cursor-pointer items-center gap-2 rounded-xl border bg-transparent px-4 py-2 text-sm font-medium text-(--text-dim) transition-all hover:bg-(--surface-1) active:scale-95"
        >
          <History size={16} />
          <span className="hidden sm:block">View History</span>
        </button>
      </div>

      <AnimatePresence>
        {showGuideTip && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 4 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="border-primary/10 bg-primary/5 mb-2 flex items-center justify-between rounded-2xl border px-4 py-2.5">
              <div className="flex items-center gap-3">
                <Wand2 size={14} className="text-primary shrink-0" />
                <p className="text-xs text-(--text-dim)">
                  Need ideas? Check our{" "}
                  <Link
                    href="/promptGuide"
                    target="_blank"
                    className="text-primary font-semibold underline-offset-4 transition-colors hover:underline"
                  >
                    Prompt Guide
                  </Link>{" "}
                  for the best formulas.
                </p>
              </div>
              <button
                onClick={() => setShowGuideTip(false)}
                className="hover:text-foreground cursor-pointer rounded-md p-2 text-(--text-dim) transition-colors hover:bg-(--surface-2)"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-border bg-card rounded-2xl border p-5">
        <div className="flex flex-col gap-5">
          {/* ── Textarea Section ── */}
          <div>
            <div className="mb-2 flex items-end justify-between">
              <div className="text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Video Concept & Prompt
              </div>
              <div
                className={`text-[10px] font-medium transition-colors ${
                  prompt.length >= MAX_CHARS
                    ? "text-red-700"
                    : "text-(--text-dim)"
                }`}
              >
                {prompt.length} / {MAX_CHARS}
              </div>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={MAX_CHARS}
              disabled={isGenerating}
              placeholder="e.g., A 60-second video about the hidden benefits of waking up at 5 AM..."
              className="border-border text-foreground placeholder:text-muted-foreground focus:border-primary min-h-30 w-full resize-y rounded-xl border bg-(--surface-1) p-4 text-sm transition-colors outline-none hover:border-(--surface-4) focus:ring-2 focus:ring-(--ring) disabled:opacity-50"
            />
            {prompt.length > 0 && prompt.length < MIN_CHARS && (
              <p className="mt-1.5 text-xs text-red-600">
                Please enter at least {MIN_CHARS} characters.
              </p>
            )}
          </div>

          {/* ── Controls ── */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap">
              <div className="w-full sm:w-fit">
                <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                  Tone
                </div>
                <CustomSelect
                  value={tone}
                  onChange={setTone}
                  options={ScriptToneOptions}
                  disabled={isGenerating}
                />
              </div>

              <div className="w-full sm:w-fit">
                <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                  Length
                </div>
                <CustomSelect
                  value={length}
                  onChange={setLength}
                  options={ScriptLengthOptions}
                  disabled={isGenerating}
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={prompt.length < MIN_CHARS || isGenerating}
              onClick={handleGenerate}
              className="w-full shadow-md transition-all hover:shadow-lg sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Drafting
                  Script...
                </>
              ) : (
                <>
                  <BookText size={16} />
                  Generate Script
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
