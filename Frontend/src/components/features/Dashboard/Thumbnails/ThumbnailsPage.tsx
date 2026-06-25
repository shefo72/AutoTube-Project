"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, History, AlertCircle, X } from "lucide-react";

import { fadeIn } from "@/lib/animations";
import { useThumbnailActions } from "@/hooks/useThumbnail";
import { ThumbnailHistoryModal } from "./ThumbnailHistoryModal";
import { ThumbnailConfig } from "./ThumbnailConfig";
import { ThumbnailResults } from "./ThumbnailResults";
import { InsufficientCreditsModal } from "@/components/ui/InsufficientCreditsModal";
import type { UIThumbnail } from "@/types/thumbnail";
import { useUsageCredits } from "@/services/billingApi";

const D = motion.create("div");

export function ThumbnailsPage() {
  // Config state
  const [query, setQuery] = useState("");
  const [activeStyle, setActiveStyle] = useState("High Contrast");

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileObjectUrl = useRef<string | null>(null);

  // UI state
  const [results, setResults] = useState<UIThumbnail[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // ─── Credit Guard State ───
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [requiredCost, setRequiredCost] = useState(0);

  const { creditsGranted, totalUsed } = useUsageCredits();

  const currentBalance = creditsGranted - totalUsed;

  const handleInsufficientCredits = (cost: number) => {
    setRequiredCost(cost);
    setIsCreditModalOpen(true);
  };

  const {
    isGenerating,
    isDownloading,
    error,
    generate,
    generateWithImage,
    clearError,
  } = useThumbnailActions();

  const handleImageUpload = (file: File) => {
    if (fileObjectUrl.current) URL.revokeObjectURL(fileObjectUrl.current);

    const url = URL.createObjectURL(file);
    fileObjectUrl.current = url;
    setUploadedImage(file);
    setImagePreview(url);
  };

  const handleImageRemove = () => {
    if (fileObjectUrl.current) {
      URL.revokeObjectURL(fileObjectUrl.current);
      fileObjectUrl.current = null;
    }
    setUploadedImage(null);
    setImagePreview(null);
  };

  const handleGenerate = async () => {
    if (!query.trim() || isGenerating) return;
    clearError();

    if (uploadedImage) {
      const formData = new FormData();
      formData.append("Prompt", query.trim());
      formData.append("Image", uploadedImage);

      const result = await generateWithImage(formData);
      if (!result) return;

      const newThumb: UIThumbnail = {
        id: result.id,
        prompt: result.prompt,
        imagePath: result.generatedImagePath,
        style: activeStyle,
        isUploaded: true,
        isCached: false,
        type: "uploaded",
      };
      setResults([newThumb]);
    } else {
      const resultArray = await generate(query.trim(), activeStyle);
      if (!resultArray || !Array.isArray(resultArray)) return;

      const newThumbs: UIThumbnail[] = resultArray.map((res) => ({
        id: res.id,
        prompt: res.prompt,
        imagePath: res.imagePath,
        style: res.style,
        isUploaded: false,
        isCached: res.isCached,
        type: res.type as "fresh" | "cached",
      }));

      setResults(newThumbs);
    }
  };

  return (
    <div className="bg-background flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-8 p-5 md:p-8">
        <D {...fadeIn(0.05)} className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-1">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-inner">
              <ImagePlus size={16} />
            </div>
            <div>
              <h2 className="font-heading text-foreground text-xl font-bold tracking-tight">
                Thumbnail Studio
              </h2>
              <p className="text-muted-foreground mt-0.5 text-[12px] font-medium">
                Describe your vision and let AI craft the perfect click-magnet.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="border-border hover:text-foreground hover:bg-surface-1 flex cursor-pointer items-center gap-2 rounded-xl border bg-transparent px-4 py-2 text-sm font-medium text-(--text-dim) transition-all active:scale-95"
          >
            <History size={16} />
            <span className="hidden sm:block">View History</span>
          </button>
        </D>

        <D {...fadeIn(0.1)}>
          <ThumbnailConfig
            query={query}
            onQueryChange={setQuery}
            activeStyle={activeStyle}
            onStyleChange={setActiveStyle}
            imagePreview={imagePreview}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            currentBalance={currentBalance}
            onInsufficientCredits={handleInsufficientCredits}
          />
        </D>

        {/* Error banner  */}
        <AnimatePresence>
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
                    Something went wrong
                  </h4>
                  <p className="text-muted-foreground text-sm font-medium">
                    {error}
                  </p>
                </div>
                <button
                  onClick={clearError}
                  className="text-muted-foreground hover:bg-surface-2 hover:text-foreground ml-2 shrink-0 cursor-pointer rounded-xl p-2 transition-all active:scale-95"
                >
                  <X />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <D {...fadeIn(0.15)}>
          <ThumbnailResults
            results={results}
            activeStyle={activeStyle}
            isGenerating={isGenerating}
            isDownloading={isDownloading}
          />
        </D>
      </div>

      <ThumbnailHistoryModal
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* ── Credit Guard Modal ── */}
      <InsufficientCreditsModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        requiredCredits={requiredCost}
        currentBalance={currentBalance}
      />
    </div>
  );
}
