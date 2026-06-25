"use client";

import { useGetDashboardAnalyticsQuery } from "@/services/analyticsApi";

export function useAnalytics(channelId: string) {
  const { data, isLoading, error, refetch } =
    useGetDashboardAnalyticsQuery(channelId);

  return {
    data: data ?? null,
    isLoading,
    error: error ? "An unexpected error occurred." : null,
    refetch,
  };
}
