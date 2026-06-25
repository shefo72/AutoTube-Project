"use client";

import { Check, Copy } from "lucide-react";

interface CopyBtnProps {
  text: string;
  id: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}

export function CopyBtn({ text, id, copied, onCopy }: CopyBtnProps) {
  return (
    <button
      onClick={() => onCopy(text, id)}
      className="border-border hover:text-foreground flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border bg-transparent px-3 py-1.5 text-[10px] font-medium text-(--text-dim) transition-all hover:border-(--surface-4)"
    >
      {copied === id ? <Check size={10} /> : <Copy size={10} />}
      {copied === id ? "Copied" : "Copy"}
    </button>
  );
}
