"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Globe, Loader2, Sparkles } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoMark } from "@/components/ui/Logo/LogoMark";
import { PasswordInput } from "@/components/ui/PasswordInput";
import FieldError from "@/components/ui/FieldError";

import { signupSchema, SignupFormValues } from "@/schemas/signupSchema";
import { useSignupMutation } from "@/services/authApi";

const MotionDiv = motion.div;

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    try {
      await signup(values).unwrap();
      toast.success("Account created successfully!");
      router.push("/onboarding");
    } catch (err: unknown) {
      const error = err as {
        data?: { message?: string; errors?: Record<string, string> };
        status?: number;
      };

      toast.error(error.data?.message || "Signup failed");

      if (error.data?.errors) {
        Object.keys(error.data.errors).forEach((key) => {
          setError(key as keyof SignupFormValues, {
            message: error.data!.errors![key],
          });
        });
      }
    }
  };

  const handleGoogleSignup = () => {
    localStorage.setItem("authType", "signup");

    const redirectUrl = `${window.location.origin}/auth/success`;

    window.location.href = `${process.env.NEXT_PUBLIC_AUTOTUBE_API_URL}/auth/google-login?redirectUrl=${encodeURIComponent(
      redirectUrl
    )}`;
  };

  return (
    <div className="bg-background relative flex h-screen flex-col md:flex-row">
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <ThemeToggle />
      </div>

      {/* Left Rail */}
      <div className="border-border relative z-10 flex w-full shrink-0 flex-col overflow-hidden border-b bg-(--surface-0) px-6 py-6 md:w-80 md:border-r md:border-b-0 md:px-8 md:py-10">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute right-[-20%] bottom-[20%] h-62.5 w-62.5 rounded-full bg-(--neon-purple) blur-[100px]"
          />
        </div>

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

        <div className="relative z-10 mb-10 hidden md:block">
          <div className="mb-2.5 flex items-center gap-1.5 text-[9.5px] font-bold tracking-[0.12em] text-(--text-dim) uppercase">
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            Get Started
          </div>

          <h2
            className="font-heading text-foreground m-0 leading-[1.1] font-extrabold tracking-[-0.03em]"
            style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}
          >
            Create your
            <br />
            free account.
          </h2>
        </div>

        <div className="relative z-10 mt-4 hidden flex-1 flex-col gap-2 md:flex">
          {[
            { icon: Sparkles, text: "AI-powered gap analysis" },
            { icon: Globe, text: "Complete video packages" },
            { icon: ArrowRight, text: "Real-time analytics" },
          ].map((item, i) => (
            <div
              key={i}
              className="group hover:border-border/50 flex items-center gap-3.5 rounded-xl border border-transparent p-2 transition-all hover:bg-(--surface-1)/40"
            >
              <div className="border-primary/20 bg-primary/5 group-hover:bg-primary/10 relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all group-hover:shadow-[0_0_12px_rgba(var(--primary),0.15)]">
                <item.icon
                  size={14}
                  className="text-primary transition-transform group-hover:scale-110"
                />
              </div>
              <span className="group-hover:text-foreground text-[13px] font-medium text-(--text-dim) transition-colors">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="bg-border mb-5 h-px" />
          <blockquote className="text-muted-foreground m-0 mb-3 text-sm leading-[1.7] italic">
            &quot;A tactical masterclass. That first Golden Gap felt like
            breaking down a low-block defense!&quot;
          </blockquote>
          <div className="flex items-center gap-2">
            <div className="from-primary flex h-5.5 w-5.5 items-center justify-center rounded-full bg-linear-to-br to-(--neon-purple)">
              <span className="text-[8px] font-extrabold text-white">AN</span>
            </div>
            <span className="text-[11px] text-(--text-dim)">
              Amr Nassoohy · 3.17M subscribers
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="[&::-webkit-scrollbar-thumb]:bg-border flex flex-1 flex-col overflow-y-auto px-6 py-8 md:px-10 md:py-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="w-full max-w-120">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8">
                <h2
                  className="font-heading text-foreground m-0 mb-2 leading-[1.2] font-extrabold tracking-[-0.03em]"
                  style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
                >
                  Create your account
                </h2>

                <p className="m-0 text-sm text-(--text-dim)">
                  Get started in seconds. No credit card required.
                </p>
              </div>

              {/* social buttons */}
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

              {/* divider */}
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-border h-px flex-1" />
                <span className="text-[11px] text-(--text-dim)">
                  or continue with email
                </span>
                <div className="bg-border h-px flex-1" />
              </div>

              {/* form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mb-6 flex flex-col gap-3"
              >
                {/* Full Name */}
                <div>
                  <div className="mb-1 text-[10px] font-bold text-(--text-dim) uppercase">
                    Full Name
                  </div>
                  <input
                    {...register("fullName")}
                    placeholder="Alex Turner"
                    className="border-border focus:border-primary focus:ring-primary rounded-button text-foreground h-10.5 w-full border bg-(--surface-1) px-3.5 text-sm outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <FieldError message={errors.fullName?.message} />
                </div>

                {/* Email */}
                <div>
                  <div className="mb-1 text-[10px] font-bold text-(--text-dim) uppercase">
                    Email address
                  </div>
                  <input
                    {...register("email")}
                    placeholder="you@example.com"
                    className="border-border focus:border-primary focus:ring-primary rounded-button text-foreground h-10.5 w-full border bg-(--surface-1) px-3.5 text-sm outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                {/* Phone */}
                <div>
                  <div className="mb-1 text-[10px] font-bold text-(--text-dim) uppercase">
                    PhoneNumber
                  </div>
                  <input
                    {...register("PhoneNumber")}
                    placeholder="+201123456789"
                    className="border-border focus:border-primary focus:ring-primary rounded-button text-foreground h-10.5 w-full border bg-(--surface-1) px-3.5 text-sm outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <FieldError message={errors.PhoneNumber?.message} />
                </div>

                {/* Birthday */}
                <div>
                  <div className="mb-1 text-[10px] font-bold text-(--text-dim) uppercase">
                    Birthday
                  </div>
                  <input
                    {...register("dateOfBirth")}
                    placeholder="MM/DD/YYYY"
                    type="date"
                    className="border-border focus:border-primary focus:ring-primary rounded-button text-foreground h-10.5 w-full border bg-(--surface-1) px-3.5 text-sm outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <FieldError message={errors.dateOfBirth?.message} />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1 text-[10px] font-bold text-(--text-dim) uppercase">
                    Password
                  </div>
                  <PasswordInput
                    {...register("password")}
                    placeholder="Min. 8 characters"
                    className="h-11.5 w-full"
                  />
                  <FieldError message={errors.password?.message} />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-foreground text-background rounded-button my-4 flex h-11.5 w-full cursor-pointer items-center justify-center gap-2 border-none text-sm font-bold transition-opacity hover:opacity-[0.86] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 size={16} />
                    </motion.div>
                  ) : (
                    <>
                      Create account <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-sm text-(--text-dim)">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="cursor-pointer border-none bg-transparent p-0 font-semibold text-(--primary) hover:underline"
                >
                  Login
                </button>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  );
}
