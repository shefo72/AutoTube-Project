"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Trash2,
  Loader2,
  AlertCircle,
  Camera,
  Calendar,
  KeyRound,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { niches } from "@/constants/onboarding";
import { useProfile } from "@/hooks/useProfile";
import { getAvatarName, getValidImageUrl } from "@/lib/utils";

import {
  profileSchema,
  type ProfileFormValues,
} from "@/schemas/profile.schema";
import ProfileSkeleton from "./ProfileSkeleton";
import { ProfileError } from "./ProfileError";
import type {
  ProfileDetails,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/types/Profile";
import { useAppSelector } from "@/store";

export interface ProfileTabProps {
  onShowPhoto?: () => void;
  onShowDelete?: () => void;
}

interface ProfileTabContentProps {
  profile: ProfileDetails;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  isUpdating: boolean;
  isSuccess: boolean;
  fetchError: string | null;
  changePassword: (payload: ChangePasswordPayload) => Promise<boolean>;
  isChangingPassword: boolean;
  isChangePasswordSuccess: boolean;
  onShowPhoto?: () => void;
  onShowDelete?: () => void;
}

export function ProfileTab(props: ProfileTabProps) {
  const {
    isLoadingProfile,
    error,
    profile,
    refetch,
    updateProfile,
    isUpdating,
    isSuccess,
    changePassword,
    isChangingPassword,
    isChangePasswordSuccess,
  } = useProfile();

  if (isLoadingProfile) return <ProfileSkeleton />;

  if (error || !profile) {
    return (
      <ProfileError
        error={error ?? "Profile data not found."}
        reset={refetch}
      />
    );
  }

  return (
    <ProfileTabContent
      key={profile.basicInfo.email + (profile.selectedNiches?.join(",") ?? "")}
      profile={profile}
      updateProfile={updateProfile}
      isUpdating={isUpdating}
      isSuccess={isSuccess}
      fetchError={error}
      changePassword={changePassword}
      isChangingPassword={isChangingPassword}
      isChangePasswordSuccess={isChangePasswordSuccess}
      onShowPhoto={props.onShowPhoto}
      onShowDelete={props.onShowDelete}
    />
  );
}

function ProfileTabContent({
  profile,
  updateProfile,
  isUpdating,
  isSuccess,
  fetchError,
  changePassword,
  isChangingPassword,
  isChangePasswordSuccess,
  onShowPhoto,
  onShowDelete,
}: ProfileTabContentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.personalInfo.fullName ?? "",
      email: profile.personalInfo.email ?? "",
      dateOfBirth: profile.personalInfo.dateOfBirth ?? "",
      phoneNumber: profile.personalInfo.phoneNumber ?? "",
    },
    mode: "onChange",
  });

  const onSubmitPersonalInfo = async (data: ProfileFormValues) => {
    const payload: UpdateProfilePayload = {
      ...data,
      profileImageUrl: profile.basicInfo.profileImageUrl ?? "",
      selectedNiches: selectedNicheNames,
    };
    const success = await updateProfile(payload);
    if (success) {
      toast.success("Profile updated successfully!");
      reset(data);
    } else {
      toast.error("Failed to update profile.");
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const isPasswordFormReady =
    currentPassword.trim().length > 0 && newPassword.trim().length > 0;

  const handleChangePassword = async () => {
    if (!isPasswordFormReady) return;
    const payload: ChangePasswordPayload = {
      oldPassword: currentPassword,
      newPassword,
    };
    const success = await changePassword(payload);
    if (success) {
      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      toast.error("Failed to update password. Check your current password.");
    }
  };

  const initialNicheNames: string[] = Array.isArray(profile.selectedNiches)
    ? profile.selectedNiches
    : [];

  const [selectedNicheNames, setSelectedNicheNames] =
    useState<string[]>(initialNicheNames);

  const isNichesDirty =
    JSON.stringify([...selectedNicheNames].sort()) !==
    JSON.stringify([...initialNicheNames].sort());

  const toggleNiche = (label: string) => {
    setSelectedNicheNames((prev) =>
      prev.includes(label) ? prev.filter((n) => n !== label) : [...prev, label]
    );
  };

  const handleSaveNiches = async () => {
    const payload: UpdateProfilePayload = {
      fullName: profile.personalInfo.fullName ?? "",
      email: profile.personalInfo.email ?? "",
      dateOfBirth: profile.personalInfo.dateOfBirth ?? "",
      phoneNumber: profile.personalInfo.phoneNumber ?? "",
      profileImageUrl: profile.basicInfo.profileImageUrl ?? "",
      selectedNiches: selectedNicheNames,
    };

    const success = await updateProfile(payload);
    if (success) {
      toast.success("Niches saved!");
    } else {
      toast.error("Failed to save niches.");
    }
  };

  const { userInfo } = useAppSelector((state) => state.auth);
  const googleProvider = userInfo?.authProvider == "google";

  return (
    <div className="space-y-4">
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-6">
        <div
          className="pointer-events-none absolute top-0 right-0 h-48 w-48"
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(124,92,252,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#7C5CFC] to-[#A855F7] shadow-lg ring-1 ring-black/5 sm:h-24 sm:w-24 dark:ring-white/5">
            {profile.basicInfo.profileImageUrl ? (
              <Image
                src={getValidImageUrl(profile.basicInfo.profileImageUrl)}
                alt={profile.basicInfo.fullName}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {getAvatarName(profile.basicInfo.fullName)}
              </span>
            )}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
          </div>

          <div className="flex-1 space-y-1.5">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {profile.basicInfo.fullName}
            </h2>
            <p className="text-[13px] font-medium text-(--text-dim)">
              {profile.basicInfo.email}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="border-border/50 hover:border-primary/30 flex items-center gap-2 rounded-full border bg-(--surface-1) px-3 py-1 text-[11px] font-medium text-(--text-dim) transition-colors">
                <Calendar size={12} className="text-primary/70" />
                <span>Member since {profile.basicInfo.memberSince}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onShowPhoto}
            className="group border-border text-foreground hover:border-primary/40 flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border bg-(--surface-1) px-4 text-[12px] font-semibold transition-all duration-300 hover:bg-(--surface-2) hover:shadow-sm sm:w-auto"
          >
            <Camera
              size={14}
              className="group-hover:text-primary text-(--text-dim) transition-colors duration-300"
            />
            Change Photo
          </button>
        </div>
      </div>

      <div className="bg-card border-border flex flex-col rounded-2xl border p-6 md:p-8">
        <div className="mb-8">
          <div className="text-foreground mb-5 text-sm font-bold">
            Personal Information
          </div>
          <form onSubmit={handleSubmit(onSubmitPersonalInfo)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <InputField label="Full Name" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <InputField label="Email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <InputField
                  label="Date of Birth"
                  type="date"
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <InputField label="Phone Number" {...register("phoneNumber")} />
                {errors.phoneNumber && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {fetchError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                <AlertCircle size={16} />
                {fetchError}
              </div>
            )}

            {isDirty && (
              <div className="animate-in fade-in slide-in-from-top-2 mt-4 flex justify-end duration-300">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isUpdating}
                  iconLeft={
                    isSuccess ? (
                      <Check strokeWidth={4} size={14} />
                    ) : isUpdating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : undefined
                  }
                >
                  {isSuccess
                    ? "Saved!"
                    : isUpdating
                      ? "Saving…"
                      : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Password section */}
        {!googleProvider && (
          <>
            <div className="bg-border mb-8 h-px w-full" />
            <div>
              <div>
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-foreground mb-1 text-sm font-bold">
                      Password
                    </div>
                    <div className="text-[11px] text-(--text-dim)">
                      Update your account password to keep your workspace
                      secure.
                    </div>
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <PasswordInput
                      label="Current Password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <div className="flex items-center gap-1.5 pl-1 text-[10px] font-medium text-(--text-dim)">
                      <Lock size={12} className="text-primary/70" />
                      <span>Enter your existing password here</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <PasswordInput
                      label="New Password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="flex items-center gap-1.5 pl-1 text-[10px] font-medium text-(--text-dim)">
                      <KeyRound size={12} className="text-primary/70" />
                      <span>Create a new secure password here</span>
                    </div>
                  </div>
                </div>
              </div>

              {currentPassword && newPassword && (
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!isPasswordFormReady || isChangingPassword}
                    onClick={handleChangePassword}
                    iconLeft={
                      isChangePasswordSuccess ? (
                        <Check strokeWidth={4} size={14} />
                      ) : isChangingPassword ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : undefined
                    }
                  >
                    {isChangePasswordSuccess
                      ? "Updated!"
                      : isChangingPassword
                        ? "Updating…"
                        : "Update Password"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Niches card  */}
      <div className="bg-card border-border rounded-2xl border p-6 md:p-8">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-foreground text-sm font-bold">
            Content Niches
          </div>
        </div>
        <div className="mb-4 text-[11px] text-(--text-dim)">
          Personalize your recommendations.
        </div>
        <div className="flex flex-wrap gap-2">
          {niches.map((n) => {
            const active = selectedNicheNames.includes(n.label);
            return (
              <button
                key={n.id}
                onClick={() => toggleNiche(n.label)}
                className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-[11px] font-medium transition-all ${
                  active
                    ? "bg-primary border-primary text-white"
                    : "border-border hover:text-foreground bg-transparent text-(--text-dim) hover:bg-(--hover-overlay)"
                }`}
              >
                {active && <Check strokeWidth={4} size={10} />}
                {n.label}
              </button>
            );
          })}
        </div>

        {isNichesDirty && (
          <div className="animate-in fade-in slide-in-from-top-2 mt-4 flex justify-end duration-300">
            <Button
              type="button"
              onClick={handleSaveNiches}
              variant="primary"
              size="sm"
              disabled={isUpdating}
              iconLeft={
                isSuccess ? (
                  <Check strokeWidth={4} size={14} />
                ) : isUpdating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : undefined
              }
            >
              {isSuccess ? "Saved!" : isUpdating ? "Saving..." : "Save Niches"}
            </Button>
          </div>
        )}
      </div>

      {/* Delete account card  */}
      <div className="bg-card border-border rounded-2xl border p-6">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.03)] p-5 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]">
            <Trash2 size={15} color="#EF4444" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-[#EF4444]">
              Delete Account
            </div>
            <div className="mt-0.5 text-[11px] text-(--text-dim)">
              Permanently delete your account and all data.
            </div>
          </div>
          <button
            onClick={onShowDelete}
            className="h-8 cursor-pointer rounded-lg border border-[rgba(239,68,68,0.2)] bg-transparent px-3 text-[11px] font-medium text-[#EF4444] transition-all hover:bg-[rgba(239,68,68,0.08)]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
