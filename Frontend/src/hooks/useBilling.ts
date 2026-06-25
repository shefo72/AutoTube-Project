"use client";

import { useCallback } from "react";
import {
  useGetSubscriptionQuery,
  useGetUsageQuery,
  useGetPaymentMethodQuery,
  useUpdatePaymentMethodMutation,
} from "@/services/billingApi";
import type { UpdatePaymentMethodRequest } from "@/types/billing";

export function useBilling() {
  const {
    data: subscription,
    isLoading: subLoading,
    error: subError,
    refetch: refetchSub,
  } = useGetSubscriptionQuery();
  const {
    data: usage,
    isLoading: usageLoading,
    error: usageError,
    refetch: refetchUsage,
  } = useGetUsageQuery();
  const {
    data: paymentMethod,
    isLoading: pmLoading,
    error: pmError,
    refetch: refetchPm,
  } = useGetPaymentMethodQuery();

  const [
    updatePaymentMethod,
    { isLoading: isUpdatingPayment, error: updateError, reset: clearError },
  ] = useUpdatePaymentMethodMutation();

  const isLoading = subLoading || usageLoading || pmLoading;
  const anyError = subError || usageError || pmError || updateError;

  const updatePayment = useCallback(
    async (payload: UpdatePaymentMethodRequest) => {
      try {
        await updatePaymentMethod(payload).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [updatePaymentMethod]
  );

  const refetch = useCallback(() => {
    refetchSub();
    refetchUsage();
    refetchPm();
  }, [refetchSub, refetchUsage, refetchPm]);

  return {
    subscription: subscription ?? null,
    usage: usage ?? null,
    paymentMethod: paymentMethod ?? null,
    isLoading,
    isUpdatingPayment,
    error: anyError ? "Failed to load/update billing data" : null,
    updatePayment,
    refetch,
    clearError,
  } as const;
}
