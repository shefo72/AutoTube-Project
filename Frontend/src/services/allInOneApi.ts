import { apiSlice } from "@/store/apiSlice";
import {
  GenerateAllInOneResponse,
  GenerateAllInOnePayload,
  GetAllInOneResponse,
} from "@/types/allInOne";

export const allInOneApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateAllInOne: builder.mutation<
      GenerateAllInOneResponse,
      GenerateAllInOnePayload
    >({
      query: (payload) => ({
        url: "/AllInOne/generate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Billing"],
    }),

    getAllInOneById: builder.query<GetAllInOneResponse, number>({
      query: (id) => `/AllInOne/${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const { useGenerateAllInOneMutation, useGetAllInOneByIdQuery } =
  allInOneApi;
