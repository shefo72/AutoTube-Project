"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export default function FieldError({ message, className }: FieldErrorProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div
            role="alert"
            className={cn(
              "mt-1.5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 backdrop-blur-xs",
              className
            )}
          >
            <AlertCircle
              className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400"
              strokeWidth={2.5}
            />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
