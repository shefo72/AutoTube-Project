"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="system"
      expand={false}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group flex !items-center !bg-card !border-border !rounded-[14px] !p-4 !gap-3 transition-all !w-full",
          content: "!pr-6",
          title: "!text-foreground !font-semibold text-[14px] leading-snug",
          description: "!text-text-dim text-[13px] !font-medium mt-1",

          closeButton:
            "!left-auto !right-3 !top-3 !translate-x-0 !translate-y-0 !bg-transparent hover:!bg-surface-2 !text-text-dim hover:!text-foreground !border-none !transition-colors !rounded-md !size-6 !flex !items-center !justify-center opacity-0 group-hover:opacity-100",

          actionButton:
            "!bg-transparent !text-primary hover:!text-primary-hover !font-medium text-[13px] !p-0 !border-none !shadow-none !ml-auto",

          icon: "!m-0 !size-8 !rounded-full !flex !items-center !justify-center !shrink-0",

          success:
            "[&>[data-icon]]:!bg-neon-emerald/10 [&>[data-icon]]:!text-neon-emerald !shadow-[0_8px_24px_rgba(52,211,153,0.12)]",

          error:
            "[&>[data-icon]]:!bg-destructive/10 [&>[data-icon]]:!text-destructive !shadow-[0_8px_24px_rgba(244,63,94,0.15)]",

          info: "[&>[data-icon]]:!bg-primary/10 [&>[data-icon]]:!text-primary !shadow-[0_8px_24px_rgba(124,92,252,0.15)]",

          loading:
            "[&>[data-icon]]:!bg-transparent [&>[data-icon]]:!text-primary [&_svg]:!animate-spin !shadow-[0_8px_24px_rgba(124,92,252,0.15)]",

          warning:
            "[&>[data-icon]]:!bg-neon-amber/10 [&>[data-icon]]:!text-neon-amber !shadow-[0_8px_24px_rgba(251,191,36,0.15)]",
        },
      }}
    />
  );
}
