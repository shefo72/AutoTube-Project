import { apiSlice } from "@/store/apiSlice";
import type {
  DiscoveryStats,
  DiscoveryStatsResponse,
  TrendingVideo,
  TrendingResponse,
  GapAnalysisReport,
  ChannelVideosResponse,
  GapAggregateResponse,
  GapAggregateData,
  ChannelListResponse,
  YouTubeChannel,
  GapAnalysisHistoryResponse,
} from "@/types/gap-analyzer";

export interface TrendingQueryParams {
  region?: string;
  categoryId?: number;
  keywords?: string;
  maxResults?: number;
}

const discoveryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDiscoveryStats: builder.query<DiscoveryStats, void>({
      query: () => "/Discovery/stats",
      providesTags: ["GAP"],
      transformResponse: (response: DiscoveryStatsResponse) => response.data,
    }),

    getTrendingTopics: builder.query<TrendingVideo[], TrendingQueryParams>({
      query: (argParams) => ({
        url: "/Discovery/trending",
        params: {
          region: argParams.region || undefined,
          categoryId: argParams.categoryId || undefined,
          keywords: argParams.keywords || undefined,
          maxResults: argParams.maxResults || 20,
        },
      }),
      providesTags: ["GAP"],
      transformResponse: (response: TrendingResponse) => response.data,
    }),

    analyzeVideo: builder.mutation<GapAnalysisReport, string>({
      query: (videoId) => ({
        url: "/GapAnalysis/analyze",
        method: "POST",
        body: { videoId },
      }),
      invalidatesTags: ["History", "Billing"],
      transformResponse: (response: { data: GapAnalysisReport }) =>
        response.data,
    }),
    getChannelVideos: builder.query<TrendingVideo[], string>({
      query: (channelName) => `/Discovery/channels/${channelName}/videos`,
      providesTags: ["GAP"],
      transformResponse: (response: ChannelVideosResponse) => response.data,
    }),
    getGapAnalysisReport: builder.query<GapAggregateData, void>({
      query: () => `/GapAnalysis/aggregate`,
      providesTags: [{ type: "History", id: "AGGREGATE" }],
      transformResponse: (response: GapAggregateResponse) => response.data,
    }),
    getHighGrowthChannels: builder.query<YouTubeChannel[], void>({
      query: () => "/Discovery/list/high-growth",
      providesTags: ["GAP"],
      transformResponse: (response: ChannelListResponse) => response.data,
    }),

    getEasyWinsChannels: builder.query<YouTubeChannel[], void>({
      query: () => "/Discovery/list/easy-wins",
      providesTags: ["GAP"],
      transformResponse: (response: ChannelListResponse) => response.data,
    }),

    getGapAnalysisHistory: builder.query<GapAnalysisReport[], void>({
      query: () => "/GapAnalysis/history",
      providesTags: ["History", "GAP"],
      transformResponse: (response: GapAnalysisHistoryResponse) =>
        response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDiscoveryStatsQuery,
  useLazyGetTrendingTopicsQuery,
  useAnalyzeVideoMutation,
  useLazyGetChannelVideosQuery,
  useLazyGetGapAnalysisReportQuery,
  useGetHighGrowthChannelsQuery,
  useGetEasyWinsChannelsQuery,
  useGetGapAnalysisHistoryQuery,
  useLazyGetHighGrowthChannelsQuery,
  useLazyGetEasyWinsChannelsQuery,
} = discoveryApi;
