export interface GenerateVideoRequest {
  prompt: string;
  durationSeconds: number;
  aspectRatio: string;
  voiceTone: string;
  videoStyle: string;
}

export interface GenerateVideoResponse {
  videoGenerationId: number;
  status: string;
  message: string;
}

export interface VideoHistoryItem {
  id: number;
  prompt: string;
  durationSeconds: number;
  aspectRatio: string;
  voiceTone: string;
  videoStyle: string;
  generationStatus: "Processing" | "Completed" | "Failed" | string;
  generatedVideoUrl: string | null;
  createdAt: string;
}

export interface VideoDownloadResponse {
  downloadUrl: string;
}
