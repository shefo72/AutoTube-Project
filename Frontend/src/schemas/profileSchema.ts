import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  youtube: z
    .string()
    .trim()
    .min(1, "YouTube channel handle is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordSchema = z.object({
  current: z
    .string()
    .min(1, "Current password is required"),
  new: z
    .string()
    .min(8, "New password must be at least 8 characters"),
});

export type PasswordFormValues = z.infer<typeof passwordSchema>;
