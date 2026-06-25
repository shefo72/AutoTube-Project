import {
  Users,
  Target,
  Zap,
  Heart,
  Globe,
  Award,
  Rocket,
  Star,
  TrendingUp,
  Shield,
  Sparkles,
  BarChart3,
  Lightbulb,
  Code,
  Cpu,
  BrainCircuit,
  PenTool,
  Megaphone,
  Compass,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaBehanceSquare,
  FaGlobe,
} from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const ourStory = [
  {
    year: "2023",
    title: "The Spark",
    desc: "Frustrated by guesswork, we started building the tool we wished existed.",
    icon: Lightbulb,
    color: "#FBBF24",
  },
  {
    year: "2024",
    title: "Launch Day",
    desc: "AutoTube launched publicly. 5,000 creators signed up in the first week.",
    icon: Rocket,
    color: "#7C5CFC",
  },
  {
    year: "2024",
    title: "10K Milestone",
    desc: "Hit 10,000 active users. Added Script Writer and Thumbnail Concepts.",
    icon: TrendingUp,
    color: "#A855F7",
  },
  {
    year: "2025",
    title: "Series A",
    desc: "Raised $8M to expand our AI capabilities and hire world-class engineers.",
    icon: Award,
    color: "#34D399",
  },
  {
    year: "2025",
    title: "50K Creators",
    desc: "50,000+ creators trust AutoTube. Launched Agency plans and API access.",
    icon: Users,
    color: "#F472B6",
  },
  {
    year: "2026",
    title: "Gap Analyzer v2",
    desc: "Next-gen AI with 3x accuracy. Real-time trend detection across 140+ countries.",
    icon: Sparkles,
    color: "#22D3EE",
  },
];

export const values = [
  {
    icon: Target,
    color: "#7C5CFC",
    title: "Creator-First",
    desc: "Every feature we build starts with one question: will this help creators grow faster?",
  },
  {
    icon: Zap,
    color: "#A855F7",
    title: "Speed Matters",
    desc: "We ship fast, iterate faster. Weekly releases ensure you always have cutting-edge tools.",
  },
  {
    icon: Heart,
    color: "#F472B6",
    title: "Radical Transparency",
    desc: "Open roadmap, public changelog, honest pricing. No dark patterns, no hidden fees.",
  },
  {
    icon: Shield,
    color: "#34D399",
    title: "Trust & Privacy",
    desc: "Your data is yours. SOC 2 compliant, GDPR ready, and we never sell your information.",
  },
  {
    icon: Globe,
    color: "#FBBF24",
    title: "Global by Default",
    desc: "Supporting creators in 140+ countries with multi-language AI and localised insights.",
  },
  {
    icon: Code,
    color: "#22D3EE",
    title: "Built in the Open",
    desc: "Our community shapes our product. Feature requests, bug reports, and feedback drive everything.",
  },
];

