import type { settingsTabs } from "@/components/features/Dashboard/Settings/SettingsPage";

export type SettingsTabKey = (typeof settingsTabs)[number]["key"];
export interface ProfileData {
  fullName: string;
  email: string;
  youtube: string;
  phone: string;
}

export interface PasswordData {
  current: string;
  new: string;
}

export interface UseProfileLogicReturn {
  // Profile form
  profileData: ProfileData;
  initialProfile: ProfileData;
  isProfileDirty: boolean;
  isSavingProfile: boolean;
  setProfileData: (data: ProfileData) => void;
  handleProfileSave: () => void;

  // Password form
  pwdData: PasswordData;
  isPwdDirty: boolean;
  isSavingPwd: boolean;
  pwdSaved: boolean;
  setPwdData: (data: PasswordData) => void;
  handlePwdUpdate: () => void;

  // Content niches
  selectedNiches: string[];
  isNichesDirty: boolean;
  isSavingNiches: boolean;
  toggleNiche: (niche: string) => void;
  handleNichesSave: () => void;
}
