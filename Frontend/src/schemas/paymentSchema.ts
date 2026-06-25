import { z } from "zod";

export const paymentSchema = z.object({
  cardholderName: z.string().min(3, "Cardholder name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry must be MM/YY"),
  cvc: z.string().regex(/^\d{3}$/, "CVC must be 3 digits"),
});
