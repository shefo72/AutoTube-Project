"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Image as ImageIcon,
  Loader2,
  Plus,
  Upload,
  Wand2,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { ThumbnailStyleTags } from "@/constants/user-dashboard";
import Link from "next/link";
import { useCreditCheck } from "@/hooks/useCreditCheck";

interface ThumbnailConfigProps {
  query: string;
  onQueryChange: (value: string) => void;

  activeStyle: string;
  onStyleChange: (style: string) => void;
  imagePreview: string | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;

  isGenerating: boolean;
  onGenerate: () => void;

  currentBalance: number;
  onInsufficientCredits: (cost: number) => void;
}

export function ThumbnailConfig({
  query,
  onQueryChange,
  activeStyle,
  onStyleChange,
  imagePreview,
  onImageUpload,
  onImageRemove,
  isGenerating,
  onGenerate,
  currentBalance,
  onInsufficientCredits,
}: ThumbnailConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGuideTip, setShowGuideTip] = useState(true);

  const { validateAction } = useCreditCheck(currentBalance);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      setIsMenuOpen(false);
    }
  };

  const handleGenerateClick = () => {
    const hasReferenceImage = !!imagePreview;

    const { isAllowed, requiredCredits } = validateAction({
      action: "thumbnail",
      hasReferenceImage,
    });

    if (!isAllowed) {
      onInsufficientCredits(requiredCredits);
      return;
    }

    onGenerate();
  };

  return (
    <>
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
                className="hover:bg-surface-2 hover:text-foreground cursor-pointer rounded-md p-2 text-(--text-dim) transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="group bg-card border-border shadow-elevation-sm hover:border-primary/30 hover:shadow-glow-primary-sm focus-within:border-primary/50 focus-within:shadow-glow-primary-md relative rounded-2xl border p-2 transition-all duration-300">
        <div className="bg-surface-1 rounded-xl p-5">
          {/* Image preview  */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="relative mb-4 inline-block"
              >
                <div className="border-border/50 relative h-24 w-32 overflow-hidden rounded-xl border shadow-sm">
                  <Image
                    src={imagePreview}
                    alt="Uploaded preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={onImageRemove}
                  className="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                >
                  <X size={12} strokeWidth={4} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt textarea  */}
          <textarea
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="e.g., Create a viral cinematic YouTube thumbnail about the iPhone 17 review...."
            className="text-foreground placeholder:text-muted-foreground/50 min-h-35 w-full border-none bg-transparent text-sm leading-relaxed outline-none md:text-lg"
          />

          {/* Upload + Model dropdown */}
          <div className="border-border/60 mt-4 flex flex-col items-start justify-between gap-5 border-t pt-5 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative" ref={menuRef}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-bold transition-all ${
                    imagePreview || isMenuOpen
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                      : "border-border bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3"
                  }`}
                >
                  <Plus
                    size={14}
                    className={
                      isMenuOpen
                        ? "rotate-45 transition-transform"
                        : "transition-transform"
                    }
                  />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border-border bg-surface-1 absolute bottom-full left-0 z-50 mb-2 w-56 rounded-xl border p-2 shadow-xl"
                    >
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-foreground hover:bg-surface-2 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      >
                        <Upload size={16} className="text-muted-foreground" />
                        Upload Image
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-border/60 hidden h-6 w-px lg:block" />

              {/* Style tags */}
              <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
                <span className="text-muted-foreground mr-1 hidden text-[10px] font-bold tracking-wider uppercase lg:block">
                  Style
                </span>
                {ThumbnailStyleTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onStyleChange(tag)}
                    className={`cursor-pointer rounded-md border px-2 py-1.5 text-xs font-bold transition-all duration-300 ${
                      activeStyle === tag
                        ? "bg-primary border-primary shadow-glow-primary-sm text-white"
                        : "bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground border-transparent"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={isGenerating || !query.trim()}
              onClick={handleGenerateClick}
              className="w-full shadow-md transition-all hover:shadow-lg sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Rendering Magic...
                </>
              ) : (
                <>
                  <ImageIcon size={18} className="mr-2" />
                  Generate Thumbnail
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
