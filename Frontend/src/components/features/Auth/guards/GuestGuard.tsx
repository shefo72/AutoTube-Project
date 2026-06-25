"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, userInfo } = useAppSelector(
    (state) => state.auth
  );

  const activeRole = userInfo?.role ? userInfo.role.toLowerCase() : null;

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      if (activeRole === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isHydrated, isAuthenticated, activeRole, router]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          className="border-primary h-8 w-8 rounded-full border-2 border-t-transparent"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          className="border-primary h-8 w-8 rounded-full border-2 border-t-transparent"
        />
      </div>
    );
  }

  return <>{children}</>;
}
