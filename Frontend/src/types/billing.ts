export interface Subscription {
  subscriptionId: number;
  planName: string;
  billingCycle: string;
  price: number;
  status: string;
  startDate: string;
  endDate?: string;
}

export interface UsageStats {
  gapAnalysesUsed: number;
  scriptGenerationsUsed: number;
  videoGenerationsUsed: number;
  thumbnailGenerationsUsed: number;
  analyticsUsed: number;
  allInOneGenerationsUsed: number;
  creditsGranted: number;
  creditsRemaining: number;
  resetDate: string;
}

export interface PaymentMethod {
  id?: number;
  cardHolderName?: string;
  cardLast4?: string;
  expiryDate?: string;
  paymentProvider?: string;
  success?: boolean;
  message?: string;
}

export interface UpdatePaymentMethodRequest {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
}
