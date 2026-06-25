import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export function NoResultsState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-border flex w-full flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center"
    >
      <div className="border-border mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-(--surface-2) shadow-inner">
        <SearchX size={32} className="text-red-400 opacity-80" />
      </div>
      <h3 className="text-foreground text-lg font-bold">No Topics Found</h3>
      <p className="mt-2 max-w-sm text-sm text-(--text-dim)">
        We couldn&apos;t find any topics matching your search criteria. Try a
        different keyword or broaden your filters.
      </p>
    </motion.div>
  );
}
