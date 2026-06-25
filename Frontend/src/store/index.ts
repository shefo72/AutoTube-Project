import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import sidebarReducer from "./sidebarSlice";
import authReducer from "./authSlice";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools:
    process.env.NODE_ENV !== "production"
      ? {
          actionsDenylist: [
            "renderedTicks",
            "zIndex/registerZIndexPortal",
            "zIndex/unregisterZIndexPortal",
            "externalEvent",
            "focus",
            "mouseEnter",
            "mouseLeave",
            "mouseMove",
          ],
        }
      : false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
