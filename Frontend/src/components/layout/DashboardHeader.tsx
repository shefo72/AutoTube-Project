"use client";

import Link from "next/link";
import { Menu, HelpCircle, Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useSidebar } from "@/hooks/useSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Tooltip } from "@/components/ui/tooltip";
import { useUsageCredits } from "@/services/billingApi";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  {
    label: "Gap Analyzer",
    subLabel: "Research",
    path: "/dashboard/gap-analyzer",
  },
  {
    label: "Video Generator",
    subLabel: "Creation",
    path: "/dashboard/video-generator",
  },
  { label: "Scripts", subLabel: "Creation", path: "/dashboard/script-writer" },
  { label: "Thumbnails", subLabel: "Visual", path: "/dashboard/thumbnails" },
  { label: "Analytics", subLabel: "Insights", path: "/dashboard/analytics" },
  {
    label: "All-in-One Pack",
    subLabel: "Creation",
    path: "/dashboard/all-on-one",
  },
  { label: "Settings", path: "/dashboard/settings" },
];

export function Header() {
  const { setIsMobileOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { totalUsed, creditsGranted, resetDate } = useUsageCredits();

  const currentPage = navItems.find((item) => item.path === pathname);
  const pageTitle = currentPage ? currentPage.label : "Dashboard";
  const pageSubLabel = currentPage?.subLabel;

  return (
    <div className="bg-background/80 border-border sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="border-border hover:text-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-transparent text-(--text-dim) md:hidden"
          >
            <Menu size={16} />
          </button>

          <div className="flex flex-col justify-center">
            {pageSubLabel && (
              <span className="mb-0.5 text-[9px] leading-none font-bold tracking-widest text-(--text-dim) uppercase">
                {pageSubLabel}
              </span>
            )}
            <h1 className="font-heading text-foreground m-0 text-base leading-tight font-bold tracking-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content={`Credits reset on ${resetDate}`}>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="border-border bg-surface-1 hover:bg-surface-2 text-foreground hidden h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-[11px] font-semibold shadow-sm transition-colors sm:flex"
            >
              <Zap
                size={12}
                className="animate-pulse fill-(--neon-purple)/20 text-(--neon-purple)"
              />
              <span>
                {creditsGranted - totalUsed} / {creditsGranted} Credits
              </span>
            </button>
          </Tooltip>
          <Tooltip content="Help & Docs">
            <Link
              href="/faqs"
              className="hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-(--text-dim) transition-colors hover:bg-(--hover-overlay)"
            >
              <HelpCircle size={16} />
            </Link>
          </Tooltip>

          <div className="bg-border mx-1 hidden h-4 w-px sm:block" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
