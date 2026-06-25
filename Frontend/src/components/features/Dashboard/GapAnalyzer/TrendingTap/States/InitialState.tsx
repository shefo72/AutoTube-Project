import { motion } from "framer-motion";
import { Telescope } from "lucide-react";

export function InitialEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-border flex w-full flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center"
    >
      <div className="border-border mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-(--surface-2) shadow-inner">
        <Telescope size={32} className="text-primary opacity-80" />
      </div>
      <h3 className="text-foreground text-lg font-bold">
        Discover Content Gaps
      </h3>
      <p className="mt-2 max-w-sm text-sm text-(--text-dim)">
        Enter a keyword above and optionally filter by country or category to
        find low-competition, high-demand topics.
      </p>
    </motion.div>
  );
}
