import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { goals } from "@/constants/onboarding";
import { stepAnimation } from "@/lib/animations";
import { useSubmitGoalsMutation } from "@/services/onboardingApi";

interface StepGoalsProps {
  selGoals: Set<string>;
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepGoals({
  selGoals,
  onToggle,
  onNext,
  onBack,
}: StepGoalsProps) {
  const [submitGoals, { isLoading }] = useSubmitGoalsMutation();

  const handleNext = async () => {
    try {
      await submitGoals({ goals: Array.from(selGoals) }).unwrap();
      onNext();
    } catch (error) {
      console.error("Failed to submit goals:", error);
    }
  };

  return (
    <motion.div {...stepAnimation}>
      <div className="mb-7">
        <h2
          className="text-foreground m-0 mb-2 leading-[1.2] font-extrabold tracking-[-0.03em]"
          style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
        >
          What are your goals?
        </h2>
        <p className="m-0 text-sm text-(--text-dim)">
          Select everything you want to achieve with AutoTube.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-2">
        {goals.map((g) => {
          const sel = selGoals.has(g.id);
          const Icon = g.icon;
          return (
            <motion.button
              key={g.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggle(g.id)}
              className="rounded-button flex w-full cursor-pointer items-center gap-3 px-4 py-3.25 text-left transition-all"
              style={{
                border: `1px solid ${sel ? "rgba(99,102,241,0.35)" : "var(--border)"}`,
                background: sel ? "rgba(99,102,241,0.06)" : "var(--surface-1)",
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-all"
                style={{
                  background: sel ? "var(--accent)" : "var(--hover-overlay)",
                  border: `1px solid ${sel ? "var(--border-active)" : "var(--border)"}`,
                }}
              >
                <Icon
                  size={13}
                  color={sel ? "var(--primary-hover)" : "var(--text-dim)"}
                />
              </div>
              <span
                className="flex-1 text-sm"
                style={{
                  fontWeight: sel ? 500 : 400,
                  color: sel ? "var(--foreground)" : "var(--muted-foreground)",
                }}
              >
                {g.label}
              </span>
              {sel && (
                <div className="bg-primary flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full">
                  <Check size={10} color="white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onBack}
          className="border-border text-muted-foreground rounded-button flex h-11.5 cursor-pointer items-center gap-1.5 border bg-transparent px-4.5 text-sm font-medium transition-all hover:border-(--surface-4)"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <motion.button
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={selGoals.size === 0 || isLoading}
          className="bg-foreground text-background flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-none text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Saving...</span>
            </>
          ) : (
            <>
              Continue
              <motion.div
                variants={{
                  hover: { x: 5 },
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
