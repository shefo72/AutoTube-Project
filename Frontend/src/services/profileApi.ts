import { apiSlice } from "@/store/apiSlice";
import type {
  ProfileDetails,
  UpdateProfilePayload,
  UploadImageResponse,
  ChangePasswordPayload,
  DeleteAccountPayload,
  ApiSuccess,
} from "@/types/Profile";

const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileDetails, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
      transformResponse: (response: ProfileDetails) => {
        if (response.personalInfo?.dateOfBirth) {
          response.personalInfo.dateOfBirth =
            response.personalInfo.dateOfBirth.split("T")[0];
        }
        if (!Array.isArray(response.selectedNiches)) {
          response.selectedNiches = [];
        }
        return response;
      },
    }),

    updateProfile: builder.mutation<ApiSuccess, UpdateProfilePayload>({
      query: (payload) => ({
        url: "/profile",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Profile", "User"],
    }),

    uploadAvatar: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/profile/upload-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    changePassword: builder.mutation<ApiSuccess, ChangePasswordPayload>({
      query: (payload) => ({
        url: "/profile/password",
        method: "PUT",
        body: payload,
      }),
    }),

    deleteAccount: builder.mutation<ApiSuccess, DeleteAccountPayload>({
      query: (payload) => ({
        url: "/profile",
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = profileApi;

export const useProfileDisplayName = () =>
  useGetProfileQuery(undefined, {
    selectFromResult: ({ data }) => ({
      displayName: data?.basicInfo?.fullName ?? null,
    }),
  });
