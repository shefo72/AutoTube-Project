"use client";

import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  return {
    theme: (resolvedTheme ?? "dark") as "dark" | "light",
    isDark: resolvedTheme === "dark",
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
