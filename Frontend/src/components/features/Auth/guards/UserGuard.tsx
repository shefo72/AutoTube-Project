"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";

interface UserGuardProps {
  children: React.ReactNode;
}

export function UserGuard({ children }: UserGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, userInfo } = useAppSelector(
    (state) => state.auth
  );

  const activeRole = (userInfo?.role || "").toLowerCase();

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (activeRole === "admin") {
        router.replace("/admin/dashboard");
      }
    }
  }, [isHydrated, isAuthenticated, activeRole, router]);

  if (!isHydrated || !isAuthenticated || activeRole === "admin") {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="border-primary h-8 w-8 rounded-full border-2 border-t-transparent"
        />
      </div>
    );
  }

  return <>{children}</>;
}
