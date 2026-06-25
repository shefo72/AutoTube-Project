"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, ArrowRight, ShieldCheck, Blocks, LogOut } from "lucide-react";

const MotionLink = motion.create ? motion.create(Link) : motion(Link);
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoMark } from "@/components/ui/Logo/LogoMark";

import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/store/index";

import { logout } from "@/store/authSlice";
import { apiSlice } from "@/store/apiSlice";
import { Tooltip } from "../ui/tooltip";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Our Rates", href: "/#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  const isAdmin = role === "admin";

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 30);
  });

  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    setMobileOpen(false);
    router.push("/login");
  }, [dispatch, router]);

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed top-0 right-0 left-0 z-100"
      >
        <div
          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? "py-0" : "px-4 py-3"}`}
        >
          <nav
            className={`mx-auto flex items-center justify-between gap-4 backdrop-blur-xl backdrop-saturate-[1.8] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              scrolled
                ? "border-border bg-background/30 max-w-full rounded-none border-b px-8 py-3"
                : "max-w-6xl rounded-2xl border border-(--glass-border) bg-(--glass-bg) px-5 py-2.5"
            }`}
          >
            {/* Logo */}
            <MotionLink
              href="/"
              className="flex shrink-0 cursor-pointer items-center gap-2.5 no-underline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                animate={{ rotate: scrolled ? 0 : 0 }}
                whileHover={{ rotate: 12 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <LogoMark size={28} />
              </motion.div>
              <span className="font-heading text-foreground text-[15px] font-bold tracking-tight">
                AutoTube
              </span>
            </MotionLink>

            {/* Center links */}
            <div className="relative hidden items-center gap-0.5 md:flex">
              {navLinks.map((link) => (
                <MotionLink
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative cursor-pointer rounded-lg px-4 py-2 text-sm font-medium no-underline transition-colors",
                    hoveredLink === link.label
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Hover pill background */}
                  {hoveredLink === link.label && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-lg bg-(--hover-overlay-md)"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </MotionLink>
              ))}
            </div>

            {/* Right side */}
            <div className="flex shrink-0 items-center gap-3">
              {isAuthenticated ? (
                <div className="hidden items-center sm:flex">
                  {!isAdmin ? (
                    <Link href="/dashboard">
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-1.5"
                        whileHover={{
                          scale: 1.04,
                          boxShadow: "0 0 24px rgba(124,92,252,0.35)",
                        }}
                      >
                        <Blocks size={14} />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/admin/dashboard">
                      <Button variant="primary" size="sm" className="gap-1.5">
                        <ShieldCheck size={16} />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}

                  <div className="bg-border/80 mx-3 h-5 w-px rounded-full" />

                  <div className="flex items-center gap-1">
                    <ThemeToggle />

                    <Tooltip content="Log Out">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="group relative flex items-center justify-center gap-0 overflow-hidden border border-transparent px-2 text-(--text-dim) transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                      >
                        <LogOut size={16} className="shrink-0" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <ThemeToggle />
                  <Link href="/login" className="hidden sm:block">
                    <Button
                      variant="ghost"
                      size="xs"
                      whileHover={{ y: -1 }}
                      whileTap={{} as never}
                    >
                      Log in
                    </Button>
                  </Link>

                  <Link href="/signup" className="hidden md:inline-flex">
                    <Button
                      variant="primary"
                      size="sm"
                      iconRight={<ArrowRight size={13} />}
                      whileHover={{
                        scale: 1.04,
                        boxShadow: "0 0 24px rgba(124,92,252,0.35)",
                      }}
                    >
                      Get started
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <motion.button
                  onClick={() => setMobileOpen(true)}
                  className="text-foreground border-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-transparent"
                  whileTap={{ scale: 0.9 }}
                >
                  <Menu size={18} />
                </motion.button>
              </div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="border-border fixed top-0 right-0 bottom-0 z-210 flex w-75 flex-col border-l bg-(--surface-0) p-7 shadow-2xl"
            >
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <LogoMark size={24} />
                  <span className="font-heading text-foreground text-sm font-bold">
                    AutoTube
                  </span>
                </div>
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent hover:bg-(--hover-overlay-md)"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <MotionLink
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-muted-foreground hover:text-foreground rounded-lg px-4 py-3 text-base font-medium no-underline transition-colors hover:bg-(--hover-overlay)"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    {link.label}
                  </MotionLink>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    {!isAdmin ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button
                          variant="primary"
                          size="lg"
                          fullWidth
                          className="gap-2 rounded-xl"
                        >
                          <Blocks size={16} />
                          Go to Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          fullWidth
                          className="gap-2 rounded-xl"
                        >
                          <ShieldCheck size={16} className="text-primary" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}

                    {/* Logout Button (Mobile) */}
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={handleLogout}
                      className="gap-2 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    >
                      <LogOut size={16} />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        className="rounded-xl"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="primary"
                        size="lg"
                        iconRight={<ArrowRight size={14} />}
                        fullWidth
                        className="rounded-xl"
                      >
                        Get started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
