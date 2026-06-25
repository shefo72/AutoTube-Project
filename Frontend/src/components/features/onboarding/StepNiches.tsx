import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { niches } from "@/constants/onboarding";
import { stepAnimation } from "@/lib/animations";
import { useSubmitNichesMutation } from "@/services/onboardingApi";

interface StepNichesProps {
  selNiches: Set<string>;
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepNiches({
  selNiches,
  onToggle,
  onNext,
  onBack,
}: StepNichesProps) {
  const [submitNiches, { isLoading }] = useSubmitNichesMutation();

  const handleNext = async () => {
    try {
      await submitNiches({ niches: Array.from(selNiches) }).unwrap();
      onNext();
    } catch (error) {
      console.error("Failed to submit niches:", error);
    }
  };

  return (
    <motion.div {...stepAnimation}>
      <div className="mb-7">
        <h2
          className="text-foreground m-0 mb-2 leading-[1.2] font-extrabold tracking-[-0.03em]"
          style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
        >
          What&apos;s your niche?
        </h2>
        <p className="m-0 text-sm text-(--text-dim)">
          Select all that apply. We&apos;ll personalize your experience.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {niches.map((n) => {
          const sel = selNiches.has(n.id);
          return (
            <motion.button
              key={n.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(n.id)}
              className="rounded-card flex cursor-pointer flex-col items-start gap-1.5 p-4 text-left transition-all"
              style={{
                border: `1px solid ${sel ? "rgba(99,102,241,0.4)" : "var(--border)"}`,
                background: sel ? "rgba(99,102,241,0.08)" : "var(--surface-1)",
                boxShadow: sel ? "0 2px 8px rgba(99,102,241,0.12)" : "none",
              }}
            >
              <span className="text-[18px]">
                <n.icon size={18} />
              </span>
              <span
                className="text-[11px] leading-[1.2]"
                style={{
                  fontWeight: sel ? 600 : 400,
                  color: sel
                    ? "var(--primary-hover)"
                    : "var(--muted-foreground)",
                }}
              >
                {n.label}
              </span>
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
          disabled={selNiches.size === 0 || isLoading}
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