export const teamMembers = [
  {
    name: "Ahmed Sherif",
    role: "CEO & Frontend Developer",
    avatar: "AS",
    color: "#14B8A6",
    icon: FaReact,
    bio: "Leading the vision and writing the code. Obsessed with pushing the limits of React to build premium, pixel-perfect experiences.",
    socials: [
      { icon: FaGithub, url: "https://github.com/shefo72" },
      { icon: FaLinkedin, url: "https://www.linkedin.com/in/ahmed-sherif-eg/" },
      {
        icon: FaGlobe,
        url: "https://ahmed-sherif-portfolio-gules.vercel.app/",
      },
    ],
  },
  {
    name: "Edin Hazard",
    role: "Head of Marketing",
    avatar: "EH",
    color: "#3B82F6",
    icon: Megaphone,
    bio: "Drives our global growth strategy and brand partnerships. Ensures AutoTube reaches the creators who need it most.",
    socials: [
      { icon: FaInstagram, url: "https://www.instagram.com/hazardeden_10" },
      { icon: FaFacebook, url: "https://www.facebook.com/edenhazard" },
      { icon: FaXTwitter, url: "https://x.com/hazardeden10" },
    ],
  },
  {
    name: "Salsabil Mostafa",
    role: "Backend Developer",
    avatar: "SM",
    color: "#059669",
    icon: Cpu,
    bio: "Specializes in secure authentication flows, microservices, and optimizing server response times.",
    socials: [
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/salsabil-mostafa/",
      },
    ],
  },
  {
    name: "Reem Hossam",
    role: "Backend Developer",
    avatar: "RH",
    color: "#34D399",
    icon: Cpu,
    bio: "Builds robust APIs and manages server architecture to keep AutoTube running at lightning speed.",
    socials: [
      { icon: FaGithub, url: "https://github.com/reemhossam95" },
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/reem-hossam-9684a8252/",
      },
    ],
  },
  {
    name: "Abdelrahman Osama",
    role: "UI/UX Designer",
    avatar: "AO",
    color: "#F472B6",
    icon: PenTool,
    bio: "Brings a unique artistic vision to the platform, ensuring every interaction feels intuitive and premium.",
    socials: [
      { icon: FaLinkedin, url: "https://www.linkedin.com/in/osos30bba931a/" },
      { icon: FaBehanceSquare, url: "https://www.behance.net/ABDeLRaHmanosos" },
    ],
  },
  {
    name: "Hassan Elsayed",
    role: "AI & Data Engineer",
    avatar: "HE",
    color: "#60A5FA",
    icon: BrainCircuit,
    bio: "Analyzes YouTube trends and builds the core mathematical models behind our powerful Gap Analyzer.",
    socials: [
      { icon: FaGithub, url: "https://github.com/Hassan7701" },
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/hassan-el-sayed-mis/",
      },
    ],
  },
  {
    name: "Rewan Ali",
    role: "Frontend Developer",
    avatar: "RA",
    color: "#6366F1",
    icon: FaReact,
    bio: "Focuses on micro-interactions, animations, and bringing the AutoTube dashboard to life.",
    socials: [
      { icon: FaGithub, url: "https://github.com/rewanAli333" },
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/rewan-ali-580176266/",
      },
    ],
  },
  {
    name: "Lojain Ramy",
    role: "Frontend Developer",
    avatar: "LR",
    color: "#8B5CF6",
    icon: FaReact,
    bio: "Translates complex logic into buttery smooth interfaces and pixel-perfect responsive layouts.",
    socials: [
      { icon: FaGithub, url: "https://github.com/lojainramy" },
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/lojain-ramy-ab8002345/",
      },
    ],
  },
  {
    name: "Radwa Magdy",
    role: "Backend Developer",
    avatar: "RM",
    color: "#10B981",
    icon: Cpu,
    bio: "Ensures seamless integration between our core engines and handles complex database queries.",
    socials: [
      { icon: FaGithub, url: "https://github.com/radwa-magdy" },
      { icon: FaLinkedin, url: "https://www.linkedin.com/in/radwamagdy/" },
    ],
  },
  {
    name: "Mohamed Hesham",
    role: "Backend Developer",
    avatar: "MH",
    color: "#14B8A6",
    icon: Cpu,
    bio: "Manages our AWS architecture. Ensures AutoTube scales effortlessly to handle millions of requests.",
    socials: [
      { icon: FaGithub, url: "https://github.com/moh995-hesham" },
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/mohamed-hesham-3b388930a/",
      },
    ],
  },
  {
    name: "Moaz Abdelsamad",
    role: "AI & Data Engineer",
    avatar: "MA",
    color: "#60A5FA",
    icon: BrainCircuit,
    bio: "Architects scalable data pipelines to process and clean real-time metrics from global YouTube APIs.",
    socials: [
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/moaz-abdelsamad-758b01267/",
      },
    ],
  },
  {
    name: "Rehab Mohamed",
    role: "UI/UX Designer",
    avatar: "RM",
    color: "#EC4899",
    icon: PenTool,
    bio: "Crafts beautiful wireframes, user flows, and prototypes focusing on creator-first accessibility.",
    socials: [
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/rehab-mohamed-00a2292a4/",
      },
    ],
  },
  {
    name: "Salma Esam",
    role: "AI & Data Engineer",
    avatar: "SE",
    color: "#D97706",
    icon: BrainCircuit,
    bio: "Turns raw, complex datasets into actionable insights and visually stunning analytics reports.",
    socials: [
      { icon: FaLinkedin, url: "#" },
      { icon: FaGithub, url: "#" },
    ],
  },
  {
    name: "Mohamed Hammam",
    role: "Frontend Developer",
    avatar: "MH",
    color: "#F87171",
    icon: FaReact,
    bio: "Bridges the gap between data and UI, ensuring real-time analytics render flawlessly for our users.",
    socials: [{ icon: FaLinkedin, url: "#" }],
  },
  {
    name: "Alen Halilovic",
    role: "Product Manager",
    avatar: "AH",
    color: "#F97316",
    icon: Compass,
    bio: "Maps out the product roadmap and user journeys. Bridges the gap between user feedback and engineering execution.",
    socials: [
      { icon: FaInstagram, url: "https://www.instagram.com/alen_halilovic/" },
      {
        icon: FaFacebook,
        url: "https://www.facebook.com/ALEN.HALILOVIC.OFFICIAL.PAGE",
      },
      { icon: FaXTwitter, url: "https://x.com/AlenHalilovic" },
    ],
  },
];

export const impactStats = [
  { value: "50K+", label: "Active Creators", icon: Users, color: "#7C5CFC" },
  { value: "2.4M", label: "Analyses Run", icon: BarChart3, color: "#A855F7" },
  { value: "140+", label: "Countries", icon: Globe, color: "#34D399" },
  { value: "4.9/5", label: "Average Rating", icon: Star, color: "#FBBF24" },
];
