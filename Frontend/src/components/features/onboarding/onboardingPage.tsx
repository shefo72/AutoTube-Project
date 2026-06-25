"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { LeftRail } from "./LeftRail";
import { StepNiches } from "./StepNiches";
import { StepGoals } from "./StepGoals";
import { StepChannel } from "./stepChannel";
import { StepLaunch } from "./StepLaunch";

export function OnboardingPage() {
  const navigate = useRouter();
  const [step, setStep] = useState(1);
  const [selNiches, setSelNiches] = useState<Set<string>>(new Set());
  const [selGoals, setSelGoals] = useState<Set<string>>(new Set());
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggleSelection = (
    set: Set<string>,
    setFn: (s: Set<string>) => void,
    id: string
  ) => {
    const newSet = new Set(set);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setFn(newSet);
  };

  const handleFinish = () => {
    setLoading(true);
    timerRef.current = setTimeout(() => navigate.push("/dashboard"), 1000);
  };

  return (
    <div className="bg-background relative flex h-screen flex-col overflow-hidden md:flex-row">
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <ThemeToggle />
      </div>

      <LeftRail step={step} onNavigateHome={() => navigate.push("/")} />

      <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 py-8 md:px-10 md:py-12">
        <div className="my-auto w-full max-w-120 shrink-0">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepNiches
                key="s1"
                selNiches={selNiches}
                onToggle={(id) => toggleSelection(selNiches, setSelNiches, id)}
                onNext={() => setStep(2)}
                onBack={() => navigate.back()}
              />
            )}

            {step === 2 && (
              <StepGoals
                key="s2"
                selGoals={selGoals}
                onToggle={(id) => toggleSelection(selGoals, setSelGoals, id)}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <StepChannel
                key="s3"
                channelId={channelId}
                onChange={(id) => setChannelId(id)}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <StepLaunch
                key="s4"
                selNiches={selNiches}
                selGoals={selGoals}
                channelId={channelId}
                loading={loading}
                onBack={() => setStep(3)}
                onFinish={handleFinish}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
