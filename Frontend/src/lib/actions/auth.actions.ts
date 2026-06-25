"use server";

import { LoginFormValues, loginSchema } from "../../schemas/loginSchema";
import { SignupFormValues, signupSchema } from "../../schemas/signupSchema";

export async function loginAction(values: LoginFormValues) {
  const validationResult = loginSchema.safeParse(values);

  if (!validationResult.success) {
    const errors: Record<string, string> = {};
    validationResult.error.issues.forEach((issue) => {
      const key = issue.path[0] as string;
      if (!errors[key]) errors[key] = issue.message;
    });

    return {
      success: false,
      message: "Validation error",
      errors,
    };
  }

  try {
    const data = ""
    return {
      success: true,
      message: "Welcome Back",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function signupAction(values: SignupFormValues) {
  const validationResult = signupSchema.safeParse(values);

  if (!validationResult.success) {
    const errors: Record<string, string> = {};
    validationResult.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!errors[field]) errors[field] = issue.message;
    });

    return { success: false, errors };
  }

  try {
    const data = ""

    return {
      success: true,
      message: data,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Server error.",
    };
  }
}
