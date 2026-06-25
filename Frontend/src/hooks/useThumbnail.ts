"use client";

import { useCallback } from "react";
import {
  useGenerateThumbnailMutation,
  useGenerateThumbnailWithImageMutation,
  useDownloadThumbnailMutation,
  useGetUserThumbnailsQuery,
} from "@/services/thumbnailApi";
import { apiSlice } from "@/store/apiSlice";
import { useAppDispatch } from "@/store/index";

export function useThumbnailActions() {
  const dispatch = useAppDispatch();

  const [
    generateMutation,
    {
      data: genData,
      isLoading: isGenerating,
      error: genError,
      reset: resetGen,
    },
  ] = useGenerateThumbnailMutation();

  const [
    generateWithImageMutation,
    {
      data: uploadData,
      isLoading: isUploading,
      error: uploadError,
      reset: resetUpload,
    },
  ] = useGenerateThumbnailWithImageMutation();

  const [
    downloadMutation,
    { isLoading: isDownloading, error: downError, reset: resetDown },
  ] = useDownloadThumbnailMutation();

  const generate = useCallback(
    async (prompt: string, style: string) => {
      try {
        const result = await generateMutation({ prompt, style }).unwrap();
        dispatch(apiSlice.util.invalidateTags(["Thumbnail"]));
        return result;
      } catch {
        return null;
      }
    },
    [generateMutation, dispatch]
  );

  const generateWithImage = useCallback(
    async (formData: FormData) => {
      try {
        const result = await generateWithImageMutation(formData).unwrap();
        dispatch(apiSlice.util.invalidateTags(["Thumbnail"]));
        return result;
      } catch {
        return null;
      }
    },
    [generateWithImageMutation, dispatch]
  );

  const download = useCallback(
    async (id: number, type: string, filename?: string) => {
      try {
        const blob = await downloadMutation({ id, type }).unwrap();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename ?? `thumbnail-${id}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download failed:", err);
      }
    },
    [downloadMutation]
  );

  const clearError = useCallback(() => {
    resetGen();
    resetUpload();
    resetDown();
  }, [resetGen, resetUpload, resetDown]);

  const reset = useCallback(() => {
    resetGen();
    resetUpload();
    resetDown();
  }, [resetGen, resetUpload, resetDown]);

  const activeError = genError || uploadError || downError;

  return {
    data: genData ?? uploadData ?? null,
    isGenerating: isGenerating || isUploading,
    isDownloading,
    error: activeError ? "Something went wrong" : null,
    generate,
    generateWithImage,
    download,
    clearError,
    reset,
  } as const;
}

export function useThumbnailHistory() {
  const {
    data: historyData,
    isLoading: isFetchingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useGetUserThumbnailsQuery();

  return {
    historyData: historyData ?? [],
    isFetchingHistory,
    error: historyError ? "Failed to load thumbnails" : null,
    refetchHistory,
  } as const;
}
