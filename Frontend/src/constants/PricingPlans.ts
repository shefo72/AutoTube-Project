export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  ctaText: string;
  features: PlanFeature[];
  popular?: boolean;
  to: string;
}

export const plansData: PricingPlan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "Forever",
    description: "For creators getting started",
    ctaText: "Get Started",
    popular: false,
    to: "/signup",
    features: [
      { text: "50 AI Credits Included", included: true },
      { text: "≈ 5 Scripts or 10 Thumbnails", included: true },
      { text: "AI Video Generation (1 credit/sec)", included: true },
      { text: "Standard Generation Speed", included: true },
      { text: "Community Support", included: true },
      { text: "Advanced Analytics", included: false },
      { text: "Multi-Channel Management", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$39.99",
    period: "/month",
    description: "For growing YouTube creators",
    ctaText: "Upgrade to Pro",
    popular: true,
    to: "/payment",
    features: [
      { text: "300 AI Credits / month", included: true },
      { text: "≈ 10 All-in-One Video Packs", included: true },
      { text: "Access to All AI Tools", included: true },
      { text: "Full Analytics Dashboard", included: true },
      { text: "Priority Processing Queue", included: true },
      { text: "Priority Email Support", included: true },
      { text: "Team Collaboration", included: false },
    ],
  },
  {
    name: "Premium",
    price: "$199.99",
    period: "/year",
    description: "For agencies and marketing teams",
    ctaText: "Contact Sales",
    popular: false,
    to: "/contact",
    features: [
      { text: "2000 AI Credits / year", included: true },
      { text: "Best value (Save over 35%)", included: true },
      { text: "Multi-Channel Management", included: true },
      { text: "Team Collaboration Tools", included: true },
      { text: "Client Workspaces", included: true },
      { text: "Advanced Analytics Reports", included: true },
      { text: "Dedicated Success Manager", included: true },
    ],
  },
];
