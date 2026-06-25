"use client";

import { useGetSecureImageQuery } from "@/services/thumbnailApi";

interface UseProtectedImageResult {
  blobUrl: string | null;
  isLoading: boolean;
  error: boolean;
}

export function useThumbnailImage(imagePath: string | null): UseProtectedImageResult {
  const { data: base64Image, isLoading, isError } = useGetSecureImageQuery(imagePath ?? "", {
    skip: !imagePath,
  });

  return { 
    blobUrl: base64Image || null, 
    isLoading, 
    error: isError 
  };
}