"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="border-border/50 mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border bg-(--surface-2) shadow-inner">
        <Search size={32} className="text-(--text-dim) opacity-60" />
      </div>

      <div className="space-y-1.5">
        <h4 className="text-foreground text-sm font-bold tracking-tight">
          {title}
        </h4>
        <p className="max-w-52 text-xs leading-relaxed font-medium text-(--text-dim)">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
