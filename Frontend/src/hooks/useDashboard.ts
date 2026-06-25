"use client";

import { useGetUserDashboardQuery } from "@/services/dashboardApi";

export function useDashboard() {
  const { data, isLoading, error, refetch } = useGetUserDashboardQuery();

  return {
    data: data ?? null,
    isLoading,
    error: error ? "Something went wrong." : null,
    refetch,
  };
}
