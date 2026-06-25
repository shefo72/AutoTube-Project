export interface GenerateScriptRequest {
  topic: string;
  tone: string;
  length: string;
  videoType: string;
}

export interface ScriptSectionData {
  title?: string;
  presenter_speech?: string;
  actions_and_visuals?: string;
  visual_prompt?: string;
  voiceover?: string;
  on_screen_text?: string;
  sound_effects?: string;
  content?: string;
}

export interface ScriptResponse {
  video_type: string;
  description_data: {
    video_description: string;
    top_5_hook_sentences: string[];
  };
  hook_and_intro?: ScriptSectionData;
  hook?: ScriptSectionData;
  introduction?: ScriptSectionData;
  main_content: ScriptSectionData | ScriptSectionData[];
  cta_outro: ScriptSectionData;
  stats: {
    total_words: number;
    duration: string;
    readability: string;
    hook_strength: number;
  };
}

export interface ScriptHistoryItem {
  id: number;
  gapReportId: number;
  topic: string;
  rawJson: string;
  createdAt: string;
}

export type ScriptHistoryResponse = ScriptHistoryItem[];
