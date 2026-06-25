import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("Email is requird").pipe(z.email("invaled email")),
  password: z.string().nonempty("Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
