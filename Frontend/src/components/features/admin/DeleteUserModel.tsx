"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<boolean>;
  isDeleting: boolean;
  userEmail: string;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
  userEmail,
}: DeleteUserModalProps) {
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const secretAdminPassword = process.env.NEXT_PUBLIC_ADMIN_DELETE_PASSWORD;

  const isSubmittable =
    deleteConfirm === userEmail && adminPassword === secretAdminPassword;

  async function handleDelete() {
    if (!isSubmittable) {
      if (
        adminPassword !== secretAdminPassword &&
        deleteConfirm === userEmail
      ) {
        toast.error("Incorrect admin password.");
      }
      return;
    }

    const success = await onDelete();

    if (success) {
      toast.success("User has been deleted successfully.");
      handleClose();
    } else {
      toast.error("Failed to delete user. Please try again later.");
    }
  }

  function handleClose() {
    setDeleteConfirm("");
    setAdminPassword("");
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Delete User"
      subtitle={`You are about to delete ${userEmail}`}
    >
      <div className="space-y-5 pt-2">
        {/* ── Warning banner ── */}
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 shadow-inner">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle size={16} className="text-[#EF4444]" />
          </div>
          <p className="pt-0.5 text-[13px] leading-relaxed text-(--text-dim)">
            All data associated with this user, including generations, projects,
            and billing history, will be{" "}
            <strong className="text-[#EF4444]">permanently deleted</strong>.
            This action cannot be undone.
          </p>
        </div>

        {/* ── Admin Password ── */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold tracking-widest text-(--text-dim) uppercase">
            Enter Admin Password
          </label>
          <PasswordInput
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* ── Confirmation text ── */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold tracking-widest text-(--text-dim)">
            Type{" "}
            <span className="rounded bg-red-500/10 px-1 font-mono text-[#EF4444] select-all">
              {userEmail}
            </span>{" "}
            to confirm
          </label>
          <input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={userEmail}
            className="border-border text-foreground placeholder:text-muted-foreground h-10 w-full rounded-xl border bg-(--surface-1) px-3 font-mono text-sm transition-all outline-none focus:border-[#EF4444] focus:ring-4 focus:ring-[rgba(239,68,68,0.15)]"
          />
        </div>

        {/* ── Actions ── */}
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
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
