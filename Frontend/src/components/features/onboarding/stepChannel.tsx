import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Clipboard,
  AlertCircle,
} from "lucide-react";
import { stepAnimation } from "@/lib/animations";
import { FaYoutube as Youtube } from "react-icons/fa";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useSubmitChannelIdMutation } from "@/services/youtubeChannel";
import { useSyncDashboardAnalyticsMutation } from "@/services/analyticsApi";

const channelSchema = z.object({
  channelId: z
    .string()
    .min(1, "Channel ID is required")
    .regex(
      /^UC[\w-]{22}$/,
      "Invalid ID. Must be exactly 24 characters and start with 'UC'"
    ),
});

type ChannelFormValues = z.infer<typeof channelSchema>;

interface StepChannelProps {
  channelId: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepChannel({
  channelId,
  onChange,
  onNext,
  onBack,
}: StepChannelProps) {
  const [submitChannelId, { isLoading: isSubmitting }] =
    useSubmitChannelIdMutation();
  const [syncDashboardAnalytics, { isLoading: isSyncing }] =
    useSyncDashboardAnalyticsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: { channelId: channelId || "" },
    mode: "onChange",
  });

  const currentInputValue = useWatch({
    control,
    name: "channelId",
  });

  const isProcessing = isSubmitting || isSyncing;

  const onSubmit = async (data: ChannelFormValues) => {
    try {
      await submitChannelId({ channelId: data.channelId }).unwrap();

      await syncDashboardAnalytics(data.channelId).unwrap();

      onChange(data.channelId);
      onNext();
    } catch (error) {
      console.error("Failed to submit or sync channel ID:", error);
      setError("channelId", {
        type: "server",
        message: "Failed to verify or sync channel. Please try again.",
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleanText = text.trim();
      setValue("channelId", cleanText, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleSkip = () => {
    onChange("");
    onNext();
  };

  return (
    <motion.div {...stepAnimation}>
      <div className="mb-7">
        <h2
          className="text-foreground m-0 mb-2 leading-[1.2] font-extrabold tracking-[-0.03em]"
          style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
        >
          Connect your channel
        </h2>
        <p className="m-0 text-sm text-(--text-dim)">
          Enter your YouTube Channel ID so AutoTube can analyze your content and
          tailor your experience.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 flex flex-col gap-4"
      >
        <div className="group relative">
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-300 ${
              errors.channelId
                ? "text-red-500"
                : "text-(--text-dim) group-focus-within:text-[#FF0000]"
            }`}
          >
            <Youtube size={18} />
          </div>

          <input
            {...register("channelId")}
            type="text"
            placeholder="e.g., UC_x5XG1OV2PquZ5SAMxVjuA"
            className={`text-foreground w-full rounded-xl border bg-(--surface-1) py-3.5 pr-14 pl-11 font-mono text-sm transition-all duration-300 outline-none placeholder:text-(--text-dim)/50 focus:ring-4 ${
              errors.channelId
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                : "border-border focus:border-primary/50 focus:ring-primary/10"
            }`}
            spellCheck={false}
          />

          {!currentInputValue && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="button"
              onClick={handlePaste}
              className="hover:text-foreground absolute inset-y-2 right-2 flex items-center gap-1.5 rounded-lg bg-(--surface-2) px-3 text-[10px] font-bold text-(--text-dim) transition-colors hover:bg-(--surface-3)"
            >
              <Clipboard size={12} />
              PASTE
            </motion.button>
          )}

          {isValid && !errors.channelId && (
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
            </div>
          )}
        </div>

        <AnimatePresence>
          {errors.channelId && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="flex items-center gap-1.5 text-[12px] font-medium text-red-500"
            >
              <AlertCircle size={14} />
              {errors.channelId.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-border/50 mt-2 flex items-start gap-2.5 rounded-lg border bg-(--surface-1)/50 p-3.5">
          <Info size={14} className="mt-0.5 shrink-0 text-(--text-dim)" />
          <div className="text-[12px] leading-relaxed text-(--text-dim)">
            Your Channel ID is a 24-character string starting with{" "}
            <strong className="text-foreground font-mono">UC</strong>. You can
            find it in your YouTube Studio under{" "}
            <strong className="text-foreground">
              Settings &gt; Advanced settings
            </strong>
            .
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="border-border text-muted-foreground rounded-button hover:text-foreground flex h-11.5 cursor-pointer items-center gap-1.5 border bg-transparent px-4.5 text-sm font-medium transition-all hover:border-(--surface-4)"
            >
              <ArrowLeft size={13} /> Back
            </button>

            <motion.button
              type="submit"
              whileHover={isValid && !isProcessing ? "hover" : ""}
              whileTap={isValid && !isProcessing ? { scale: 0.98 } : {}}
              disabled={!isValid || isProcessing}
              className="bg-foreground text-background flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-none text-sm font-bold transition-all disabled:cursor-not-allowed disabled:bg-(--surface-3) disabled:text-(--text-dim) disabled:opacity-30"
            >
              {isProcessing ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                <>
                  Continue
                  <motion.div
                    variants={{
                      hover: { x: 5 },
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </>
              )}
            </motion.button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="hover:text-foreground cursor-pointer text-xs font-medium text-(--text-dim) underline-offset-4 transition-colors hover:underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
