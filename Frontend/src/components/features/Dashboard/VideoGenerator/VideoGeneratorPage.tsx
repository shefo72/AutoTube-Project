"use client";

import { useState, useEffect } from "react";
import { History, Video } from "lucide-react";
import { toast } from "sonner";
import { VideoConfig } from "./VideoConfig";
import { VideoPreview } from "./VideoPreview";
import { GenerationHistoryModal } from "./GenerationHistoryModal";
import { InsufficientCreditsModal } from "@/components/ui/InsufficientCreditsModal";
import { useUsageCredits } from "@/services/billingApi";
import {
  useGenerateVideoMutation,
  useGetVideoStatusQuery,
  useDownloadVideoMutation,
} from "@/services/videoApi";
import type { GenerateVideoRequest } from "@/types/video";

export function VideoGeneratorPage() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [lastCompletedVideoId, setLastCompletedVideoId] = useState<
    number | null
  >(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [videoStyle, setVideoStyle] = useState("Cinematic");

  // ─── Credit Guard State ───
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [requiredCost, setRequiredCost] = useState(0);

  const { creditsGranted, totalUsed } = useUsageCredits();

  const currentBalance = creditsGranted - totalUsed;

  const handleInsufficientCredits = (cost: number) => {
    setRequiredCost(cost);
    setIsCreditModalOpen(true);
  };

  const [generateVideo, { isLoading: isStartingGen, error: genError }] =
    useGenerateVideoMutation();
  const [downloadVideo, { isLoading: isDownloading }] =
    useDownloadVideoMutation();

  const { data: statusData, error: statusError } = useGetVideoStatusQuery(
    activeJobId!,
    {
      skip: !activeJobId,
      pollingInterval: activeJobId ? 30000 : 0,
    }
  );

  useEffect(() => {
    if (statusError) {
      setTimeout(() => {
        setActiveJobId(null);
        setPreviewError(
          "Failed to reach the server while checking video status."
        );
        toast.error("Lost connection while checking video status.");
      }, 0);
      return;
    }

    if (!statusData || !activeJobId) return;
    const status = statusData.toLowerCase();

    if (status === "completed" || status === "failed") {
      const currentId = activeJobId;

      setTimeout(() => {
        setActiveJobId(null);

        if (status === "completed") {
          setLastCompletedVideoId(currentId);

          downloadVideo(currentId)
            .unwrap()
            .then((res) => {
              if (res.downloadUrl) setActiveVideoUrl(res.downloadUrl);
            })
            .catch((err) => console.error("Failed to fetch preview URL", err));

          toast.success("Video generated successfully!");
        } else {
          setPreviewError("Video generation failed on the server.");
          toast.error("Video generation failed.");
        }
      }, 0);
    }
  }, [statusData, activeJobId, statusError, downloadVideo]);

  const handleGenerate = async (payload: GenerateVideoRequest) => {
    try {
      setLastCompletedVideoId(null);
      setActiveVideoUrl(null);
      setPreviewError(null);

      const response = await generateVideo(payload).unwrap();

      toast.success("Generation started! This usually takes about 4 minutes.");
      setActiveJobId(response.videoGenerationId);
    } catch (error) {
      toast.error("Failed to start video generation.");
      setPreviewError("Failed to connect to rendering engine.");
      console.error(error);
    }
  };

  const handleDownloadPreview = async () => {
    if (activeVideoUrl) {
      window.open(activeVideoUrl, "_blank");
      toast.success("Download started!");
      return;
    }

    if (!lastCompletedVideoId) return;
    const toastId = `download-preview-${lastCompletedVideoId}`;
    try {
      toast.loading("Preparing download link...", { id: toastId });
      const response = await downloadVideo(lastCompletedVideoId).unwrap();

      if (response.downloadUrl) {
        window.open(response.downloadUrl, "_blank");
        toast.success("Download started!", { id: toastId });
      } else {
        toast.error("Download URL is invalid.", { id: toastId });
      }
    } catch {
      toast.error("Failed to fetch download link.", { id: toastId });
    }
  };

  const isGenerating = isStartingGen || activeJobId !== null;
  const isCompleted = lastCompletedVideoId !== null;

  return (
    <div className="bg-background flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 py-6 md:px-8 lg:py-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="mb-5 flex items-center gap-3 px-1">
            <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner">
              <Video size={18} />
            </div>
            <div>
              <h2 className="font-heading text-foreground text-xl font-bold tracking-tight">
                AI Video Studio
              </h2>
              <p className="text-muted-foreground mt-0.5 text-xs leading-snug font-medium">
                Describe your vision and adjust settings to generate stunning AI
                videos.
              </p>
            </div>
          </div>
          <div className="mb-6 flex items-center justify-end">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="border-border hover:text-foreground hover:bg-surface-1 flex cursor-pointer items-center gap-2 rounded-xl border bg-transparent px-4 py-2 text-sm font-medium text-(--text-dim) transition-all active:scale-95"
            >
              <History size={16} />
              <span className="hidden sm:block">View History</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-6 md:gap-8 lg:flex-row">
          <div className="flex w-full flex-col lg:w-[35%] xl:w-1/3">
            <VideoConfig
              isGen={isGenerating}
              onGenerate={handleGenerate}
              onStyleChange={setVideoStyle}
              currentBalance={currentBalance}
              onInsufficientCredits={handleInsufficientCredits}
            />
          </div>

          <div className="flex w-full flex-col lg:w-[65%] xl:w-2/3">
            <VideoPreview
              isCompleted={isCompleted}
              isGenerating={isGenerating}
              isDownloading={isDownloading}
              videoUrl={activeVideoUrl}
              error={
                genError
                  ? "Failed to connect to rendering engine."
                  : previewError
              }
              clearError={() => setPreviewError(null)}
              onDownload={handleDownloadPreview}
              activeStyle={videoStyle}
            />
          </div>
        </div>
      </div>

      <GenerationHistoryModal
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
