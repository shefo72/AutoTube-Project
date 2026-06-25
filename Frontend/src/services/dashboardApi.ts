import { apiSlice } from "@/store/apiSlice";
import type { DashboardResponse } from "@/types/userDashboard";

const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboard: builder.query<DashboardResponse, void>({
      query: () => "/UserDashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetUserDashboardQuery } = dashboardApi;
