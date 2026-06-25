import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

const authenticatedBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_AUTOTUBE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: authenticatedBaseQuery,
  keepUnusedDataFor: 300,
  tagTypes: [
    "Dashboard",
    "User",
    "Analytics",
    "Billing",
    "Profile",
    "Thumbnail",
    "Script",
    "Video",
    "GAP",
    "History",
  ],
  endpoints: () => ({}),
});
