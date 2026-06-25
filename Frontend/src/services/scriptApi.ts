import { apiSlice } from "@/store/apiSlice";
import type {
  GenerateScriptRequest,
  ScriptResponse,
  ScriptHistoryResponse,
} from "@/types/script";

const scriptApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateScript: builder.mutation<ScriptResponse, GenerateScriptRequest>({
      query: (payload) => ({
        url: "/Script",
        method: "POST",
        body: payload,
        timeout: 600000,
      }),
      invalidatesTags: ["Billing"],
    }),
    getScriptHistory: builder.query<ScriptHistoryResponse, void>({
      query: () => "/Script/history",
    }),
  }),
});

export const { useGenerateScriptMutation, useGetScriptHistoryQuery } =
  scriptApi;
