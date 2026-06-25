import { apiSlice } from "@/store/apiSlice";
import {
  normalizeThumbnailResponse,
  type ThumbnailHistoryItem,
  type GenerateThumbnailRequest,
  type GenerateThumbnailResponse,
  type UploadedThumbnailResponse,
} from "@/types/thumbnail";

const thumbnailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateThumbnail: builder.mutation<
      GenerateThumbnailResponse[],
      GenerateThumbnailRequest
    >({
      query: (payload) => ({
        url: "/thumbnails/generate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Billing"],
      transformResponse: (response: unknown) => {
        const normalized = normalizeThumbnailResponse(response);
        if (!normalized)
          throw new Error("Unexpected response shape from server");
        return normalized;
      },
    }),

    generateThumbnailWithImage: builder.mutation<
      UploadedThumbnailResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/uploaded-thumbnails/generate",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Billing"],
    }),

    downloadThumbnail: builder.mutation<Blob, { id: number; type: string }>({
      query: ({ id, type }) => ({
        url:
          type === "Generated"
            ? `/thumbnails/download/${id}`
            : `/uploaded-thumbnails/download/${id}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    getUserThumbnails: builder.query<ThumbnailHistoryItem[], void>({
      query: () => "/uploaded-thumbnails/user",
      providesTags: ["Thumbnail"],
    }),

    getSecureImage: builder.query<string, string>({
      query: (urlPath) => ({
        url: urlPath,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        },
      }),
    }),
  }),
});

export const {
  useGenerateThumbnailMutation,
  useGenerateThumbnailWithImageMutation,
  useDownloadThumbnailMutation,
  useGetUserThumbnailsQuery,
  useGetSecureImageQuery,
} = thumbnailApi;
