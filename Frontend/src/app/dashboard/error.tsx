"use client";

import { useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, LayoutDashboard, Cpu, AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (error) {
      console.error("Dashboard Boundary Error:", error);
    }
  }, [error]);

  const handleReset = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="bg-card shadow-elevation-sm relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-8 text-center">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] bg-size-[2rem_2rem] opacity-30" />

      <div className="absolute top-1/4 left-1/2 -z-10 h-50 w-50 -translate-x-1/2 rounded-full bg-(--destructive) opacity-10 blur-[80px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="border-border bg-surface-1 relative mb-8 flex h-32 w-55 items-end gap-2 rounded-xl border p-4 shadow-inner">
          <div className="h-[40%] w-full rounded-sm bg-(--primary) opacity-40" />
          <div className="h-[70%] w-full rounded-sm bg-(--primary) opacity-60" />
          <div className="relative h-full w-full overflow-hidden rounded-sm bg-(--destructive) shadow-[0_0_15px_var(--destructive)]">
            <div className="absolute inset-0 animate-pulse bg-white/20" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px]" />
          </div>

          <div className="bg-surface-3 h-[20%] w-full rounded-sm opacity-50" />

          <div className="ring-card absolute -top-3 -right-3 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-(--destructive) text-white shadow-lg ring-4">
            <AlertCircle size={16} strokeWidth={2.5} />
          </div>
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-(--destructive)/20 bg-(--destructive)/10 px-3 py-1 text-xs font-semibold tracking-widest text-(--destructive) uppercase">
          <Cpu size={14} className="animate-pulse" />
          Module Sync Failed
        </div>

        <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight">
          Analysis Interrupted
        </h2>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          The AI engine couldn&apos;t retrieve or process the data for this
          specific view. Don&apos;t worry, your overarching workflow and saved
          scripts are completely safe.
        </p>

        {error?.digest && (
          <div className="bg-surface-2 text-text-dim border-border/50 mt-5 rounded-md border px-3 py-1.5 font-mono text-[11px] tracking-wider">
            TRACE ID: {error.digest}
          </div>
        )}

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={handleReset}
            className="group shadow-glow-primary-sm relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-(--primary) px-6 font-semibold text-white transition-all hover:bg-(--primary-hover) sm:w-auto"
          >
            <RefreshCw
              size={16}
              className="transition-transform group-hover:rotate-180"
            />
            Reload Module
          </button>

          <a
            href="/dashboard"
            className="text-muted-foreground border-border hover:bg-hover-overlay hover:text-foreground flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border bg-transparent px-6 font-medium transition-all sm:w-auto"
          >
            <LayoutDashboard size={16} />
            Back to Overview
          </a>
        </div>
      </div>
    </div>
  );
}
