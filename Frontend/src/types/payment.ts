import { z } from "zod";
import { paymentSchema } from "@/schemas/paymentSchema";

export type PaymentFormData = z.infer<typeof paymentSchema>;

export interface FieldProps {
  label: string;
  placeholder: string;
  type?: string;
  half?: boolean;
  maxLength?: number;
  name: keyof PaymentFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
