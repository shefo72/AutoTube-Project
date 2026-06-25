export interface User {
  userId: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  authProvider: string;
  createdAt: string;
  phoneNumber: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
  role: "admin" | "user" | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  userInfo: User | null;
  token: string | null;
  expiresAt: string | null;
  isHydrated: boolean;
  role: "admin" | "user" | null;
}
