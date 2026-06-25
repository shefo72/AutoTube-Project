import { FileText, Image, Film } from "lucide-react";

export const SCRIPT_SECTION_KEYS = [
  "hook",
  "introduction",
  "main_content",
  "cta_outro",
] as const;

export const CONTENT_TABS = [
  { key: "script", label: "Script", icon: FileText },
  { key: "thumbnails", label: "Thumbnail", icon: Image },
  { key: "video", label: "Video", icon: Film },
] as const;
