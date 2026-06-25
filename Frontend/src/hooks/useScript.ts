"use client";

import { useCallback } from "react";
import { useGenerateScriptMutation } from "@/services/scriptApi";
import type { GenerateScriptRequest } from "@/types/script";

export function useScript() {
  const [
    generateScriptMutation,
    { data, isLoading: isGenerating, error, reset: clearError },
  ] = useGenerateScriptMutation();

  const generateScript = useCallback(
    async (topic: string, tone: string, length: string) => {
      const isShort = length === "15 seconds";

      const payload: GenerateScriptRequest = {
        topic,
        tone,
        length,
        videoType: isShort ? "youtube_short" : "youtube_long",
      };

      try {
        await generateScriptMutation(payload).unwrap();
      } catch (err) {
        console.error("Script Generation Error:", err);
      }
    },
    [generateScriptMutation]
  );

  return {
    data: data ?? null,
    isGenerating,
    error: error ? "Generation failed" : null,
    generateScript,
    clearError,
  };
}
