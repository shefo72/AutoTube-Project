"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Tooltip } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="at-theme-toggle"
        style={{
          position: "relative",
          overflow: "hidden",
          width: 32,
          height: 32,
          background: "transparent",
          border: "none",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <Tooltip content={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <motion.button
        onClick={toggleTheme}
        whileTap={{ scale: 0.92 }}
        className="at-theme-toggle hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center border bg-transparent text-(--text-dim) transition-all hover:bg-(--hover-overlay)"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="flex items-center justify-center"
            >
              <Sun size={14} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="flex items-center justify-center"
            >
              <Moon size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </Tooltip>
  );
}
