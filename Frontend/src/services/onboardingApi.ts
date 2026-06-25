import { apiSlice } from "@/store/apiSlice";
import type { ApiSuccess } from "@/types/Profile";

const onboardingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitNiches: builder.mutation<ApiSuccess, { niches: string[] }>({
      query: (payload) => ({
        url: "/onboarding/niches",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Profile", "User"],
    }),

    submitGoals: builder.mutation<ApiSuccess, { goals: string[] }>({
      query: (payload) => ({
        url: "/onboarding/goals",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Profile", "User"],
    }),
  }),
});

export const { useSubmitNichesMutation, useSubmitGoalsMutation } =
  onboardingApi;
