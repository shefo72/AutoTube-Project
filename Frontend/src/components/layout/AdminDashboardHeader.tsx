"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldAlert, Home } from "lucide-react";
import Link from "next/link";

import { LogoMark } from "@/components/ui/Logo/LogoMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { apiSlice } from "@/store/apiSlice";

export default function AdminDashboardHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    router.push("/login");
  }, [dispatch, router]);

  return (
    <header className="border-border/60 bg-background/70 supports-backdrop-filter:bg-background/50 sticky top-0 z-40 w-full border-b backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center transition-transform duration-300 hover:scale-105"
          >
            <LogoMark size={32} />
          </Link>

          <div className="bg-border/60 h-8 w-px" />

          <div className="flex flex-col justify-center">
            <div className="mb-0.5 flex items-center gap-1.5">
              <ShieldAlert size={10} className="text-indigo-500" />
              <span className="text-[9px] font-bold tracking-[0.15em] text-indigo-500 uppercase">
                Admin Panel
              </span>
            </div>
            <h1 className="font-heading text-foreground m-0 text-sm font-extrabold tracking-tight sm:text-base">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="group flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-(--surface-2) sm:w-auto sm:px-3"
            title="Go to Home"
          >
            <Home
              size={16}
              className="group-hover:text-foreground text-(--text-dim) transition-colors"
            />
            <span className="text-foreground hidden text-xs font-semibold sm:ml-2 sm:inline">
              Home
            </span>
          </Link>

          <div className="bg-border/60 hidden h-5 w-px sm:block" />

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 group relative flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-transparent bg-(--surface-1) px-3 text-xs font-semibold text-(--text-dim) transition-all sm:px-4"
          >
            <span className="hidden sm:inline">Logout</span>
            <LogOut
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
