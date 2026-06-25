import {
  HelpCircle,
  CreditCard,
  Rocket,
  Shield,
  Settings,
  MessageCircle,
} from "lucide-react";

export const categories = [
  {
    id: "general",
    label: "Getting Started",
    icon: HelpCircle,
    color: "#7C5CFC",
    description: "Learn the basics & setup your workspace",
  },
  {
    id: "pricing",
    label: "Billing & Plans",
    icon: CreditCard,
    color: "#A855F7",
    description: "Manage subscriptions, invoices & upgrades",
  },
  {
    id: "features",
    label: "Platform Features",
    icon: Rocket,
    color: "#F472B6",
    description: "Explore AI generation & analytics tools",
  },
  {
    id: "security",
    label: "Security & Privacy",
    icon: Shield,
    color: "#34D399",
    description: "Data protection & compliance details",
  },
  {
    id: "account",
    label: "Account Management",
    icon: Settings,
    color: "#FBBF24",
    description: "Update profile, team & preferences",
  },
  {
    id: "support",
    label: "Help & Support",
    icon: MessageCircle,
    color: "#22D3EE",
    description: "Contact us & find troubleshooting guides",
  },
];

export const faqData: Record<string, { q: string; a: string }[]> = {
  general: [
    {
      q: "What exactly is AutoTube?",
      a: "AutoTube is an AI-powered YouTube growth workspace. It helps creators discover untapped content gaps, generate full video packages (titles, descriptions, tags, and scripts), and analyze performance—all from a single dashboard. Think of it as your AI content strategist.",
    },
    {
      q: "Who is AutoTube built for?",
      a: "AutoTube is designed for YouTube creators at every stage. Whether you're a beginner hunting for your first viral topic, or an established channel managing multiple weekly uploads. We also offer an Agency plan for teams managing multiple channels.",
    },
    {
      q: "How does the Gap Analyzer actually work?",
      a: "Our AI scans millions of YouTube data points in real-time. It analyzes search volume, trend velocity, and competition density to surface high-demand, low-competition topics. Each topic receives a 0-100 score, instantly highlighting the best opportunities in your niche.",
    },
    {
      q: "Do I need an active YouTube channel to start?",
      a: "Not at all! Many creators use AutoTube to research niches, validate ideas, and plan their entire content strategy before even launching their channel or publishing their first video.",
    },
    {
      q: "Is there a free tier available?",
      a: "Yes. Our Starter plan is completely free forever. It includes 5 gap analyses per month, 3 video packs, and basic script generation. No credit card required.",
    },
  ],
  pricing: [
    {
      q: "What pricing plans do you offer?",
      a: "We offer three tiers: Starter (Free), Pro ($29/mo), and Agency ($99/mo). Each plan scales with your production needs. All paid plans are backed by a 14-day money-back guarantee.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Absolutely. There are no long-term contracts or hidden fees. You can cancel directly from your billing settings, and you'll retain full access until the end of your current billing cycle.",
    },
    {
      q: "Is there a discount for annual billing?",
      a: "Yes! Choosing an annual plan saves you 20% compared to monthly billing. The Pro plan becomes $278/year (saving $70), and the Agency plan is $950/year (saving $238).",
    },
    {
      q: "Which payment methods are accepted?",
      a: "We accept all major credit and debit cards (Visa, Mastercard, AMEX), as well as PayPal. Agency plans also have the option for bank transfers. All transactions are securely processed via Stripe.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a strict, no-questions-asked 14-day money-back guarantee on all paid plans. If AutoTube isn't the right fit, simply contact our support team within your first two weeks for a full refund.",
    },
  ],
  features: [
    {
      q: "What is included in a generated 'Video Pack'?",
      a: "Every Video Pack delivers an SEO-optimized title, a detailed description with timestamps, strategic tags, a retention-focused script, and a visual thumbnail brief featuring color psychology insights—all customized to your specific niche.",
    },
    {
      q: "How natural does the AI Script Writer sound?",
      a: "Our Script Writer is trained on retention patterns from top-performing YouTube content. It automatically structures your script with strong hooks, pattern interrupts, and strategic CTAs. You have full control over the tone, length, and format.",
    },
    {
      q: "Can I export my generated content?",
      a: "Yes. All your scripts, titles, and metadata can be exported as text files, PDFs, or copied instantly to your clipboard. Pro and Agency users also get API access for advanced automation workflows.",
    },
    {
      q: "Does AutoTube integrate directly with YouTube?",
      a: "Yes! We provide a Chrome extension that pre-fills your YouTube Studio upload page with your AutoTube-generated metadata. Agency users have access to our direct YouTube Studio API integration.",
    },
    {
      q: "How fresh is the analytical data?",
      a: "To ensure you're acting on the latest trends, our Gap Analyzer data is refreshed every 6 hours. Analytics dashboards for connected channels update in real-time.",
    },
  ],
  security: [
    {
      q: "How secure is my data on AutoTube?",
      a: "Security is our top priority. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure runs on AWS with SOC 2 Type II compliance. We absolutely never sell or share your data.",
    },
    {
      q: "Do you store my YouTube password?",
      a: "Never. We use secure OAuth 2.0 for YouTube authentication. We don't see or store your credentials, and you can revoke AutoTube's access directly from your Google Security settings at any time.",
    },
    {
      q: "Who has access to my content strategies?",
      a: "Only you. Your research, gap analyses, and generated content are completely private. If you're on the Agency plan, you can explicitly grant controlled, role-based access to your team members.",
    },
    {
      q: "Is AutoTube GDPR compliant?",
      a: "Yes, fully. You can request a complete data export or trigger a permanent account deletion straight from your settings. Check our transparent Privacy Policy for full details on how we handle data.",
    },
  ],
  account: [
    {
      q: "How do I upgrade my current plan?",
      a: "Navigate to Settings → Billing in your dashboard and click 'Upgrade'. The new limits will be applied instantly, and we will automatically pro-rate the cost for your current billing cycle.",
    },
    {
      q: "Can I change my account email?",
      a: "Yes. Go to Settings → Account Management to update your email address. We'll send a quick verification link to the new address to confirm the switch.",
    },
    {
      q: "How can I permanently delete my account?",
      a: "Go to Settings → Account Management and select 'Delete Account'. Warning: This permanently erases all your data, analyses, and saved content. Please export your work before confirming.",
    },
    {
      q: "Can I collaborate with my team?",
      a: "Yes, Team Workspaces are included in the Agency plan. You can invite unlimited team members, assign specific roles, and manage permissions—ideal for agencies and larger production teams.",
    },
  ],
  support: [
    {
      q: "How do I reach the support team?",
      a: "Starter users have full access to our community Discord. Pro users receive priority email support (typically answering in under 4 hours). Agency users get a dedicated account manager and 24/7 live chat.",
    },
    {
      q: "Where can I find guides and tutorials?",
      a: "We maintain a detailed knowledge base at docs.autotube.io filled with step-by-step guides and best practices. We also post weekly strategy tutorials on our own YouTube channel.",
    },
    {
      q: "How do I report a bug or issue?",
      a: "Click the '?' icon in the bottom-right of your dashboard to use the in-app feedback widget, or drop a message in our Discord's #bug-reports channel. We generally acknowledge reports within 2 hours.",
    },
    {
      q: "Can I request a new feature?",
      a: "Absolutely! Submit your ideas via the in-app widget or visit our public roadmap at roadmap.autotube.io. You can vote on other users' requests, and the most popular ones get fast-tracked into development.",
    },
  ],
};
