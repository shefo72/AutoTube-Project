"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Wand2, X } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import { useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  VideoToneOptions,
  VideoStyleOptions,
} from "@/constants/user-dashboard";
import Link from "next/link";
import { useCreditCheck } from "@/hooks/useCreditCheck";

const D = motion.create("div");
const MAX_CHARS = 1000;

interface PromptConfigProps {
  input: string;
  setInput: (v: string) => void;
  isGen: boolean;
  onGenerate: (prompt: string, tone: string, style: string) => void;
  currentBalance: number;
  onInsufficientCredits: (cost: number) => void;
}

export function PromptConfig({
  input,
  setInput,
  isGen,
  onGenerate,
  currentBalance,
  onInsufficientCredits,
}: PromptConfigProps) {
  const [voiceTone, setVoiceTone] = useState("Energetic");
  const [videoStyle, setVideoStyle] = useState("Cinematic");

  const [showGuideTip, setShowGuideTip] = useState(true);

  const { validateAction } = useCreditCheck(currentBalance);

  const handleGenerateClick = () => {
    if (input.trim() && !isGen) {
      const { isAllowed, requiredCredits } = validateAction({
        action: "all-in-one",
      });

      if (!isAllowed) {
        onInsufficientCredits(requiredCredits);
        return;
      }

      onGenerate(input, voiceTone, videoStyle);
    }
  };

  return (
    <div className="flex shrink-0 flex-col gap-6 p-4 md:w-80 md:p-6 lg:w-90">
      <D {...fadeIn(0.05)} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-bold tracking-tight">
              AI Studio
            </h2>
            <p className="text-muted-foreground text-xs font-medium">
              Generate complete packs
            </p>
          </div>
        </div>
        <AnimatePresence>
          {showGuideTip && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 4 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="border-primary/10 bg-primary/5 flex items-center justify-between rounded-2xl border px-4 py-2.5">
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
                    </Link>
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
        <div className="border-border/60 bg-card space-y-5 rounded-2xl border p-5 shadow-sm">
          {/* Prompt */}
          <div>
            <div className="mb-2 flex items-end justify-between">
              <div className="text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Video Concept
              </div>
              <div className="text-[10px] font-medium text-(--text-dim)">
                {input.length} / {MAX_CHARS}
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_CHARS}
              placeholder="Describe your video idea..."
              disabled={isGen}
              className="border-border text-foreground placeholder:text-muted-foreground focus:border-primary min-h-30 w-full resize-none rounded-xl border bg-(--surface-1) p-4 text-sm transition-colors outline-none"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Voice Tone
              </div>
              <CustomSelect
                value={voiceTone}
                onChange={setVoiceTone}
                options={VideoToneOptions}
                disabled={isGen}
              />
            </div>
            <div>
              <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Video Style
              </div>
              <CustomSelect
                value={videoStyle}
                onChange={setVideoStyle}
                options={VideoStyleOptions}
                disabled={isGen}
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateClick}
            disabled={isGen || !input.trim()}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-sm disabled:opacity-50"
            style={{
              background: "var(--gradient-aurora)",
              backgroundSize: "200% 200%",
              animation: "at-gradient-shift 4s ease infinite",
            }}
          >
            {isGen ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={16} />
                </motion.div>
                Generating Pack...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Content Pack
              </>
            )}
          </motion.button>
        </div>
      </D>
    </div>
  );
}
