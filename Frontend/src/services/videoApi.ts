import { apiSlice } from "@/store/apiSlice";
import type {
  GenerateVideoRequest,
  GenerateVideoResponse,
  VideoDownloadResponse,
  VideoHistoryItem,
} from "@/types/video";

const videoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateVideo: builder.mutation<
      GenerateVideoResponse,
      GenerateVideoRequest
    >({
      query: (payload) => ({
        url: "/video-generation/generate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Video", "Billing"],
    }),

    getVideoStatus: builder.query<string, number>({
      query: (id) => ({
        url: `/video-generation/status/${id}`,
        responseHandler: (response) => response.text(),
      }),
      keepUnusedDataFor: 0,
    }),
    getVideoHistory: builder.query<VideoHistoryItem[], void>({
      query: () => "/video-generation/history",
      providesTags: ["Video"],
    }),
    downloadVideo: builder.mutation<VideoDownloadResponse, number>({
      query: (id) => ({
        url: `/video-generation/download/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGenerateVideoMutation,
  useGetVideoStatusQuery,
  useGetVideoHistoryQuery,
  useDownloadVideoMutation,
} = videoApi;
