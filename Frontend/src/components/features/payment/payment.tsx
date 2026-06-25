"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Lock, ArrowLeft, Check, Shield } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoMark } from "@/components/ui/Logo/LogoMark";
import FieldError from "@/components/ui/FieldError";

// Services & Utils
import { useSubscribeMutation } from "@/services/billingApi";
import { plansData } from "@/constants/PricingPlans";
import { fadeIn } from "@/lib/animations";

import { paymentSchema } from "@/schemas/paymentSchema";
import { FieldProps, PaymentFormData } from "@/types/payment";

const D = motion.create("div");

const PLAN_IDS: Record<string, number> = {
  Pro: 2,
  Agency: 3,
};

export default function PaymentPage() {
  const router = useRouter();
  const [subscribeMutation] = useSubscribeMutation();

  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentFormData, string>>
  >({});

  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const currentPlan = plansData.find((p) => p.name === selectedPlan)!;
  const validateField = (name: keyof PaymentFormData, value: string) => {
    const fieldSchema = paymentSchema.shape[name];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (result.success) {
        delete newErrors[name];
      } else {
        newErrors[name] = result.error.issues[0].message;
      }
      return newErrors;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof PaymentFormData;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    validateField(fieldName, value);
  };

  const handleSubmit = async () => {
    const result = paymentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PaymentFormData, string>> = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof PaymentFormData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setProcessing(true);

      const response = await subscribeMutation({
        subscriptionPlanId: PLAN_IDS[selectedPlan],
        paymentGatewayId: 1,
        cardHolderName: formData.cardholderName,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
      }).unwrap();

      if (response?.success) {
        toast.success("Payment successful");
        setDone(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch {
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      <header className="border-border bg-background top-0 z-50 w-full border-b transition-colors duration-300">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex flex-1 justify-start">
            <button
              onClick={() => router.back()}
              className="group text-muted-foreground hover:text-foreground hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200"
            >
              <ArrowLeft
                size={16}
                strokeWidth={2.5}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              <span className="hidden font-medium md:inline">Back</span>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center gap-2.5 select-none">
            <div className="text-foreground transition-transform duration-500 hover:rotate-12">
              <LogoMark size={28} />
            </div>
            <span className="font-heading text-foreground text-xl font-black tracking-tighter">
              AutoTube
            </span>
          </div>

          <div className="flex flex-1 items-center justify-end">
            <div className="scale-95 transition-transform duration-200 hover:scale-100">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-16">
        <D {...fadeIn(0)} className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--border-active) bg-(--accent) px-3 py-1">
            <Lock size={10} className="text-primary" />
            <span className="text-accent-foreground text-[10px] font-bold tracking-widest uppercase">
              Secure Checkout
            </span>
          </div>

          <h1
            className="font-heading text-foreground mb-2 font-extrabold tracking-tight"
            style={{ fontSize: "clamp(24px, 4vw, 36px)" }}
          >
            Complete your subscription
          </h1>

          <p className="text-sm text-(--text-dim)">
            Your payment is encrypted and secure.
          </p>
        </D>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <D {...fadeIn(0.1)} className="space-y-5 lg:col-span-3">
            {/* Plan Selector */}
            <div className="bg-card border-border rounded-2xl border p-6">
              <div className="text-foreground mb-4 text-sm font-bold">
                Select Plan
              </div>
              <div className="grid grid-cols-2 gap-3">
                {plansData.map((p) =>
                  p.name === "Starter" ? null : (
                    <button
                      key={p.name}
                      onClick={() => setSelectedPlan(p.name)}
                      className={`relative cursor-pointer rounded-xl border p-4 text-left transition-all ${
                        selectedPlan === p.name
                          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_var(--primary)]"
                          : "border-border bg-transparent hover:border-(--surface-4)"
                      }`}
                    >
                      {p.popular && (
                        <span className="bg-primary absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[8px] font-bold text-white">
                          POPULAR
                        </span>
                      )}
                      <div className="mb-1 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
                        {p.name}
                      </div>
                      <div className="text-foreground font-mono text-lg font-extrabold">
                        {p.price}
                      </div>
                      <div className="text-[10px] text-(--text-dim)">
                        {p.period}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-card border-border rounded-2xl border p-6">
              <div className="mb-5 flex items-center gap-2">
                <CreditCard size={15} className="text-primary" />
                <div className="text-foreground text-sm font-bold">
                  Card Details
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Field
                    label="Cardholder Name"
                    placeholder="e.g., Ahmed Sherif"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                  />
                  <FieldError message={errors.cardholderName} />
                </div>

                <div>
                  <Field
                    label="Card Number"
                    placeholder="0000 0000 0000 0000"
                    name="cardNumber"
                    maxLength={16}
                    value={formData.cardNumber}
                    onChange={handleChange}
                  />
                  <FieldError message={errors.cardNumber} />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Field
                      label="Expiry Date"
                      placeholder="MM / YY"
                      maxLength={5}
                      half
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                    <FieldError message={errors.expiryDate} />
                  </div>

                  <div className="flex-1">
                    <Field
                      label="CVC"
                      placeholder="123"
                      maxLength={3}
                      half
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleChange}
                    />
                    <FieldError message={errors.cvc} />
                  </div>
                </div>
              </div>
            </div>
          </D>

          <D {...fadeIn(0.2)} className="lg:col-span-2">
            <div className="bg-card border-border sticky top-24 rounded-2xl border p-6">
              <div className="text-foreground mb-5 text-sm font-bold">
                Plan Details
              </div>

              <div className="border-border mb-4 space-y-3 border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-(--text-dim)">
                    AutoTube {currentPlan.name}
                  </span>
                  <span className="text-foreground text-sm font-bold">
                    {currentPlan.price}
                    {currentPlan.period !== "forever" ? currentPlan.period : ""}
                  </span>
                </div>
              </div>

              <div className="mb-5 space-y-2">
                {currentPlan.features.map((f) => (
                  <div key={f.text} className="flex items-center gap-2">
                    <div className="bg-primary flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                      <Check size={8} color="white" />
                    </div>
                    <span className="text-[12px] text-(--text-dim)">
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-border mb-5 flex items-baseline justify-between border-t py-3">
                <span className="text-foreground text-sm font-bold">
                  Total today
                </span>
                <span className="text-foreground font-mono text-xl font-extrabold">
                  {currentPlan.price}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={processing || done}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "var(--gradient-aurora)",
                  backgroundSize: "200% 200%",
                  animation: "at-gradient-shift 4s ease infinite",
                  boxShadow: "var(--glow-primary-sm)",
                }}
              >
                {done ? (
                  <>
                    <Check size={14} />
                    Payment Successful!
                  </>
                ) : processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={13} />
                    Subscribe Now
                  </>
                )}
              </motion.button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-(--text-dim)">
                <Shield size={10} />
                256-bit SSL · Stripe Secure
              </div>
            </div>
          </D>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  half = false,
  name,
  value,
  maxLength,
  onChange,
}: FieldProps) {
  return (
    <div className={half ? "flex-1" : ""}>
      <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
        {label}
      </div>
      <input
        maxLength={maxLength}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11 w-full rounded-xl border bg-(--surface-1) px-4 text-sm transition-all outline-none hover:border-(--surface-4) focus:ring-2 focus:ring-(--ring)"
      />
    </div>
  );
}
