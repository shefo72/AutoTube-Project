import { z } from "zod";
export const updatePaymentMethodSchema = z.object({
  cardholderName: z
    .string()
    .trim()
    .min(2, "Cardholder name must be at least 2 characters")
    .max(100, "Cardholder name must be under 100 characters"),
  cardNumber: z
    .string()
    .trim()
    .regex(/^\d{13,19}$/, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "CVC must be 3 digits"),
});

export type UpdatePaymentMethodFormValues = z.infer<
  typeof updatePaymentMethodSchema
>;
