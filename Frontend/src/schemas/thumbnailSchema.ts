import { z } from "zod";

export const generateThumbnailSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(25, "Prompt must be at least 25 characters")
    .max(500, "Prompt must be under 500 characters"),
  style: z.string().min(1, "Please select a style"),
});

export type GenerateThumbnailFormValues = z.infer<
  typeof generateThumbnailSchema
>;
