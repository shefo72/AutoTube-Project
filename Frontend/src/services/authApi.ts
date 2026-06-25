import { apiSlice } from "@/store/apiSlice";
import type { LoginFormValues } from "@/schemas/loginSchema";
import type { SignupFormValues } from "@/schemas/signupSchema";
import type { AuthResponse } from "@/types/user";
import { setCredentials } from "@/store/authSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginFormValues>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
    }),

    signup: builder.mutation<AuthResponse, SignupFormValues>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: {
          FullName: userData.fullName,
          Email: userData.email,
          Password: userData.password,
          PhoneNumber: userData.PhoneNumber,
          dateOfBirth: userData.dateOfBirth,
        },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
