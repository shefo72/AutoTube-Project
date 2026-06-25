"use client";

import { type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { AuthProvider } from "@/components/layout/AuthProvider";

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
