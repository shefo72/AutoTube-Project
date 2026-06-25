export interface TimeSlot {
  duration_range: string;
  visual_prompt: string;
  voiceover: string;
  on_screen_text: string | null;
  sound_effects: string;
}

export interface ScriptSection {
  section_name: string;
  time_slots: TimeSlot[];
}

export interface ScriptStats {
  total_words: number;
  duration: string;
  readability: string;
  hook_strength: string;
}

export interface AllInOneScript {
  smart_description: string;
  top_hooks: string[];
  hook: ScriptSection;
  introduction: ScriptSection;
  main_content: ScriptSection;
  cta_outro: ScriptSection;
  stats: ScriptStats;
}

export interface ThumbnailEntity {
  id: number;
  prompt: string;
  thumbnailPrompt: string;
  imagePath: string;
  imageProvider: string;
  createdAt: string;
}

export interface ThumbnailWrapper {
  thumbnail: ThumbnailEntity;
}

export interface VideoEntity {
  videoPrompt: string;
  status: string;
}

export type GenerationStatus =
  | "Pending"
  | "Generating Script"
  | "Generating Thumbnail"
  | "Generating Video"
  | "Completed"
  | "Failed";

export interface GenerateAllInOneResponse {
  allInOneId: number;
  status: GenerationStatus;
  script: AllInOneScript;
  thumbnail: ThumbnailWrapper;
  video: VideoEntity;
}

export interface GetAllInOneResponse {
  allInOneId?: number;
  status: GenerationStatus;
  script: AllInOneScript;
  thumbnailUrl?: string;
  thumbnail?: ThumbnailWrapper;
  videoUrl?: string;
  video?: VideoEntity;
}

export interface GenerateAllInOnePayload {
  prompt: string;
  voiceTone: string;
  videoStyle: string;
}
