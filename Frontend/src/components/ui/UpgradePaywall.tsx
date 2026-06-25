"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  LockKeyhole,
  Zap,
  CheckCircle2,
  ArrowRight,
  BatteryWarning,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PaywallProps {
  variant?: "credits" | "feature";
  featureName?: string;
}

export default function UpgradePaywall({
  variant = "feature",
  featureName = "This feature",
}: PaywallProps) {
  const config = {
    credits: {
      icon: BatteryWarning,
      glowColor: "bg-[#f43f5e]",
      iconColor: "text-[#f43f5e]",
      badgeText: "0 Credits Remaining",
      badgeStyle: "bg-[#f43f5e]/10 border-[#f43f5e]/20 text-[#f43f5e]",
      title: "AI Engine Depleted",
      description:
        "You've used up all your generation power for this billing cycle. Upgrade your engine to keep producing content without limits.",
    },
    feature: {
      icon: LockKeyhole,
      glowColor: "bg-(--primary)",
      iconColor: "text-(--primary)",
      badgeText: "Pro Access Required",
      badgeStyle: "bg-(--primary)/10 border-(--primary)/20 text-(--primary)",
      title: "Premium Tool Locked",
      description: `${featureName} is locked behind the AutoTube Pro plan. Upgrade to unlock advanced workflows and gain an unfair advantage.`,
    },
  };

  const router = useRouter();
  const activeConfig = config[variant];
  const Icon = activeConfig.icon;

  return (
    <div className="relative flex min-h-[80vh] w-full flex-col items-center justify-center p-6">
      <div
        className={`absolute top-1/2 left-1/2 -z-10 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-[120px] transition-colors duration-1000 ${activeConfig.glowColor}`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="border-border bg-glass-bg rounded-card shadow-elevation-md relative w-full max-w-lg overflow-hidden border p-8 backdrop-blur-xl"
      >
        <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-white/20 to-transparent opacity-50" />

        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className={`mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${activeConfig.badgeStyle}`}
          >
            {variant === "feature" ? <Sparkles size={12} /> : <Zap size={12} />}
            {activeConfig.badgeText}
          </div>

          <div className="bg-surface-2 border-border/50 relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border shadow-inner">
            <div
              className={`absolute inset-0 animate-pulse rounded-2xl opacity-20 blur-md ${activeConfig.glowColor}`}
            />
            <Icon
              size={36}
              className={`relative z-10 ${activeConfig.iconColor}`}
            />
          </div>

          <h2 className="font-heading text-foreground mb-2 text-3xl font-black tracking-tight">
            {activeConfig.title}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[90%] text-sm leading-relaxed">
            {activeConfig.description}
          </p>
        </div>

        <div className="bg-surface-1/50 border-border/50 mb-8 space-y-3 rounded-xl border p-5">
          <div className="text-text-dim mb-3 text-[10px] font-bold tracking-widest uppercase">
            AutoTube Pro Unlocks:
          </div>

          {[
            "Unlimited AI Thumbnail Generations",
            "Full-length Video Scripts & Hooks",
            "Competitor Gap Analysis Access",
            "Priority Rendering Speed",
          ].map((feature, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              key={i}
              className="text-foreground flex items-center gap-3 text-sm font-medium"
            >
              <CheckCircle2 size={16} className="text-(--neon-emerald)" />
              {feature}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <Zap
              size={18}
              className="fill-white/20 transition-transform group-hover:scale-110"
            />
            Upgrade to Pro — $29/mo
            <ArrowRight
              size={18}
              className="absolute right-6 -translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            />
          </Button>
          <Button
            onClick={() => {
              router.push("/dashboard");
            }}
            variant="outline"
          >
            Maybe Later
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
