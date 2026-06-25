import {
  Database,
  Share2,
  Shield,
  Lock,
  User,
  FileText,
  CreditCard,
  Terminal,
  AlertTriangle,
} from "lucide-react";

export const LEGAL_CONTENT = {
  privacy: [
    {
      id: "data-collection",
      title: "Data Collection & Connected Accounts",
      icon: Database,
      tldr: "We collect basic account info and YouTube metadata to generate your video packs.",
      content:
        "When you use AutoTube, we collect information necessary to provide our automation services. This includes your account details, billing information, and YouTube channel metadata obtained securely via Google OAuth. We also log your search queries, content prompts, and token usage to operate the Content Gap Analyzer and deliver tailored video scripts and thumbnails.",
    },
    {
      id: "data-sharing",
      title: "AI Processing & Third Parties",
      icon: Share2,
      tldr: "We share prompts with our AI partners to create your content, but we never sell your data.",
      content:
        "Your privacy is our priority. We do not sell your personal data. To generate your video packs and fetch analytics, we share specific, anonymized inputs (such as search keywords and style prompts) with our trusted API partners, including OpenAI, Google Gemini, Replicate (Imagen-4), and YouTube Data APIs. These partners are strictly bound by their respective privacy agreements.",
    },
    {
      id: "user-rights",
      title: "Your Rights & Content Ownership",
      icon: User,
      tldr: "You own the content you generate. You can disconnect your channel at any time.",
      content:
        "You retain full ownership of the generated video packs, scripts, and thumbnails you produce using AutoTube. You have complete control over your data; you can export your generated content, revoke YouTube OAuth access, or request full account and data deletion directly from your profile settings at any time.",
    },
    {
      id: "security",
      title: "Security & Token Protection",
      icon: Lock,
      tldr: "We secure your account and YouTube tokens using enterprise-grade encryption.",
      content:
        "We implement robust security measures to protect your system data and connected channel tokens. This includes JWT (JSON Web Tokens) for session security, bcrypt for password hashing, and encrypted database storage. While we follow industry best practices to secure our infrastructure, you are responsible for maintaining the confidentiality of your login credentials.",
    },
  ],
  terms: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: FileText,
      tldr: "By using AutoTube, you agree to these rules and our workflow processes.",
      content:
        "These Terms of Service establish a legally binding agreement between you and AutoTube. By registering an account, connecting your YouTube channel, or utilizing our AI generators, you confirm that you have read, understood, and agree to these terms. If you do not agree, please discontinue use immediately.",
    },
    {
      id: "acceptable-use",
      title: "Acceptable Content & Use Policy",
      icon: Shield,
      tldr: "Do not use our AI to generate harmful content or violate YouTube's policies.",
      content:
        "You agree to use AutoTube exclusively for lawful digital content creation. You are strictly prohibited from using our AI text and image generation models to produce malicious, harassing, misleading, or copyrighted content. Furthermore, your generated content must comply with YouTube's Community Guidelines. We reserve the right to terminate accounts that violate these rules.",
    },
    {
      id: "subscription-billing",
      title: "Subscriptions, Quotas & Credits",
      icon: CreditCard,
      tldr: "Plans are billed periodically, and extra usage is covered by Pay-Per-Use credits.",
      content:
        "AutoTube operates on a Freemium and subscription basis. Paid plans (such as Creator Pro or Agency) grant specific monthly quotas for Gap Analyses and Video Packs. Subscriptions renew automatically unless canceled before the billing cycle ends. Additional generations beyond your plan's limit are billed via Pay-Per-Use credits, which are non-refundable.",
    },
    {
      id: "api-usage",
      title: "Fair Usage & System Limits",
      icon: Terminal,
      tldr: "We track usage via tokens to ensure the platform stays fast for everyone.",
      content:
        "To ensure platform stability and manage API costs, your usage of the AI Content Generation and YouTube Data analysis features is monitored through a strict token and quota system. Attempting to bypass these technical limitations, scraping our endpoints, or artificially inflating API requests will result in immediate account suspension.",
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: AlertTriangle,
      tldr: "We help you create content, but we don't guarantee YouTube virality.",
      content:
        "AutoTube provides AI-generated content and gap analysis 'as is'. While our data-driven algorithms are designed to optimize performance, we do not guarantee channel growth, specific viewer metrics, or YouTube monetization. We are not liable for any account strikes, loss of revenue, or algorithm changes implemented by YouTube as a result of publishing content generated on our platform.",
    },
  ],
};
