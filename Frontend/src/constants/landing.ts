import {
  Crosshair,
  Sparkles,
  PenTool,
  Image as ImageIcon,
  BarChart3,
  Film,
  Users,
  TrendingUp,
  Clock,
  Eye,
  Wand2,
} from "lucide-react";

export const tools = [
  {
    icon: Crosshair,
    color: "#7C5CFC",
    title: "Gap Analyzer",
    desc: "Identify high-demand, low-competition video ideas using real YouTube metrics.",
    detail:
      "Scan millions of YouTube data points to uncover untapped topics with massive demand and minimal competition. Our AI scores every opportunity from 0-100, factoring in search volume, trend velocity, competition density, and monetisation potential. Filter by niche, language, or audience size to find your next viral hit.",
    to: "/dashboard/gap-analyzer",
  },
  {
    icon: Film,
    color: "#A855F7",
    title: "Video Pack Generator",
    desc: "One click creates a complete, ready-to-upload content package.",
    detail:
      "Generate optimised titles, descriptions, tags, scripts, and thumbnail briefs in one click. Each element is fine-tuned for YouTube's algorithm — SEO-packed, hook-driven, and audience-tested. Export everything as a ready-to-upload content pack.",
    to: "/dashboard/video-generator",
  },
  {
    icon: PenTool,
    color: "#F472B6",
    title: "Script Writer",
    desc: "Generate full, structured video scripts adapted to your style and audience.",
    detail:
      "Leverage advanced large language models like Google Gemini and OpenAI GPT to write structured scripts. The engine customizes the output using configuration parameters from your Content Profile, ensuring the text aligns with your preferred language, style, and tone.",
    to: "/dashboard/script-writer",
  },
  {
    icon: ImageIcon,
    color: "#FBBF24",
    title: "AI Thumbnail Generation",
    desc: "Automatically generate high-quality thumbnails and engaging text hooks.",
    detail:
      "Complete your video package without external tools. The platform generates catchy thumbnail text hooks along with AI-driven visual thumbnails powered by Replicate and Imagen-4 models, matching your video's core topic seamlessly.",
    to: "/dashboard/thumbnails",
  },
  {
    icon: BarChart3,
    color: "#34D399",
    title: "Analytics Dashboard",
    desc: "Track platform activity, usage quotas, and connected channel metrics.",
    detail:
      "Monitor your workflow parameters in real-time. Review your channel performance, track your overall content generations, follow system activity metrics, and manage your usage quotas and API consumption safely within a unified dashboard.",
    to: "/dashboard/analytics",
  },
  {
    icon: Sparkles,
    color: "#8B5CF6",
    title: "All-in-One Workspace",
    desc: "Turn one raw idea into a complete, ready-to-shoot video package in seconds.",
    detail:
      "Eliminate switching between disconnected tools. Enter your topic into the split-view layout to handle data-driven niche analysis and script generation simultaneously. Review, edit, copy, and approve your full automated workflow in a single platform.",
    to: "dashboard/all-on-one",
  },
];

export const testimonials = [
  {
    name: "Ahmed Sherif",
    role: "Tactical Football Analyst · 1.2M subs",
    quote:
      "Finding high-potential content gaps in football trends became an absolute breeze.",
    avatar: "AS",
    color: "#7C5CFC",
  },
  {
    name: "Abdelrahman Osama",
    role: "Business Creator · 610K subs",
    quote:
      "Generating a complete, optimized video pack now takes me seconds instead of hours.",
    avatar: "AO",
    color: "#A855F7",
  },
  {
    name: "Lojain Ramy",
    role: "Lifestyle Creator · 530K subs",
    quote:
      "The personalized content profile makes the AI suggestions align perfectly with my vibe.",
    avatar: "LR",
    color: "#F472B6",
  },
  {
    name: "Reem Hossam",
    role: "Fashion Creator · 690K subs",
    quote:
      "The visual script structuring radically improved my channel's audience retention.",
    avatar: "RH",
    color: "#34D399",
  },
  {
    name: "Rehab Mohamed",
    role: "Productivity Creator · 275K subs",
    quote:
      "Saved me endless hours of tedious keyword research every single week.",
    avatar: "RM",
    color: "#FBBF24",
  },
  {
    name: "Mohamed Hesham",
    role: "Tech Reviewer · 610K subs",
    quote:
      "The composite gap scoring system is a massive unfair advantage for modern creators.",
    avatar: "MH",
    color: "#22D3EE",
  },
  {
    name: "Hassan Elsayed",
    role: "Gaming Creator · 420K subs",
    quote:
      "Managing my automated workflow and project logs is incredibly clean and seamless.",
    avatar: "HE",
    color: "#FB7185",
  },
  {
    name: "Radwa Magdy",
    role: "Podcast Host · 660K subs",
    quote:
      "The AI script writer structures hooks and transitions naturally for long-form shows.",
    avatar: "RM",
    color: "#60A5FA",
  },
  {
    name: "Salsabil Mostafa",
    role: "Aesthetic Vlogger · 710K subs",
    quote:
      "Maintaining a daily posting consistency became effortless with the workspace tools.",
    avatar: "SM",
    color: "#F472B6",
  },
  {
    name: "Rewan Ali",
    role: "Vlog Creator · 240K subs",
    quote:
      "Our channel watch time jumped significantly after implementing the analytics insights.",
    avatar: "RA",
    color: "#2DD4BF",
  },
  {
    name: "Salma Esam",
    role: "Education Creator · 310K subs",
    quote:
      "Finally, an automated script tool that sounds authentic and actually usable for teaching.",
    avatar: "SE",
    color: "#F97316",
  },
  {
    name: "Moaz Abdelsamad",
    role: "Data Science Creator · 470K subs",
    quote:
      "The algorithm behind the niche gap score is beautifully accurate and practical.",
    avatar: "MA",
    color: "#818CF8",
  },
  {
    name: "Mohamed Hammam",
    role: "Motivation Creator · 280K subs",
    quote:
      "The automatic script-to-thumbnail pipeline fits the faceless workflow perfectly.",
    avatar: "MH",
    color: "#4ADE80",
  },
];

export const stats = [
  { icon: Users, value: "15K+", label: "Active creators", color: "#7C5CFC" },
  { icon: Eye, value: "54K", label: "Analyses run", color: "#A855F7" },
  { icon: TrendingUp, value: "25K", label: "Videos made", color: "#34D399" },
  { icon: Clock, value: "35K hrs", label: "Time saved", color: "#F472B6" },
];

export const steps = [
  {
    n: "01",
    title: "Discover Gaps",
    desc: "Enter your niche. AutoTube scans millions of data points to find topics your audience craves.",
    icon: Crosshair,
    color: "#7C5CFC",
  },
  {
    n: "02",
    title: "Generate Content",
    desc: "Generate a complete content package—including scripts, titles, descriptions, videos, and thumbnail hooks—customized to your brand style.",
    icon: Wand2,
    color: "#A855F7",
  },
  {
    n: "03",
    title: "Publish & Grow",
    desc: "Export your content pack, publish, and monitor your channel performance and usage quotas via our analytics dashboard.",
    icon: BarChart3,
    color: "#34D399",
  },
];
