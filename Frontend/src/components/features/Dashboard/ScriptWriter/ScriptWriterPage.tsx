"use client";

import { useState } from "react";
import { useScript } from "@/hooks/useScript";
import { ScriptConfig } from "./ScriptConfig";
import { ScriptSections } from "./ScriptSections";
import { ScriptStats } from "./ScriptStats";
import { ScriptHistoryModal } from "./ScriptHistoryModal";
import { InsufficientCreditsModal } from "@/components/ui/InsufficientCreditsModal";
import { useUsageCredits } from "@/services/billingApi";

export function ScriptWriterPage() {
  const { data, isGenerating, error, generateScript, clearError } = useScript();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [requiredCost, setRequiredCost] = useState(0);

  const { creditsGranted, totalUsed } = useUsageCredits();

  const currentBalance = creditsGranted - totalUsed;
  const handleInsufficientCredits = (cost: number) => {
    setRequiredCost(cost);
    setIsCreditModalOpen(true);
  };

  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-8 p-5 pt-16 md:p-8 md:pt-8">
        <ScriptConfig
          onGenerate={generateScript}
          isGenerating={isGenerating}
          onOpenHistory={() => setIsHistoryOpen(true)}
          currentBalance={currentBalance}
          onInsufficientCredits={handleInsufficientCredits}
        />
        {!isGenerating && <ScriptStats stats={data?.stats || null} />}
        <ScriptSections
          scriptData={data}
          isGenerating={isGenerating}
          error={error}
          clearError={clearError}
        />
      </div>

      <ScriptHistoryModal
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <InsufficientCreditsModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        requiredCredits={requiredCost}
        currentBalance={currentBalance}
      />
    </div>
  );
}
