"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import NotFoundImg from "../../public/404.png";

export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12 md:px-6">
      <div className="absolute top-1/4 left-1/4 -z-10 h-60 w-60 rounded-full bg-(--primary) opacity-20 blur-[100px] md:h-72 md:w-72 md:blur-[120px] dark:opacity-30" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-60 w-60 rounded-full bg-(--neon-pink) opacity-10 blur-[100px] md:h-72 md:w-72 md:blur-[120px] dark:opacity-20" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 flex w-full max-w-3xl flex-col items-center justify-center text-center"
      >
        <div className="relative mb-4 flex aspect-square w-full max-w-70 items-center justify-center sm:max-w-90 md:mb-8 md:max-w-112.5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <h1 className="font-heading text-[180px] leading-none font-black tracking-tighter md:text-[400px]">
              <span className="from-foreground bg-linear-to-b to-transparent bg-clip-text text-transparent opacity-5 dark:opacity-20">
                4
              </span>
              <span className="bg-linear-to-b from-(--primary) to-transparent bg-clip-text text-transparent opacity-10 dark:opacity-20">
                -
              </span>
              <span className="from-foreground bg-linear-to-b to-transparent bg-clip-text text-transparent opacity-5 dark:opacity-20">
                4
              </span>
            </h1>
          </motion.div>

          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 h-50 w-50 drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] md:h-90 md:w-90 md:drop-shadow-[0_0_40px_var(--primary)]"
          >
            <Image
              src={NotFoundImg}
              alt="System Error"
              fill
              className="object-contain p-4"
              priority
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 px-2 md:space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-(--border-active) bg-(--accent) px-3 py-1 text-xs font-medium text-(--primary) md:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--primary) opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 columns-1 rounded-full bg-(--primary)"></span>
            </span>
            Connection Lost
          </div>

          <h2 className="font-heading text-foreground text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Glitch in the{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-aurora)" }}
            >
              Algorithm.
            </span>
          </h2>

          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed md:text-lg">
            The script failed to execute. The page you&apos;re looking for has
            been removed or never existed in the AutoTube matrix.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-3 px-4 sm:max-w-none sm:flex-row sm:gap-4 md:mt-10"
        >
          <Link
            href="/"
            className="text-foreground border-border hover:bg-surface-2 group bg-card flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-6 text-sm font-semibold transition-all sm:h-14 sm:w-auto"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Return to Home
          </Link>

          <Link
            href="/dashboard"
            className="group shadow-glow-primary flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none px-8 text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] sm:h-14 sm:w-auto"
            style={{
              background: "var(--gradient-aurora)",
              backgroundSize: "200% 200%",
              animation: "at-gradient-shift 4s ease infinite",
            }}
          >
            <RefreshCcw
              size={16}
              className="transition-transform duration-500 group-hover:rotate-180"
            />
            Reboot System
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
