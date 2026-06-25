import { apiSlice } from "@/store/apiSlice";
import type {
  Subscription,
  UsageStats,
  PaymentMethod,
  UpdatePaymentMethodRequest,
} from "@/types/billing";
import type { SubscribePayload, SubscribeResponse } from "@/services/payment";

const billingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query<Subscription, void>({
      query: () => "/Billing/subscription",
      providesTags: ["Billing"],
    }),

    getUsage: builder.query<UsageStats, void>({
      query: () => "/Billing/usage",
      providesTags: ["Billing"],
    }),

    getPaymentMethod: builder.query<PaymentMethod, void>({
      query: () => "/Billing/payment-method",
      providesTags: ["Billing"],
    }),

    updatePaymentMethod: builder.mutation<
      PaymentMethod,
      UpdatePaymentMethodRequest
    >({
      query: (payload) => ({
        url: "/Billing/payment-method",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Billing"],
    }),

    subscribe: builder.mutation<SubscribeResponse, SubscribePayload>({
      query: (payload) => ({
        url: "/Payment/subscribe",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Billing"],
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetUsageQuery,
  useGetPaymentMethodQuery,
  useUpdatePaymentMethodMutation,
  useSubscribeMutation,
} = billingApi;

export const useUsageCredits = () =>
  useGetUsageQuery(undefined, {
    selectFromResult: ({ data }) => ({
      totalUsed: (data?.creditsGranted ?? 0) - (data?.creditsRemaining ?? 0),
      creditsGranted: data?.creditsGranted ?? 0,
      resetDate: data?.resetDate ?? "",
    }),
  });
