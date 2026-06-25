"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, Clapperboard, Wand2, X } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type { GenerateVideoRequest } from "@/types/video";

import { useCreditCheck } from "@/hooks/useCreditCheck";

import {
  VideoToneOptions,
  VideoStyleOptions,
  VideoRatioOptions,
  VideoDurationOptions,
} from "@/constants/user-dashboard";

interface VideoConfigProps {
  isGen: boolean;
  onGenerate: (payload: GenerateVideoRequest) => void;
  onStyleChange?: (style: string) => void;

  currentBalance: number;
  onInsufficientCredits: (cost: number) => void;
}

export function VideoConfig({
  isGen,
  onGenerate,
  onStyleChange,
  currentBalance,
  onInsufficientCredits,
}: VideoConfigProps) {
  const [duration, setDuration] = useState("5");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [voiceTone, setVoiceTone] = useState("Energetic");
  const [videoStyle, setVideoStyle] = useState("Cinematic");
  const [prompt, setPrompt] = useState("");

  const [showGuideTip, setShowGuideTip] = useState(true);

  const { validateAction } = useCreditCheck(currentBalance);

  const MAX_CHARS = 3000;
  const MIN_CHARS = 25;

  const handleStyleChange = (style: string) => {
    setVideoStyle(style);
    onStyleChange?.(style);
  };

  const handleGenerateClick = () => {
    if (prompt.length >= MIN_CHARS && !isGen) {
      const durationSeconds = parseInt(duration);
      const { isAllowed, requiredCredits } = validateAction({
        action: "video",
        videoDurationSeconds: durationSeconds,
      });

      if (!isAllowed) {
        onInsufficientCredits(requiredCredits);
        return;
      }

      setShowGuideTip(false);
      onGenerate({
        prompt,
        durationSeconds,
        aspectRatio,
        voiceTone,
        videoStyle,
      });
    }
  };

  return (
    <motion.div {...fadeIn(0.05)} className="flex h-full flex-col gap-3">
      <AnimatePresence>
        {showGuideTip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-primary/10 bg-primary/5 flex items-center justify-between rounded-2xl border px-4 py-2.5">
              <div className="flex items-center gap-3">
                <Wand2 size={14} className="text-primary shrink-0" />
                <p className="text-xs leading-snug text-(--text-dim)">
                  Need cinematic ideas? See our{" "}
                  <Link
                    href="/prompt-guide"
                    target="_blank"
                    className="text-primary font-semibold underline-offset-4 transition-colors hover:underline"
                  >
                    Prompt Guide
                  </Link>
                  .
                </p>
              </div>
              <button
                onClick={() => setShowGuideTip(false)}
                className="hover:bg-surface-2 hover:text-foreground shrink-0 cursor-pointer rounded-md p-1 text-(--text-dim) transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="border-border bg-card flex flex-1 flex-col rounded-2xl border p-5 shadow-sm">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col">
            <div className="mb-2 flex items-end justify-between">
              <div className="text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Video Concept & Prompt
              </div>
              <div
                className={`text-[10px] font-medium transition-colors ${
                  prompt.length >= MAX_CHARS
                    ? "text-red-600"
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
              disabled={isGen}
              placeholder="e.g., A cinematic wide shot of a futuristic city with flying cars, neon lights..."
              className="border-border text-foreground placeholder:text-muted-foreground focus:border-primary min-h-45 w-full resize-y rounded-xl border bg-(--surface-1) p-4 text-sm transition-colors outline-none hover:border-(--surface-4) focus:ring-2 focus:ring-(--ring) disabled:opacity-50"
            />
            {prompt.length > 0 && prompt.length < MIN_CHARS && (
              <p className="mt-2 text-xs font-medium text-red-500">
                Please enter at least {MIN_CHARS} characters.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div className="flex flex-col">
              <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Duration
              </div>
              <CustomSelect
                value={duration}
                onChange={setDuration}
                options={VideoDurationOptions}
                disabled={isGen}
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Ratio
              </div>
              <CustomSelect
                value={aspectRatio}
                onChange={setAspectRatio}
                options={VideoRatioOptions}
                disabled={isGen}
              />
            </div>

            <div className="flex flex-col">
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

            <div className="flex flex-col">
              <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                Video Style
              </div>
              <CustomSelect
                value={videoStyle}
                onChange={handleStyleChange}
                options={VideoStyleOptions}
                disabled={isGen}
              />
            </div>
          </div>

          <div className="mt-auto pt-2">
            <Button
              variant="primary"
              size="lg"
              disabled={prompt.length < MIN_CHARS || isGen}
              onClick={handleGenerateClick}
              className="w-full shadow-md transition-all hover:shadow-lg"
            >
              {isGen ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Rendering Video...
                </>
              ) : (
                <>
                  <Clapperboard size={18} className="mr-2" />
                  Generate Video
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
