"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  CreditCard as CardIcon,
  Crosshair,
  Sparkles,
  Film,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Calendar,
  Nfc,
  CreditCard,
  PenTool,
  Coins,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Tooltip } from "@/components/ui/tooltip";
import type { Subscription, UsageStats, PaymentMethod } from "@/types/billing";

interface BillingTabProps {
  onShowPayment: () => void;
  subscription: Subscription | null;
  usage: UsageStats | null;
  paymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function BillingTab({
  onShowPayment,
  subscription,
  usage,
  paymentMethod,
  isLoading,
  error,
  refetch,
}: BillingTabProps) {
  const dynamicUsageData = usage
    ? [
        {
          label: "Gap Analyses",
          used: usage.gapAnalysesUsed,
          color: "#3B82F6",
          icon: Crosshair,
        },
        {
          label: "Analytics",
          used: usage.analyticsUsed,
          color: "#10B981",
          icon: BarChart3,
        },
        {
          label: "Script Generations",
          used: usage.scriptGenerationsUsed,
          color: "#A855F7",
          icon: PenTool,
        },
        {
          label: "Thumbnail Generations",
          used: usage.thumbnailGenerationsUsed,
          color: "#F472B6",
          icon: ImageIcon,
        },
        {
          label: "Video Generations",
          used: usage.videoGenerationsUsed,
          color: "#EF4444",
          icon: Film,
        },

        {
          label: "All-In-One",
          used: usage.allInOneGenerationsUsed,
          color: "#F59E0B",
          icon: Sparkles,
        },
      ]
    : [];

  const router = useRouter();
  const go = (path: string) => router.push(path);

  // Loading State
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-surface-1 border-border h-32 rounded-2xl border" />
        <div className="bg-surface-1 border-border h-28 rounded-2xl border" />
        <div className="bg-surface-1 border-border h-64 rounded-2xl border" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="border-border bg-surface-1/30 flex flex-col items-center justify-center rounded-4xl border py-20 text-center shadow-sm backdrop-blur-sm">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 shadow-inner">
          <AlertCircle size={32} strokeWidth={2} />
        </div>
        <h3 className="font-heading text-foreground text-lg font-bold">
          Billing Data Unavailable
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm font-medium">
          {error}
        </p>
        <button
          onClick={refetch}
          className="bg-surface-2 text-foreground hover:bg-surface-3 mt-6 cursor-pointer rounded-full px-6 py-2.5 text-xs font-bold transition-all duration-300 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Current Plan */}
          <div className="from-primary via-neon-pink to-neon-amber shadow-glow-primary-sm relative overflow-hidden rounded-2xl bg-linear-to-br p-px">
            <div className="bg-card relative h-full w-full rounded-2xl p-5 sm:p-6 md:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Crown size={20} className="text-neon-amber shrink-0" />
                    <span className="text-foreground truncate text-xl font-extrabold tracking-tight">
                      {subscription?.planName || "Pro"} Plan
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                        subscription?.status === "Active"
                          ? "bg-neon-amber/10 border-neon-amber/20 text-neon-amber"
                          : "border-red-500/20 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {subscription?.status || "Unknown"}
                    </span>
                  </div>

                  {subscription?.startDate && subscription?.endDate && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-(--text-dim) opacity-80 sm:text-[13px]">
                      <Calendar size={14} className="shrink-0" />
                      <span>
                        {new Date(subscription.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                        {" - "}
                        {new Date(subscription.endDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                  <div className="text-foreground font-mono text-3xl font-black tracking-tighter sm:text-4xl">
                    {subscription?.price}
                    <span className="text-sm font-medium text-(--text-dim) sm:text-base">
                      {subscription?.billingCycle === "Monthly"
                        ? "/mo"
                        : subscription?.billingCycle === "Yearly"
                          ? "/yr"
                          : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => go("/payment")}
                    className="bg-foreground text-background flex h-9 w-full cursor-pointer items-center justify-center rounded-xl px-5 text-[12px] font-bold transition-all hover:opacity-90 sm:w-auto"
                  >
                    Manage Plan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card border-border rounded-2xl border p-5 sm:p-6">
            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-foreground text-sm font-bold">
                Payment Method
              </div>
              <div className="flex w-full items-center gap-3 sm:w-auto">
                {paymentMethod?.success !== false && (
                  <Tooltip content="Securely update your payment details">
                    <button
                      onClick={onShowPayment}
                      className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 flex h-8 flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 text-[11px] font-medium transition-all sm:flex-none"
                    >
                      Update Card
                    </button>
                  </Tooltip>
                )}
                <Tooltip content="Sync latest billing data">
                  <button
                    onClick={refetch}
                    disabled={isLoading}
                    className="bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground flex h-8 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-[11px] font-bold transition-all active:scale-95 disabled:opacity-50 sm:flex-none"
                  >
                    <RefreshCw
                      size={14}
                      className={isLoading ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                </Tooltip>
              </div>
            </div>

            {paymentMethod?.success !== false ? (
              <div className="border-border hover:border-primary/40 flex flex-col items-start gap-4 rounded-2xl border bg-(--surface-1) p-5 transition-all duration-300 hover:shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(124,92,252,0.18)] bg-[rgba(124,92,252,0.1)] shadow-inner sm:h-14 sm:w-14">
                  <CardIcon size={24} color="#7C5CFC" />
                </div>

                <div className="w-full min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-foreground truncate text-[12px] font-bold tracking-wider uppercase sm:text-[13px]">
                      {paymentMethod?.cardHolderName || "CARDHOLDER NAME"}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {paymentMethod?.paymentProvider && (
                        <div className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                          {paymentMethod.paymentProvider}
                        </div>
                      )}
                      <div className="bg-surface-2 rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest text-(--text-dim) uppercase">
                        Exp {paymentMethod?.expiryDate || "--/--"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-2 sm:mt-4">
                    <div className="flex items-center gap-2 font-mono text-[13px] sm:text-[15px]">
                      <span className="tracking-[0.2em] text-(--text-dim)">
                        <span className="hidden sm:inline">•••• •••• </span>
                        ••••
                      </span>
                      <span className="text-foreground shrink-0 font-bold tracking-wider">
                        {paymentMethod?.cardLast4 || "****"}
                      </span>
                    </div>

                    <div className="shrink-0">
                      <Nfc
                        size={20}
                        strokeWidth={1.5}
                        className="text-(--text-dim) opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-border flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-(--surface-1)/40 p-8 text-center sm:p-10">
                <div className="bg-surface-2 flex h-14 w-14 items-center justify-center rounded-full shadow-inner">
                  <CreditCard size={28} className="text-(--text-dim)" />
                </div>
                <div>
                  <h4 className="text-foreground text-[14px] font-bold">
                    No payment method added
                  </h4>
                  <p className="mt-1 max-w-sm text-[12px] font-medium text-(--text-dim)">
                    Add a credit or debit card to unlock seamless billing and
                    manage your subscriptions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Usage Stats */}
          {/* Usage Stats */}
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-6 sm:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                backgroundSize: "2rem 2rem",
              }}
            />

            <div className="relative z-10 mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="text-foreground text-sm font-bold tracking-tight">
                  Lifetime Usage
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-(--text-dim)">
                  <Sparkles size={12} className="opacity-70" />
                  Your total generated content & remaining credits
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* 1. Feature Cards (Without Progress Bar) */}
              {dynamicUsageData.map((u, i) => {
                return (
                  <motion.div
                    key={u.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="group border-border hover:border-border/80 relative overflow-hidden rounded-xl border bg-(--surface-1) p-5 transition-all duration-300 hover:shadow-sm"
                  >
                    <div
                      className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                      style={{ background: u.color }}
                    />

                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background: `${u.color}15`,
                          border: `1px solid ${u.color}30`,
                          color: u.color,
                        }}
                      >
                        <u.icon size={18} strokeWidth={2} />
                      </div>

                      <div className="flex-1">
                        <div className="text-foreground text-[13px] font-semibold tracking-tight">
                          {u.label}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-foreground font-mono text-[16px] font-bold">
                          {u.used}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* 2. Credits Remaining Card (Full Width with Progress Bar) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="group border-border hover:border-primary/30 relative overflow-hidden rounded-xl border bg-(--surface-1) p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,92,252,0.1)] sm:p-6 lg:col-span-2"
              >
                <div
                  className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                  style={{ background: "#7C5CFC" }}
                />

                <div className="mb-5 flex items-center gap-4">
                  <div className="border-primary/30 bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                    <Coins size={22} strokeWidth={2} />
                  </div>

                  <div className="flex-1">
                    <div className="text-foreground text-[15px] font-bold tracking-tight">
                      Credits Remaining
                    </div>
                    <div className="mt-0.5 text-[12px] font-medium text-(--text-dim)">
                      Available balance for future generations
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-foreground font-mono text-xl font-black">
                      {usage?.creditsRemaining || 0}
                      <span className="mx-1 text-sm font-medium text-(--text-dim)">
                        /
                      </span>
                      {usage?.creditsGranted || 0}
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Credits */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-(--surface-2) shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: usage?.creditsGranted
                        ? `${(usage.creditsRemaining / usage.creditsGranted) * 100}%`
                        : "0%",
                    }}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 bottom-0 left-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(124,92,252,0.4) 0%, #7C5CFC 100%)",
                      boxShadow: "0 0 15px rgba(124,92,252,0.5)",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
