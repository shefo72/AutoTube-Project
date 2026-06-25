"use client";

import { Zap, CreditCard } from "lucide-react";
import Link from "next/link";
import { Modal } from "./Modal";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
  currentBalance?: number;
}

export function InsufficientCreditsModal({
  isOpen,
  onClose,
  requiredCredits = 0,
  currentBalance = 0,
}: InsufficientCreditsModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Insufficient Credits"
      width="max-w-md"
    >
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 shadow-inner">
          <Zap size={36} className="fill-rose-500/20" />
        </div>

        <h4 className="text-foreground mb-2 text-2xl font-extrabold">
          You&#39;re out of magic!
        </h4>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          This action requires{" "}
          <strong className="text-foreground">{requiredCredits} credits</strong>
          , but you only have{" "}
          <strong className="text-foreground">{currentBalance}</strong>{" "}
          remaining. Upgrade your plan to keep creating.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/payment"
            onClick={onClose}
            className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            <CreditCard size={18} />
            Upgrade Plan
          </Link>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-muted w-full cursor-pointer rounded-xl px-5 py-3.5 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
