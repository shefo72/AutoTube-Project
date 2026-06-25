import api from "./api";

export interface SubscribePayload {
  subscriptionPlanId: number;
  paymentGatewayId: number;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

export const subscribe = async (data: SubscribePayload) => {
  const response = await api.post("/Payment/subscribe", data);
  return response.data;
};
