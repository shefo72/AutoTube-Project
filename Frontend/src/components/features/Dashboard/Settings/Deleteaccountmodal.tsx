"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { PasswordInput } from "@/components/ui/PasswordInput";
import type { DeleteAccountPayload } from "@/types/Profile";
import { useAppSelector } from "@/store";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (payload: DeleteAccountPayload) => Promise<boolean>;
  isDeleting: boolean;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
}: DeleteAccountModalProps) {
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const { userInfo } = useAppSelector((state) => state.auth);
  const googleProvider = userInfo?.authProvider === "google";

  const isSubmittable = googleProvider
    ? deleteConfirm === "DELETE"
    : deleteConfirm === "DELETE" && deletePassword.trim() !== "";

  async function handleDelete() {
    if (!isSubmittable) return;

    const payload: DeleteAccountPayload = {
      confirmationText: "DELETE",
    };

    if (!googleProvider) {
      payload.password = deletePassword;
    }

    const success = await onDelete(payload);

    if (success) {
      handleClose();
    } else {
      toast.error(
        googleProvider
          ? "Failed to delete account. Please try again later."
          : "Failed to delete account. Check your password and try again."
      );
    }
  }

  function handleClose() {
    setDeleteConfirm("");
    setDeletePassword("");
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Delete Account"
      subtitle="This action cannot be undone."
    >
      <div className="space-y-5 pt-2">
        {/* Warning banner */}
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 shadow-inner">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle size={16} className="text-[#EF4444]" />
          </div>
          <p className="pt-0.5 text-[13px] leading-relaxed text-(--text-dim)">
            All your data including analyses, scripts, video packs, and billing
            history will be{" "}
            <strong className="text-[#EF4444]">permanently deleted</strong>.
          </p>
        </div>

        {/* Password */}
        {!googleProvider && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-widest text-(--text-dim) uppercase">
              Enter your password
            </label>
            <PasswordInput
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        )}

        {/* Confirmation text */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold tracking-widest text-(--text-dim) uppercase">
            Type{" "}
            <span className="rounded bg-red-500/10 px-1 font-mono text-[#EF4444] select-all">
              DELETE
            </span>{" "}
            to confirm
          </label>
          <input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value.toUpperCase())}
            placeholder="DELETE"
            className="border-border text-foreground placeholder:text-muted-foreground h-10 w-full rounded-xl border bg-(--surface-1) px-3 font-mono text-sm transition-all outline-none focus:border-[#EF4444] focus:ring-4 focus:ring-[rgba(239,68,68,0.15)]"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="border-border hover:text-foreground h-10 flex-1 cursor-pointer rounded-xl border bg-transparent text-sm font-semibold text-(--text-dim) transition-all hover:bg-(--surface-2) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isSubmittable || isDeleting}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-[#EF4444] text-sm font-bold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_16px_rgba(239,68,68,0.4)] disabled:cursor-not-allowed disabled:bg-red-500/30 disabled:text-white/50 disabled:hover:shadow-none"
          >
            {isDeleting && <Loader2 size={14} className="animate-spin" />}
            {isDeleting ? "Deleting…" : "Delete Forever"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
