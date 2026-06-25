import { z } from "zod";

export const generateScriptSchema = z.object({
  topic: z
    .string()
    .min(25, "Prompt must be at least 25 characters.")
    .max(2000, "Prompt cannot exceed 500 characters."),
  tone: z.string().min(1, "Please select a tone."),
  length: z.string().min(1, "Please select a length."),
});

export type GenerateScriptFormValues = z.infer<typeof generateScriptSchema>;
