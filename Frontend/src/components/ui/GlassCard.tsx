import * as React from "react";
import { cn } from "@/lib/utils";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "light:border-black/5 light:bg-white/70 rounded-(--radius-card) border border-white/10 bg-[#111116]/60 saturate-150 backdrop-blur-[20px] dark:border-white/10 dark:bg-[#111116]/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
