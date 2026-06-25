export interface ProfileDetails {
  basicInfo: {
    profileImageUrl?: string;
    fullName: string;
    email: string;
    youTubeChannel: string;
    planType: string;
    memberSince: string;
  };
  personalInfo: {
    fullName: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
  selectedNiches: string[];
}

export interface UpdateProfilePayload {
  profileImageUrl: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  selectedNiches: string[];
}

export interface UploadImageResponse {
  imageUrl: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password?: string;
  confirmationText: "DELETE";
}

export interface ApiSuccess {
  message: string;
}

export interface UseProfileReturn {
  profile: ProfileDetails | null;
  isLoadingProfile: boolean;
  error: string | null;
  refetch: () => Promise<void>;

  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  isUpdating: boolean;
  isUpdateSuccess: boolean;
  isSuccess: boolean;

  uploadAvatar: (file: File) => Promise<string | null>;
  isUploadingAvatar: boolean;
  isUploadAvatarSuccess: boolean;

  changePassword: (payload: ChangePasswordPayload) => Promise<boolean>;
  isChangingPassword: boolean;
  isChangePasswordSuccess: boolean;

  deleteAccount: (payload: DeleteAccountPayload) => Promise<boolean>;
  isDeletingAccount: boolean;
}
