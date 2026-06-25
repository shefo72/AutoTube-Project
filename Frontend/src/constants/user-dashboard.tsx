import {
  Clock,
  MonitorPlay,
  Mic,
  Palette,
  Crosshair,
  Sparkles,
  Image,
  PenTool,
} from "lucide-react";

// =================================== Dashboard Page ===================================

export const tools = [
  {
    icon: Crosshair,
    label: "Gap Analyzer",
    desc: "Find untapped topics",
    path: "/dashboard/gap-analyzer",
    color: "#7C5CFC",
    hot: true,
  },

  {
    icon: PenTool,
    label: "Script Writer",
    desc: "AI-powered scripts",
    path: "/dashboard/script-writer",
    color: "#F472B6",
    hot: false,
  },
  {
    icon: Image,
    label: "Thumbnails",
    desc: "Eye-catching designs",
    path: "/dashboard/thumbnails",
    color: "#FBBF24",
    hot: false,
  },
  {
    icon: Sparkles,
    label: "All-in-One",
    desc: "Complete video pack",
    path: "/dashboard/content-generator",
    color: "#A855F7",
    hot: false,
  },
];

// =================================== Thumbnails Page ===================================
export const ThumbnailStyleTags = [
  "High Contrast",
  "Cyberpunk",
  "Minimalist",
  "Clickbait Face",
];

// =================================== Script Page ===================================
export const ScriptToneOptions = [
  { value: "Professional", label: "Professional" },
  { value: "Conversational", label: "Conversational" },
  { value: "Entertaining", label: "Entertaining" },
  { value: "Educational", label: "Educational" },
];

export const ScriptLengthOptions = [
  { value: "15 seconds", label: "Short Video (5 - 15 sec)" },
  { value: "7 minutes", label: "Medium Video (1 - 7 min)" },
  { value: "20 minutes", label: "Long Video (7 - 20 min)" },
];

// =================================== Video Page ===================================
export const VideoDurationOptions = [
  { value: "5", label: "5 Seconds", icon: <Clock size={14} /> },
  { value: "10", label: "10 Seconds", icon: <Clock size={14} /> },
  { value: "15", label: "15 Seconds", icon: <Clock size={14} /> },
  { value: "20", label: "20 Seconds", icon: <Clock size={14} /> },
  { value: "25", label: "25 Seconds", icon: <Clock size={14} /> },
  { value: "30", label: "30 Seconds", icon: <Clock size={14} /> },
];

export const VideoRatioOptions = [
  { value: "16:9", label: "16:9 (Landscape)", icon: <MonitorPlay size={14} /> },
  { value: "9:16", label: "9:16 (Portrait)", icon: <MonitorPlay size={14} /> },
  { value: "1:1", label: "1:1 (Square)", icon: <MonitorPlay size={14} /> },
  { value: "4:3", label: "4:3 (Standard)", icon: <MonitorPlay size={14} /> },
  { value: "3:4", label: "3:4 (Vertical)", icon: <MonitorPlay size={14} /> },
];

export const VideoToneOptions = [
  { value: "Energetic", label: "Energetic", icon: <Mic size={14} /> },
  { value: "Professional", label: "Professional", icon: <Mic size={14} /> },
  { value: "Narrator", label: "Narrator", icon: <Mic size={14} /> },
  { value: "Motivational", label: "Motivational", icon: <Mic size={14} /> },
  { value: "Calm", label: "Calm", icon: <Mic size={14} /> },
];

export const VideoStyleOptions = [
  { value: "Cinematic", label: "Cinematic", icon: <Palette size={14} /> },
  { value: "Documentary", label: "Documentary", icon: <Palette size={14} /> },
  { value: "Futuristic", label: "Futuristic", icon: <Palette size={14} /> },
  { value: "Realistic", label: "Realistic", icon: <Palette size={14} /> },
  { value: "Anime", label: "Anime", icon: <Palette size={14} /> },
  { value: "Luxury", label: "Luxury", icon: <Palette size={14} /> },
  { value: "Sports", label: "Sports", icon: <Palette size={14} /> },
];
