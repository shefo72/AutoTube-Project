/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "@/store/apiSlice";
import type { AnalyticsData } from "@/types/analytics";

const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<AnalyticsData, string>({
      query: (channelId) => `/Dashboard/${channelId}`,
      providesTags: ["Analytics"],
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: AnalyticsData;
      }) => {
        return response.data;
      },
    }),

    syncDashboardAnalytics: builder.mutation<any, string>({
      query: (channelId) => ({
        url: `/Dashboard/${channelId}/sync`,
        method: "POST",
        body: { channelId },
      }),
      invalidatesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useSyncDashboardAnalyticsMutation,
} = analyticsApi;
