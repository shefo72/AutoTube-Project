"use client";
import { useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Crosshair,
  Sparkles,
  PenTool,
  Image as imageIcon,
  BarChart3,
  Settings,
  Crown,
  Film,
  X,
  ChevronsLeft,
  LogOut,
} from "lucide-react";
import { LogoMark } from "@/components/ui/Logo/LogoMark";
import { useSidebar } from "@/hooks/useSidebar";
import { cn, getAvatarName, getValidImageUrl } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/store/index";
import { logout } from "@/store/authSlice";
import { apiSlice } from "@/store/apiSlice";
import { useGetProfileQuery } from "@/services/profileApi";
import { useGetSubscriptionQuery } from "@/services/billingApi";

const navItems = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: Crosshair, label: "Gap Analyzer", path: "/dashboard/gap-analyzer" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: PenTool, label: "Scripts", path: "/dashboard/script-writer" },
  { icon: imageIcon, label: "Thumbnails", path: "/dashboard/thumbnails" },
  { icon: Film, label: "Video Gen", path: "/dashboard/video-generator" },
  { icon: Sparkles, label: "All-in-One", path: "/dashboard/all-on-one" },
];

const NavContent = memo(
  ({
    expanded,
    onNav,
    onToggleDesktop,
  }: {
    expanded: boolean;
    onNav?: () => void;
    onToggleDesktop?: () => void;
  }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);

    const { data: profileData, isLoading: isProfileLoading } =
      useGetProfileQuery(undefined, {
        skip: !isAuthenticated,
      });

    const currentFullName =
      profileData?.personalInfo?.fullName || userInfo?.fullName || "User";
    const currentEmail =
      profileData?.personalInfo?.email || userInfo?.email || "";

    const rawImageUrl = profileData?.basicInfo?.profileImageUrl;
    const finalAvatarUrl = rawImageUrl ? getValidImageUrl(rawImageUrl) : null;

    const [imageError, setImageError] = useState(false);

    const { data: subscription } = useGetSubscriptionQuery();
    const isStarterPlan = subscription?.planName?.toLowerCase() === "starter";

    const isActive = useCallback(
      (path: string) =>
        path === "/dashboard"
          ? pathname === "/dashboard"
          : pathname.startsWith(path),
      [pathname]
    );

    const handleLogout = useCallback(() => {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      router.push("/login");
    }, [dispatch, router]);

    return (
      <div className="flex h-full flex-col py-3">
        <div
          className={cn(
            "mb-6 flex shrink-0 items-center transition-all duration-300 ease-in-out",
            expanded
              ? "justify-between px-4"
              : "flex-col justify-center gap-4 px-0"
          )}
        >
          <Link href="/" className="flex cursor-pointer items-center gap-3">
            <LogoMark size={expanded ? 26 : 22} />
            <div
              className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
                expanded ? "max-w-25 opacity-100" : "max-w-0 opacity-0"
              )}
            >
              <div className="text-foreground font-heading text-[13px] font-bold tracking-tight">
                AutoTube
              </div>
            </div>
          </Link>

          {onToggleDesktop && (
            <button
              onClick={onToggleDesktop}
              className="text-foreground hidden cursor-pointer items-center justify-center rounded-lg border-none bg-(--hover-overlay) p-1.5 transition-all hover:scale-105 md:flex"
              aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <motion.div
                animate={{ rotate: expanded ? 0 : 180 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <ChevronsLeft size={18} strokeWidth={2.5} />
              </motion.div>
            </button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-1.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onNav}
                className={cn(
                  "group relative flex cursor-pointer items-center rounded-xl border-none transition-all duration-300 ease-in-out",
                  expanded
                    ? "h-10 px-3"
                    : "mx-auto h-10 w-10 justify-center px-0",
                  active
                    ? "text-white"
                    : "hover:text-foreground bg-transparent text-(--text-dim) hover:bg-(--hover-overlay)"
                )}
                style={
                  active
                    ? {
                        background: "var(--gradient-aurora)",
                        backgroundSize: "200% 200%",
                        animation: "at-gradient-shift 4s ease infinite",
                        boxShadow: "var(--glow-primary-sm)",
                      }
                    : {}
                }
              >
                <item.icon size={16} className="shrink-0" />
                <span
                  className={cn(
                    "overflow-hidden text-[12px] font-medium whitespace-nowrap transition-all duration-300 ease-in-out",
                    expanded
                      ? "ml-3 max-w-30 opacity-100"
                      : "ml-0 max-w-0 opacity-0"
                  )}
                >
                  {item.label}
                </span>

                {!expanded && (
                  <div className="bg-popover border-border text-foreground shadow-elevation-md pointer-events-none absolute left-full z-50 ml-3 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "transition-all duration-300",
            expanded ? "px-1.5" : "px-1.5"
          )}
        >
          {isStarterPlan && (
            <Link
              href="/payment"
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                expanded
                  ? "mb-2 max-h-25 opacity-100"
                  : "m-0 max-h-0 border-0 p-0 opacity-0"
              )}
            >
              <div
                className="relative mx-1 cursor-pointer overflow-hidden rounded-xl border border-(--border-active) p-3 transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-subtle)" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Crown size={11} color="var(--neon-amber)" />
                  <span className="text-foreground text-[10px] font-bold">
                    Go Pro
                  </span>
                </div>
                <p className="m-0 text-[9px] leading-relaxed text-(--text-dim)">
                  Unlock full platform access.
                </p>
              </div>
            </Link>
          )}
          {expanded && <div className="border-border/90 mx-3 my-2 border-t" />}
          <Link
            href="/dashboard/settings"
            onClick={onNav}
            className={cn(
              "group hover:text-foreground relative flex cursor-pointer items-center rounded-xl border-none bg-transparent text-(--text-dim) transition-all duration-300 ease-in-out hover:bg-(--hover-overlay)",
              expanded
                ? "h-10 w-full px-3"
                : "mx-auto h-10 w-10 justify-center px-0"
            )}
          >
            <Settings size={15} className="shrink-0" />
            <span
              className={cn(
                "overflow-hidden text-[12px] font-medium whitespace-nowrap transition-all duration-300 ease-in-out",
                expanded
                  ? "ml-3 max-w-30 opacity-100"
                  : "ml-0 max-w-0 opacity-0"
              )}
            >
              Settings
            </span>
            {!expanded && (
              <div className="bg-popover border-border text-foreground shadow-elevation-md pointer-events-none absolute left-full z-50 ml-3 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                Settings
              </div>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "group relative flex cursor-pointer items-center rounded-xl border-none bg-transparent text-(--text-dim) transition-all duration-300 ease-in-out hover:bg-red-500/10 hover:text-red-500",
              expanded
                ? "h-10 w-full px-3"
                : "mx-auto h-10 w-10 justify-center px-0"
            )}
          >
            <LogOut size={15} className="shrink-0" />
            <span
              className={cn(
                "overflow-hidden text-[12px] font-medium whitespace-nowrap transition-all duration-300 ease-in-out",
                expanded
                  ? "ml-3 max-w-30 opacity-100"
                  : "ml-0 max-w-0 opacity-0"
              )}
            >
              Log out
            </span>
            {!expanded && (
              <div className="bg-popover border-border text-foreground shadow-elevation-md pointer-events-none absolute left-full z-50 ml-3 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                Log out
              </div>
            )}
          </button>
          {/* ── User Profile ── */}
          <div
            className={cn(
              "mt-2 flex items-center transition-all duration-300 ease-in-out",
              expanded ? "px-3" : "justify-center"
            )}
          >
            {isAuthenticated ? (
              isProfileLoading && !profileData && !userInfo ? (
                <>
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-(--surface-2)" />
                  <div
                    className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
                      expanded
                        ? "ml-3 max-w-30 opacity-100"
                        : "ml-0 max-w-0 opacity-0"
                    )}
                  >
                    <div className="mb-1 h-3 w-20 animate-pulse rounded bg-(--surface-2)" />
                    <div className="h-2 w-14 animate-pulse rounded bg-(--surface-2)" />
                  </div>
                </>
              ) : (
                <>
                  {finalAvatarUrl && !imageError ? (
                    <div className="border-border/50 relative h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                      <Image
                        key={finalAvatarUrl}
                        src={finalAvatarUrl}
                        alt={currentFullName}
                        fill
                        className="object-cover"
                        sizes="32px"
                        onError={() => setImageError(true)}
                      />
                    </div>
                  ) : (
                    <div className="from-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br to-(--neon-purple) text-[11px] font-bold text-white shadow-sm">
                      {getAvatarName(currentFullName)}
                    </div>
                  )}
                  <div
                    className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
                      expanded
                        ? "ml-3 max-w-30 opacity-100"
                        : "ml-0 max-w-0 opacity-0"
                    )}
                  >
                    <div className="text-foreground truncate text-[11px] font-semibold">
                      {currentFullName}
                    </div>
                    <div className="truncate text-[9px] text-(--text-dim)">
                      {currentEmail}
                    </div>
                  </div>
                </>
              )
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);
NavContent.displayName = "NavContent";

export function Sidebar() {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  const handleMobileClose = useCallback(
    () => setIsMobileOpen(false),
    [setIsMobileOpen]
  );
  const handleToggleDesktop = useCallback(
    () => setIsDesktopExpanded((prev) => !prev),
    []
  );

  return (
    <>
      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={handleMobileClose}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            style={{ willChange: "transform" }}
            className="border-border fixed top-0 bottom-0 left-0 z-50 w-60 transform-gpu border-r bg-(--surface-0) md:hidden"
          >
            <button
              onClick={handleMobileClose}
              className="hover:text-foreground absolute top-3 right-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-(--text-dim)"
              aria-label="Close Sidebar"
            >
              <X size={14} />
            </button>
            <NavContent expanded onNav={handleMobileClose} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Desktop rail ── */}
      <motion.aside
        initial={false}
        animate={{ width: isDesktopExpanded ? 200 : 64 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        style={{ willChange: "width" }}
        className="border-border relative z-30 hidden h-full shrink-0 transform-gpu flex-col border-r bg-(--surface-0) md:flex"
      >
        <NavContent
          expanded={isDesktopExpanded}
          onToggleDesktop={handleToggleDesktop}
        />
      </motion.aside>
    </>
  );
}
