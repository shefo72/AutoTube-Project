"use client";

import { useEffect } from "react";
import { MonitorX, RefreshCcw, Activity } from "lucide-react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error) {
      console.error("Critical Global Error:", error);
    }
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="overflow-hidden bg-[#06060a] font-sans text-[#f5f5f7] antialiased selection:bg-[#f43f5e] selection:text-white">
        <div className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] bg-size-[100%_4px]" />

        <div className="absolute top-[-20%] left-[-10%] -z-10 h-[70vh] w-[70vw] rounded-full bg-[#f43f5e] opacity-10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-20%] -z-10 h-[50vh] w-[50vw] rounded-full bg-[#7c5cfc] opacity-10 blur-[100px]" />

        <div className="relative z-50 flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#f43f5e]/30 bg-[#111116]/80 shadow-[0_0_80px_rgba(244,63,94,0.15)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#f43f5e]/20 bg-[#000000]/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]" />
                  <div className="h-3 w-3 rounded-full bg-[#3a3a48]" />
                  <div className="h-3 w-3 rounded-full bg-[#3a3a48]" />
                </div>
                <span className="font-mono text-xs tracking-widest text-[#8e8ea0] opacity-70">
                  AUTOTUBE_RENDER_ENGINE.exe
                </span>
              </div>
              <div className="flex items-center gap-2 rounded border border-[#f43f5e]/20 bg-[#f43f5e]/10 px-2.5 py-1">
                <Activity size={12} className="animate-pulse text-[#f43f5e]" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#f43f5e] uppercase">
                  Signal Lost
                </span>
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#f43f5e]/20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#f43f5e] bg-[#000000] shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                  <MonitorX size={40} className="text-[#f43f5e]" />
                </div>
              </div>

              <h1 className="font-heading mb-4 text-4xl font-black tracking-tighter text-white uppercase drop-shadow-md md:text-6xl">
                <span className="bg-linear-to-r from-[#f43f5e] to-[#ff8a9f] bg-clip-text text-transparent">
                  Broadcast
                </span>{" "}
                Interrupted
              </h1>

              <p className="mx-auto max-w-xl text-base leading-relaxed text-[#8e8ea0] md:text-lg">
                The AutoTube rendering pipeline encountered a fatal algorithmic
                fault. Script generation and video synchronization have been
                forcibly suspended.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="group relative mt-10 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-linear-to-r from-[#f43f5e] to-[#e11d48] px-10 py-4 font-bold text-white shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)]"
              >
                <div className="absolute inset-0 flex h-full w-full transform-[skew(-12deg)_translateX(-150%)] justify-center group-hover:transform-[skew(-12deg)_translateX(150%)] group-hover:duration-1000">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                <span className="relative flex items-center justify-center gap-3">
                  <RefreshCcw
                    size={20}
                    className="transition-transform duration-500 group-hover:-rotate-180"
                  />
                  Restart AI Engine
                </span>
              </button>
            </div>

            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#2a2a36]">
              <div className="relative h-full w-[43%] bg-[#f43f5e]">
                <div className="absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 animate-pulse rounded-full border-2 border-[#f43f5e] bg-white shadow-[0_0_10px_#f43f5e]" />
              </div>
            </div>
          </div>

          {error?.digest && (
            <div className="absolute bottom-6 font-mono text-xs tracking-widest text-[#8e8ea0]/40 uppercase">
              TRACE_ID: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
