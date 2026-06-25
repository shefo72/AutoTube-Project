"use client";

import { Modal } from "@/components/ui/Modal";
import { UserData, UserDetails, UserStatus } from "@/types/adminDashboard";
import { STATUS_OPTIONS } from "@/constants/adminDashboard";

interface ChangeStatusModalProps {
  user: UserData | UserDetails | null;
  onClose: () => void;
  onStatusChange: (id: number, status: UserStatus) => void;
}

export function ChangeStatusModal({
  user,
  onClose,
  onStatusChange,
}: ChangeStatusModalProps) {
  return (
    <Modal
      open={!!user}
      onClose={onClose}
      title={`Change Status — ${user?.name || (user as UserDetails)?.fullName}`}
      subtitle="Update user account status."
    >
      {user && (
        <div className="space-y-3 pt-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => onStatusChange(user.id, s.value as UserStatus)}
              className="border-border flex w-full cursor-pointer items-center justify-between rounded-xl border bg-transparent p-4 transition-all hover:bg-(--hover-overlay)"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}20`,
                  }}
                >
                  <s.icon size={14} color={s.color} />
                </div>
                <div className="text-foreground text-[13px] font-medium">
                  {s.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
