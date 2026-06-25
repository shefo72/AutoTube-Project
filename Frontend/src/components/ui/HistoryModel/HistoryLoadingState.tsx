"use client";

import { motion } from "framer-motion";

export default function HistoryLoadingState() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
          className="border-border/50 flex flex-col gap-4 rounded-2xl border bg-(--surface-1)/20 p-3 sm:flex-row"
        >
          <div className="h-24 w-full shrink-0 rounded-xl bg-(--surface-2) sm:w-40" />

          <div className="flex flex-1 flex-col justify-center gap-3 py-1">
            <div className="h-4 w-3/4 rounded-md bg-(--surface-2)" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-md bg-(--surface-2)" />
              <div className="h-5 w-16 rounded-md bg-(--surface-2)" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
