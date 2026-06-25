"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthResponse, AuthState } from "@/types/user";
const TOKEN_KEY = "at-token";
const USER_KEY = "at-user";
const EXPIRES_AT_KEY = "at-expires";

function readFromStorage(): {
  token: string;
  user: User;
  expiresAt: string;
} | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);

  if (!token || !userStr || !expiresAt) return null;

  if (new Date(expiresAt) < new Date()) {
    clearStorage();
    return null;
  }

  try {
    const user = JSON.parse(userStr) as User;
    return { token, user, expiresAt };
  } catch {
    clearStorage();
    return null;
  }
}

function writeToStorage(token: string, user: User, expiresAt: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
}

function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: null,
  token: null,
  expiresAt: null,
  role: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { user, token, expiresAt, role } = action.payload;
      state.isAuthenticated = true;
      state.userInfo = user;
      state.token = token;
      state.expiresAt = expiresAt;
      state.isHydrated = true;
      state.role = role;
      writeToStorage(token, user, expiresAt);
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.token = null;
      state.expiresAt = null;
      state.isHydrated = true;
      clearStorage();
    },

    initAuth: (state) => {
      const stored = readFromStorage();
      if (stored) {
        state.isAuthenticated = true;
        state.token = stored.token;
        state.userInfo = stored.user;
        state.expiresAt = stored.expiresAt;
        state.role = stored.user.role;
      }
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, logout, initAuth } = authSlice.actions;

export default authSlice.reducer;
