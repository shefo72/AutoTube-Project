/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import { PromptConfig } from "./PromptConfig";
import { ContentWorkspace } from "./ContentWorkspace";
import { InsufficientCreditsModal } from "@/components/ui/InsufficientCreditsModal";
import { useUsageCredits } from "@/services/billingApi";
import {
  useGenerateAllInOneMutation,
  useGetAllInOneByIdQuery,
} from "@/services/allInOneApi";

export function AllOnOnePage() {
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<string>("script");
  const [copied, setCopied] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [pollInterval, setPollInterval] = useState(10_000);

  // ─── Credit Guard State ───
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [requiredCost, setRequiredCost] = useState(0);

  const { creditsGranted, totalUsed } = useUsageCredits();

  const currentBalance = creditsGranted - totalUsed;

  const handleInsufficientCredits = (cost: number) => {
    setRequiredCost(cost);
    setIsCreditModalOpen(true);
  };

  const [generateMutation, { isLoading: isPosting, data: postData }] =
    useGenerateAllInOneMutation();

  const { data: queryData } = useGetAllInOneByIdQuery(activeId as number, {
    skip: activeId === null,
    pollingInterval: pollInterval,
  });

  useEffect(() => {
    if (queryData?.status === "Completed" || queryData?.status === "Failed") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPollInterval(0);
    } else if (activeId !== null) {
      setPollInterval(10_000);
    }
  }, [queryData?.status, activeId]);

  let resolvedData: any = null;

  if (
    queryData &&
    (queryData.status === "Completed" || queryData.status === "Failed")
  ) {
    resolvedData = queryData;
  } else if (postData) {
    resolvedData = postData;
  }

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleGenerate = useCallback(
    async (prompt: string, tone: string, style: string) => {
      try {
        setActiveId(null);
        setTab("script");

        const response = await generateMutation({
          prompt,
          voiceTone: tone,
          videoStyle: style,
        }).unwrap();

        if (response.allInOneId) {
          setActiveId(response.allInOneId);
        }
      } catch (error) {
        console.error("Failed to generate All In One pack:", error);
      }
    },
    [generateMutation]
  );

  const isGenerating =
    isPosting ||
    (activeId !== null &&
      resolvedData !== null &&
      resolvedData.status !== "Completed" &&
      resolvedData.status !== "Failed");

  return (
    <div className="bg-background relative flex h-full min-h-screen w-full flex-col overflow-y-auto md:min-h-0 md:flex-row md:overflow-hidden">
      <PromptConfig
        input={input}
        setInput={setInput}
        isGen={isGenerating}
        onGenerate={handleGenerate}
        currentBalance={currentBalance}
        onInsufficientCredits={handleInsufficientCredits}
      />
      <ContentWorkspace
        data={resolvedData}
        tab={tab}
        isGen={isGenerating}
        setTab={setTab}
        copied={copied}
        onCopy={handleCopy}
      />

      {/* ── Credit Guard Modal ── */}
      <InsufficientCreditsModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        requiredCredits={requiredCost}
        currentBalance={currentBalance}
      />
    </div>
  );
}
