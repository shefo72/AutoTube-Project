import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Name is required")
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: "Please enter both your first and last name.",
    }),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address."),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (val) => {
        const dob = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        return age >= 10;
      },
      { message: "You must be at least 10 years old." }
    ),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => val.trim())
    .refine(
      (val) => {
        return /^\+\d{7,15}$/.test(val);
      },
      {
        message:
          "Must be a valid international phone number (e.g., +201148580370).",
      }
    ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
