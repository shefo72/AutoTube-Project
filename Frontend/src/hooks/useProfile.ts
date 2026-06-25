"use client";

import { useCallback } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "@/services/profileApi";
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  DeleteAccountPayload,
  UseProfileReturn,
} from "@/types/Profile";

export function useProfile(): UseProfileReturn {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: fetchError,
    refetch,
  } = useGetProfileQuery();

  const [
    updateProfileMutation,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateProfileMutation();
  const [
    uploadAvatarMutation,
    { isLoading: isUploadingAvatar, isSuccess: isUploadAvatarSuccess },
  ] = useUploadAvatarMutation();
  const [
    changePasswordMutation,
    { isLoading: isChangingPassword, isSuccess: isChangePasswordSuccess },
  ] = useChangePasswordMutation();
  const [deleteAccountMutation, { isLoading: isDeletingAccount }] =
    useDeleteAccountMutation();

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      try {
        await updateProfileMutation(payload).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [updateProfileMutation]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadAvatarMutation(formData).unwrap();
        return response.imageUrl;
      } catch {
        return null;
      }
    },
    [uploadAvatarMutation]
  );

  const changePassword = useCallback(
    async (payload: ChangePasswordPayload) => {
      try {
        await changePasswordMutation(payload).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [changePasswordMutation]
  );

  const deleteAccount = useCallback(
    async (payload: DeleteAccountPayload) => {
      try {
        await deleteAccountMutation(payload).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [deleteAccountMutation]
  );

  return {
    profile: profile ?? null,
    isLoadingProfile,
    error: fetchError ? "Failed to load profile" : null,
    refetch: handleRefetch,

    updateProfile,
    isUpdating,
    isUpdateSuccess,
    isSuccess: isUpdateSuccess,

    uploadAvatar,
    isUploadingAvatar,
    isUploadAvatarSuccess,

    changePassword,
    isChangingPassword,
    isChangePasswordSuccess,

    deleteAccount,
    isDeletingAccount,
  };
}
