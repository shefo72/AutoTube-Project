"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, Globe, Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoMark } from "@/components/ui/Logo/LogoMark";
import { PasswordInput } from "@/components/ui/PasswordInput";
import FieldError from "@/components/ui/FieldError";

import { loginSchema, LoginFormValues } from "@/schemas/loginSchema";
import { useLoginMutation } from "@/services/authApi";

const MotionDiv = motion.create("div");

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      await login(values).unwrap();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as {
        data?: { message?: string; errors?: Record<string, string> };
        status?: number;
      };

      toast.error(error.data?.message || "Login failed");

      if (error.data?.errors) {
        Object.keys(error.data.errors).forEach((field) => {
          setError(field as keyof LoginFormValues, {
            message: error.data!.errors![field],
          });
        });
      }
    }
  };

  const handleGoogleSignup = () => {
    localStorage.setItem("authType", "login");

    const redirectUrl = `${window.location.origin}/auth/success`;

    window.location.href = `${process.env.NEXT_PUBLIC_AUTOTUBE_API_URL}/auth/google-login?redirectUrl=${encodeURIComponent(
      redirectUrl
    )}`;
  };

  return (
    <div className="bg-background relative flex h-screen flex-col overflow-hidden md:flex-row">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <ThemeToggle />
      </div>

      {/* Left Rail */}
      <div className="border-border relative z-10 flex w-full shrink-0 flex-col overflow-hidden border-b bg-(--surface-0) px-6 py-6 md:w-80 md:border-r md:border-b-0 md:px-8 md:py-10">
        <div className="relative z-10 mb-0 flex items-center justify-between gap-2.5 md:mb-13 md:justify-start">
          <div
            className="flex cursor-pointer items-center gap-2.5"
            onClick={() => router.push("/")}
          >
            <LogoMark size={26} />
            <span className="text-foreground text-sm font-bold tracking-[-0.02em]">
              AutoTube
            </span>
          </div>

          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="relative z-10 mb-11 hidden md:block">
          <div className="mb-2.5 text-[9.5px] font-bold tracking-[0.12em] text-(--text-dim) uppercase">
            Welcome Back
          </div>

          <h2
            className="font-heading text-foreground m-0 leading-[1.1] font-extrabold tracking-[-0.03em]"
            style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}
          >
            Sign in to
            <br />
            your workspace.
          </h2>
        </div>

        <div className="relative z-10 hidden flex-1 flex-col items-center justify-center md:flex">
          <motion.div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <div className="from-primary/30 absolute inset-0 rounded-3xl bg-linear-to-tr to-(--neon-purple)/30 blur-xl" />
            <div className="border-primary/20 bg-background/40 shadow-primary/10 hover:border-primary/40 hover:bg-background/50 relative flex h-full w-full items-center justify-center rounded-2xl border shadow-2xl backdrop-blur-xl transition-colors">
              <Globe
                size={36}
                className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>

          <p className="max-w-48 text-center text-[12px] leading-relaxed font-medium text-(--text-dim)">
            Access your AI-powered <br /> YouTube growth toolkit
          </p>
        </div>

        <div className="mt-auto hidden md:block">
          <div className="bg-border mb-5 h-px" />
          <blockquote className="text-muted-foreground m-0 mb-3 text-sm leading-[1.7] italic">
            &quot;Setting up took 2 minutes. Found my first golden gap 5 minutes
            later.&quot;
          </blockquote>
          <div className="flex items-center gap-2">
            <div className="from-primary flex h-5.5 w-5.5 items-center justify-center rounded-full bg-linear-to-br to-(--neon-purple)">
              <span className="text-[8px] font-extrabold text-white">MS</span>
            </div>
            <span className="text-[11px] text-(--text-dim)">
              Marwan Serry · 1M subscribers
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-8 md:items-center md:px-10 md:py-12">
        <div className="w-full max-w-120">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h2
                className="font-heading text-foreground m-0 mb-2 leading-[1.2] font-extrabold tracking-[-0.03em]"
                style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
              >
                Welcome back
              </h2>

              <p className="m-0 text-sm text-(--text-dim)">
                Sign in to your AutoTube workspace.
              </p>
            </div>

            {/* Social buttons */}
            <div className="mb-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="group rounded-button border-border text-foreground relative flex h-11.5 w-full cursor-pointer items-center gap-3 border bg-transparent px-4.5 text-sm font-medium transition-all duration-200 hover:border-(--surface-4) hover:bg-(--hover-overlay) active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2
                    size={16}
                    className="animate-spin text-(--text-dim)"
                  />
                ) : (
                  <FaGoogle
                    size={16}
                    className="text-foreground transition-colors duration-200"
                  />
                )}
                <span>
                  {isLoading
                    ? "Connecting to Google..."
                    : "Continue with Google"}
                </span>
              </button>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <div className="bg-border h-px flex-1" />
              <span className="text-[11px] text-(--text-dim)">
                or continue with email
              </span>
              <div className="bg-border h-px flex-1" />
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-6 flex flex-col gap-3"
            >
              {/* Email */}
              <div>
                <div className="mb-1.5 text-[10px] font-bold text-(--text-dim) uppercase">
                  Email address
                </div>

                <input
                  disabled={isLoading}
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="border-border focus:border-primary focus:ring-primary rounded-button text-foreground h-10.5 w-full border bg-(--surface-1) px-3.5 text-sm outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <FieldError message={errors.email?.message} />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 text-[10px] font-bold text-(--text-dim) uppercase">
                  Password
                </div>

                <PasswordInput disabled={isLoading} {...register("password")} />
                <FieldError message={errors.password?.message} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-foreground text-background rounded-button my-4 flex h-11.5 w-full cursor-pointer items-center justify-center gap-2 border-none text-sm font-bold transition-opacity hover:opacity-[0.86] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    Sign in <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-sm text-(--text-dim)">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="cursor-pointer font-semibold text-(--primary) hover:underline"
              >
                Sign up
              </button>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}
