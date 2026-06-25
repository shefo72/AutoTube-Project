"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/index";
import { setCredentials } from "@/store/authSlice";
import type { AuthResponse, User } from "@/types/user";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  email: string[];
  userId: string;
  fullName: string;
  authProvider: string;
  exp: number; // Expiration time in seconds
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"?: string;
  role: "admin" | "user";
}

function SuccessContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      console.error("No token found in URL");
      router.replace("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      const user: User = {
        userId: Number(decoded.userId || decoded.sub),
        fullName: decoded.fullName || "Google User",
        email: Array.isArray(decoded.email) ? decoded.email[0] : decoded.email,
        dateOfBirth: "",
        authProvider: decoded.authProvider || "google",
        createdAt: new Date().toISOString(),
        phoneNumber:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"
          ] || "",
        role: decoded.role,
      };

      const expiresAt = new Date(decoded.exp * 1000).toISOString();

      const authData: AuthResponse = {
        token,
        expiresAt,
        user,
        role: user.role,
      };

      dispatch(setCredentials(authData));

      const authType = localStorage.getItem("authType");
      localStorage.removeItem("authType");

      if (authType === "signup") {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.setItem("at-token", token);
      router.replace("/dashboard");
    }
  }, [router, dispatch, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center gap-3">
      <Loader2 className="text-primary h-6 w-6 animate-spin" />
      <p className="text-muted-foreground font-medium">Signing you in...</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
