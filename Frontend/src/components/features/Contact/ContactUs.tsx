"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Mail,
  MessageSquare,
  CheckCircle2,
  Activity,
  Bug,
  Rocket,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Please select a topic"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactFormData = z.infer<typeof contactSchema>;

const FORMSPREE_ID = "maqkenkv";

export default function ContactUs() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [activeSubject, setActiveSubject] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const subjects = [
    { id: "support", label: "Tech Support", icon: Bug },
    { id: "partnership", label: "Partnership", icon: Rocket },
    { id: "billing", label: "Quotas & Billing", icon: CreditCard },
    { id: "other", label: "General Chat", icon: MessageSquare },
  ];

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("submitting");
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        setActiveSubject("");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-background relative min-h-screen w-full overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="bg-primary/10 absolute top-[-20%] left-[-10%] h-150 w-150 rounded-full blur-[150px]" />
          <div className="bg-accent/10 absolute right-[-10%] bottom-[-20%] h-125 w-125 rounded-full blur-[120px]" />
          <div className="mask-image:linear-gradient(to_bottom,white,transparent) absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTI0LDkyLDI1MiwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 max-w-2xl"
          >
            <div className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <Sparkles size={14} /> We&apos;re online
            </div>
            <h1 className="text-foreground mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
              Let&apos;s connect.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Need more API quotas? Found a bug in the Gap Analyzer? Or just
              want to talk about the YouTube algorithm? Our engineering team is
              ready.
            </p>
          </motion.div>

          <div className="grid items-start gap-10 lg:grid-cols-12">
            {/* ── Left Side: Bento Grid Info ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"
            >
              {/* System Status Card (Premium Touch) */}
              <div className="border-border bg-card/50 col-span-full rounded-3xl border p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      <Activity size={18} />
                    </div>
                    <div>
                      <h3 className="text-foreground font-bold">
                        System Status
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Updated 1 min ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    All APIs Operational
                  </div>
                </div>
              </div>
              {/* Direct Email Card */}
              <div className="group border-border bg-card hover:border-primary/50 rounded-3xl border p-6 transition-colors">
                <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Mail size={22} />
                </div>
                <h3 className="text-foreground text-lg font-bold">Email Us</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  For general queries & support.
                </p>
                <a
                  href="mailto:support@autotube.com"
                  className="text-primary mt-4 block font-medium hover:underline"
                >
                  support@autotube.com
                </a>
              </div>

              {/* Community Card */}
              <div className="group border-border bg-card hover:border-primary/50 rounded-3xl border p-6 transition-colors">
                <div className="bg-accent/10 text-accent-foreground mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                  <MessageSquare size={22} />
                </div>
                <h3 className="text-foreground text-lg font-bold">
                  Creator Discord
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Share Video Packs & strategies.
                </p>
                <a
                  href="#"
                  className="text-accent-foreground mt-4 block font-medium hover:underline"
                >
                  Join the community &rarr;
                </a>
              </div>
            </motion.div>

            {/* ── Right Side: Interactive Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="border-border bg-card/40 -2xl relative overflow-hidden rounded-4xl border p-8 sm:p-10">
                <AnimatePresence mode="wait">
                  {submitStatus === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex min-h-112.5 flex-col items-center justify-center text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 text-green-500 ring-8 ring-green-500/5"
                      >
                        <CheckCircle2 size={48} />
                      </motion.div>
                      <h3 className="text-foreground mb-3 text-3xl font-extrabold">
                        Incoming!
                      </h3>
                      <p className="text-muted-foreground mb-8 max-w-sm text-lg">
                        Your transmission has been received. Our team will
                        decrypt it and reply shortly.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSubmitStatus("idle")}
                      >
                        Send another message
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col gap-8"
                    >
                      {/* Visual Subject Picker */}
                      <div className="space-y-3">
                        <label className="text-foreground flex justify-between text-sm font-bold">
                          What&apos;s on your mind?
                          {errors.subject && (
                            <span className="text-xs font-normal text-red-500">
                              {errors.subject.message}
                            </span>
                          )}
                        </label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {subjects.map((sub) => {
                            const Icon = sub.icon;
                            const isActive = activeSubject === sub.id;
                            return (
                              <button
                                type="button"
                                key={sub.id}
                                onClick={() => {
                                  setActiveSubject(sub.id);
                                  setValue("subject", sub.id, {
                                    shouldValidate: true,
                                  });
                                }}
                                className={cn(
                                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-200",
                                  isActive
                                    ? "border-primary bg-primary/10 text-primary scale-[0.98] shadow-[0_0_15px_rgba(124,92,252,0.15)]"
                                    : "border-border bg-background/50 text-muted-foreground hover:border-primary/30 hover:bg-background"
                                )}
                              >
                                <Icon size={20} />
                                <span className="text-xs font-semibold">
                                  {sub.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <input type="hidden" {...register("subject")} />
                      </div>

                      {/* User Details */}
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                            Your Name
                          </label>
                          <input
                            {...register("name")}
                            placeholder="e.g. MrBeast"
                            className={cn(
                              "bg-background/50 text-foreground focus:border-primary focus:bg-background focus:ring-primary placeholder:text-muted-foreground/50 w-full rounded-2xl border px-5 py-3.5 text-sm transition-all outline-none focus:ring-1",
                              errors.name ? "border-red-500" : "border-border"
                            )}
                          />
                          {errors.name && (
                            <span className="text-xs text-red-500">
                              {errors.name.message}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                            Email Address
                          </label>
                          <input
                            {...register("email")}
                            placeholder="hello@creator.com"
                            className={cn(
                              "bg-background/50 text-foreground focus:border-primary focus:bg-background focus:ring-primary placeholder:text-muted-foreground/50 w-full rounded-2xl border px-5 py-3.5 text-sm transition-all outline-none focus:ring-1",
                              errors.email ? "border-red-500" : "border-border"
                            )}
                          />
                          {errors.email && (
                            <span className="text-xs text-red-500">
                              {errors.email.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-2">
                        <label className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                          Message Details
                        </label>
                        <textarea
                          {...register("message")}
                          placeholder="Tell us about your project, API needs, or issues..."
                          rows={5}
                          className={cn(
                            "bg-background/50 text-foreground focus:border-primary focus:bg-background focus:ring-primary placeholder:text-muted-foreground/50 w-full resize-none rounded-2xl border px-5 py-4 text-sm transition-all outline-none focus:ring-1",
                            errors.message ? "border-red-500" : "border-border"
                          )}
                        />
                        {errors.message && (
                          <span className="text-xs text-red-500">
                            {errors.message.message}
                          </span>
                        )}
                      </div>

                      {/* Error State */}
                      {submitStatus === "error" && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-500">
                          Connection failed. Please check your network and try
                          again.
                        </div>
                      )}

                      {/* Submit Button Component */}
                      <Button
                        type="submit"
                        variant="primary"
                        size="xl"
                        fullWidth
                        disabled={submitStatus === "submitting"}
                        className="mt-4"
                      >
                        {submitStatus === "submitting" ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={18} className="animate-spin" />{" "}
                            Transmitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Launch Message <Send size={16} />
                          </span>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
