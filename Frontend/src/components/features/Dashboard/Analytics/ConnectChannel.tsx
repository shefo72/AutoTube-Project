"use client";

import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Clipboard, AlertCircle } from "lucide-react";
import { useSubmitChannelIdMutation } from "@/services/youtubeChannel";
import { useSyncDashboardAnalyticsMutation } from "@/services/analyticsApi";
import { FaYoutube as Youtube } from "react-icons/fa";

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

export function ConnectChannel() {
  const [submitChannelId, { isLoading: isSubmitting }] =
    useSubmitChannelIdMutation();
  const [syncDashboardAnalytics, { isLoading: isSyncing }] =
    useSyncDashboardAnalyticsMutation();

  const isProcessing = isSubmitting || isSyncing;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: { channelId: "" },
    mode: "onChange",
  });

  const currentInputValue = useWatch({ control, name: "channelId" });

  const onSubmit = async (data: ChannelFormValues) => {
    try {
      await submitChannelId({ channelId: data.channelId }).unwrap();
      await syncDashboardAnalytics(data.channelId).unwrap();
    } catch {
      setError("channelId", {
        type: "server",
        message: "Failed to verify or sync channel. Please try again.",
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("channelId", text.trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col items-center justify-center p-6 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <Youtube size={40} />
      </div>

      <h2 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
        No Channel Connected
      </h2>
      <p className="text-muted-foreground mx-auto mb-8 max-w-md text-sm leading-relaxed">
        To view your advanced analytics, performance metrics, and content gaps,
        please link your YouTube Channel ID.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="group relative mb-4">
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-300 ${
              errors.channelId ? "text-red-500" : "text-(--text-dim)"
            }`}
          >
            <Youtube size={18} />
          </div>

          <input
            {...register("channelId")}
            type="text"
            placeholder="e.g., UC_x5XG1OV2PquZ5SAMxVjuA"
            className={`text-foreground w-full rounded-xl border bg-(--surface-1) py-3.5 pr-14 pl-11 font-mono text-sm transition-all duration-300 outline-none focus:ring-4 ${
              errors.channelId
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                : "border-border focus:border-primary/50 focus:ring-primary/10"
            }`}
          />

          {!currentInputValue && (
            <button
              type="button"
              onClick={handlePaste}
              className="hover:text-foreground absolute inset-y-2 right-2 flex cursor-pointer items-center gap-1.5 rounded-lg bg-(--surface-2) px-3 text-[10px] font-bold text-(--text-dim) transition-colors hover:bg-(--surface-3)"
            >
              <Clipboard size={12} /> PASTE
            </button>
          )}
        </div>

        {errors.channelId && (
          <div className="mb-4 flex items-center justify-center gap-1.5 text-[12px] font-medium text-red-500">
            <AlertCircle size={14} /> {errors.channelId.message}
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={isValid && !isProcessing ? { scale: 1.02 } : {}}
          whileTap={isValid && !isProcessing ? { scale: 0.98 } : {}}
          disabled={!isValid || isProcessing}
          className="bg-foreground text-background flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="animate-pulse">Connecting...</span>
          ) : (
            <>
              Connect Channel <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
