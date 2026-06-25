"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { initAuth } from "@/store/authSlice";

interface AuthProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthProvider({ children, fallback }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    dispatch(initAuth());
  }, [dispatch]);

  if (!isHydrated) {
    return <>{fallback ?? null}</>;
  }

  return <>{children}</>;
}
