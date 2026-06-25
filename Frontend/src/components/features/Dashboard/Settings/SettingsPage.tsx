"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CreditCard } from "lucide-react";

import { ProfileTab } from "./ProfileTab";
import { BillingTab } from "./BillingTab";
import { UpdatePaymentModal } from "./PaymentModel";
import { ChangePhotoModal } from "./Changephotomodal";
import { DeleteAccountModal } from "./Deleteaccountmodal";

import { useBilling } from "@/hooks/useBilling";
import { getAvatarName } from "@/lib/utils";
import {
  useGetProfileQuery,
  useUploadAvatarMutation,
  useDeleteAccountMutation,
} from "@/services/profileApi";
import type { DeleteAccountPayload } from "@/types/Profile";

export const settingsTabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "billing", label: "Billing & Usage", icon: CreditCard },
] as const;

export function SettingsPage() {
  const [tab, setTab] = useState("profile");

  // Modals State
  const [showPhoto, setShowPhoto] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Profile state for modals
  const { data: profile } = useGetProfileQuery(undefined, {
    selectFromResult: ({ data }) => ({ data: data ?? null }),
  });

  const [uploadAvatarMutation, { isLoading: isUploadingAvatar }] =
    useUploadAvatarMutation();
  const [deleteAccountMutation, { isLoading: isDeletingAccount }] =
    useDeleteAccountMutation();

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await uploadAvatarMutation(formData).unwrap();
      return response.imageUrl;
    } catch {
      return null;
    }
  };

  const deleteAccount = async (payload: DeleteAccountPayload) => {
    try {
      await deleteAccountMutation(payload).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  // Billing state
  const {
    subscription,
    usage,
    paymentMethod,
    isLoading,
    error,
    refetch,
    updatePayment,
    isUpdatingPayment,
  } = useBilling();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl p-5 md:p-8 md:pt-10">
        <div className="border-border mb-8 border-b">
          <div className="mb-6">
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
              Settings
            </h1>
            <p className="mt-1 text-sm text-(--text-dim)">
              Manage your account preferences and billing details.
            </p>
          </div>

          <div className="scrollbar-hide flex w-full">
            <div className="flex min-w-max items-center gap-6">
              {settingsTabs.map((t) => {
                const isActive = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`relative flex cursor-pointer items-center gap-2 pt-2 pb-3 text-[13px] font-semibold whitespace-nowrap transition-colors outline-none ${
                      isActive
                        ? "text-primary"
                        : "hover:text-foreground text-(--text-dim)"
                    }`}
                  >
                    <t.icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="tracking-tight">{t.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="settings-active-tab"
                        className="bg-primary absolute right-0 -bottom-px left-0 h-0.5 rounded-t-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "profile" && (
              <ProfileTab
                onShowPhoto={() => setShowPhoto(true)}
                onShowDelete={() => setShowDelete(true)}
              />
            )}

            {tab === "billing" && (
              <BillingTab
                onShowPayment={() => setShowPayment(true)}
                subscription={subscription}
                usage={usage}
                paymentMethod={paymentMethod}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MODALS  */}

      {/* Change Photo Modal */}
      {profile && (
        <ChangePhotoModal
          isOpen={showPhoto}
          onClose={() => setShowPhoto(false)}
          avatarInitials={getAvatarName(profile.basicInfo.fullName)}
          onUpload={uploadAvatar}
          isUploading={isUploadingAvatar}
        />
      )}

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={deleteAccount}
        isDeleting={isDeletingAccount}
      />

      {/* Payment  Modal */}
      <UpdatePaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onUpdatePayment={async (payload) => {
          const success = await updatePayment(payload);
          if (success) {
            refetch();
            return true;
          }
          return false;
        }}
        isUpdating={isUpdatingPayment}
      />
    </div>
  );
}
