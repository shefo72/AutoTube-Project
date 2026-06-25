import { apiSlice } from "@/store/apiSlice";
import type { ApiSuccess } from "@/types/Profile";

interface ChannelIdResponse {
  channelId: string;
}

const youtubeChannelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChannelId: builder.query<ChannelIdResponse, void>({
      query: () => ({
        url: "/youtube/channel",
        method: "GET",
      }),
      providesTags: ["Profile", "User"],
    }),

    submitChannelId: builder.mutation<ApiSuccess, { channelId: string }>({
      query: (payload) => ({
        url: "/youtube/channelId",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Profile", "User"],
    }),
  }),
});

export const { useGetChannelIdQuery, useSubmitChannelIdMutation } =
  youtubeChannelApi;
