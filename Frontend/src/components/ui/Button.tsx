"use client";

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "secondary";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

const sizeMap: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-sm",
  sm: "h-9 px-5 text-[13px]",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-sm",
  xl: "h-[52px] px-7 text-sm",
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "animate-gradient-shift border-none bg-[length:200%_200%] font-bold text-white disabled:shadow-none disabled:animate-none",
  outline:
    "border border-border bg-transparent font-medium text-(--text-dim) hover:text-foreground hover:border-(--surface-4) hover:bg-(--hover-overlay-md) disabled:border-border/50 disabled:bg-transparent",
  ghost:
    "border-none bg-transparent font-medium text-muted-foreground hover:text-foreground hover:bg-(--hover-overlay) disabled:bg-transparent",
  secondary:
    "border-none bg-secondary font-bold text-secondary-foreground hover:opacity-80 disabled:bg-secondary/50",
};

export function Button({
  variant = "primary",
  size = "lg",
  iconLeft,
  iconRight,
  fullWidth = false,
  children,
  className,
  style,
  disabled,
  ...motionProps
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      {...motionProps}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full transition-all",
        sizeMap[size],
        variantMap[variant],
        fullWidth && "w-full",
        disabled
          ? "cursor-not-allowed opacity-50 grayscale-20"
          : "cursor-pointer",
        className
      )}
      style={{
        ...(isPrimary && !disabled
          ? {
              backgroundImage: "var(--gradient-aurora)",
              boxShadow: "var(--glow-primary-sm)",
              background: "var(--gradient-aurora)",
              backgroundSize: "200% 200%",
              animation: "at-gradient-shift 4s ease infinite",
            }
          : isPrimary && disabled
            ? {
                background: "var(--surface-3)",
                color: "var(--text-dim)",
              }
            : {}),
        ...style,
      }}
    >
      {iconLeft && (
        <span
          className={cn(
            "flex items-center justify-center transition-transform",
            !disabled && "group-hover:-translate-x-0.5"
          )}
        >
          {iconLeft}
        </span>
      )}

      {children}

      {iconRight && (
        <span
          className={cn(
            "flex items-center justify-center transition-transform",
            !disabled && "group-hover:translate-x-0.5"
          )}
        >
          {iconRight}
        </span>
      )}
    </motion.button>
  );
}
