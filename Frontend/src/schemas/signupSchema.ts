import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be less than 50 characters long"),

  email: z.string().email("Invalid email address"),

  PhoneNumber: z
    .string()
    .min(1, "Phone is required")
    .startsWith("+", "Phone number must start with '+' (e.g., +20...)")
    .regex(/^\+[0-9]+$/, "Phone number must contain only digits after '+'")
    .min(11, "Phone must be at least 10 digits along with the '+' sign"),

  dateOfBirth: z
    .string()
    .min(1, "Birthday is required")
    .refine((date) => {
      const dateOfBirth = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      const monthDiff = today.getMonth() - dateOfBirth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
      ) {
        return age - 1 >= 10;
      }

      return age >= 10;
    }, "You must be at least 10 years old to sign up"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
