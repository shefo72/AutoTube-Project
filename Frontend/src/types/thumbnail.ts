export interface GenerateThumbnailRequest {
  prompt: string;
  style: string;
}

export interface ThumbnailData {
  id: number;
  prompt: string;
  style: string;
  imagePath: string;
  aiProvider: string;
  reuseCount: number;
  downloadCount: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface CachedThumbnailResponse extends ThumbnailData {
  isCached: true;
  type: "cached";
  message: string;
}

export interface FreshThumbnailResponse extends ThumbnailData {
  isCached: false;
  type: "fresh";
  message: string;
}

export type GenerateThumbnailResponse =
  | CachedThumbnailResponse
  | FreshThumbnailResponse;

export interface UploadedThumbnailResponse {
  id: number;
  prompt: string;
  originalImagePath: string;
  generatedImagePath: string;
  aiProvider: string;
  createdAt: string;
}
export interface UIThumbnail {
  id: number;
  prompt: string;
  imagePath: string;
  style: string;
  isCached: boolean;
  isUploaded: boolean;
  type: "fresh" | "cached" | "uploaded";
}
export interface ThumbnailHistoryItem {
  id: number;
  prompt : string ;
  thumbnailUrl: string;
  createdAt: string;
  type: string;
}

export function normalizeThumbnailResponse(
  raw: unknown
): GenerateThumbnailResponse[] | null {
  if (!raw || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const results: GenerateThumbnailResponse[] = [];

  if (record.freshThumbnail) {
    results.push(record.freshThumbnail as FreshThumbnailResponse);
  }
  
  if (record.cachedThumbnail) {
    results.push(record.cachedThumbnail as CachedThumbnailResponse);
  }

  if (results.length > 0) return results;

  if ("id" in record && "imagePath" in record) {
    return [record as unknown as GenerateThumbnailResponse];
  }

  if (record.data) return normalizeThumbnailResponse(record.data);
  if (record.thumbnail) return normalizeThumbnailResponse(record.thumbnail);

  return null;
}
