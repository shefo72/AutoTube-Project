"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { plansData } from "@/constants/PricingPlans";
import { fadeUp } from "@/lib/animations";

export function Pricing() {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  return (
    <section
      className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
      id="pricing"
    >
      <motion.div {...fadeUp(0)} className="mb-14 text-center">
        <div className="rounded-pill mb-5 inline-flex items-center gap-2 border border-(--border-active) bg-(--accent) px-3 py-1">
          <div className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span className="text-[10px] font-bold tracking-widest text-(--accent-foreground) uppercase">
            Pricing
          </span>
        </div>
        <h2
          className="font-heading text-foreground mb-3 font-extrabold tracking-tight"
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
        >
          Simple, transparent pricing.
        </h2>
        <p className="text-muted-foreground">No hidden fees. Cancel anytime.</p>
      </motion.div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        {plansData.map((plan, i) => (
          <motion.div
            key={plan.name}
            {...fadeUp(i * 0.08)}
            className={`bg-card rounded-card relative overflow-hidden border p-7 transition-all duration-300 hover:-translate-y-1 ${
              plan.popular
                ? "shadow-glow-primary-sm border-(--border-active)"
                : "border-border hover:shadow-(--shadow-elevation-md)"
            }`}
          >
            {plan.popular && (
              <>
                <div
                  className="absolute inset-x-0 top-0 h-0.5"
                  style={{ background: "var(--gradient-aurora)" }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "var(--gradient-subtle)" }}
                />
              </>
            )}
            <div className="relative">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                  {plan.name}
                </span>
                {plan.popular && (
                  <span className="rounded-pill bg-(--accent) px-2 py-0.5 text-[9px] font-bold tracking-wide text-(--accent-foreground) uppercase">
                    Popular
                  </span>
                )}
              </div>
              <p className="mb-4 text-[11px] text-(--text-dim)">
                {plan.description}
              </p>
              <div className="mb-5 flex items-baseline gap-1">
                <span
                  className="text-foreground font-mono font-extrabold tracking-tighter"
                  style={{ fontSize: "clamp(36px, 4vw, 44px)" }}
                >
                  {plan.price}
                </span>
                <span className="text-sm text-(--text-dim)">{plan.period}</span>
              </div>
              <Button
                variant={plan.popular ? "primary" : "secondary"}
                size="md"
                fullWidth
                onClick={() => go(plan.to)}
                iconRight={<ArrowRight size={13} />}
                className="mb-5 rounded-md"
              >
                {plan.name === "Agency" ? "Contact sales" : "Get started"}
              </Button>
              <div className="bg-border mb-4 h-px" />
              <div className="space-y-2.5">
                {plan.features.map((f) => {
                  if (!f.included) return null;

                  return (
                    <div key={f.text} className="flex items-center gap-2.5">
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          plan.popular
                            ? "bg-primary"
                            : "bg-(--hover-overlay-md)"
                        }`}
                      >
                        <Check
                          size={8}
                          color={
                            plan.popular ? "white" : "var(--muted-foreground)"
                          }
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {f.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
