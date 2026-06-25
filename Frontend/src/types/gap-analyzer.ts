/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";

export interface TrendingVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  gapScore: number;
  demandScore: number;
  competitionScore: number;
  trendScore: number;
}

export interface GapAnalysisReport {
  id: number;
  videoId: string;
  videoTitle: string;
  channelId: string;
  status: number;
  contentGaps: string[];
  audiencePainPoints: string[];
  missedOpportunities: string[];
  weaknesses: string[];
  strengths: string[];
  seoRecommendations: string[];
  ctrOptimizationSuggestions: string[];
  hookImprovements: string[];
  retentionImprovements: string[];
  viralPotentialAnalysis: string;
  competitionDifficulty: number;
  opportunityScore: number;
  trendGrowth: number;
  createdAt: string;
}

export interface GapAggregateData {
  immediateActions: string[];
  contentStrategy: string[];
  retentionTactics: string[];
  growthOpportunities: string[];
  executiveSummary: string;
}

export interface GapAggregateResponse {
  success: boolean;
  message: string;
  data: GapAggregateData;
  errors: string[];
}

export type GapAnalyzerTabId =
  | "trending"
  | "analyze_topic"
  | "analyze_channel"
  | "reports"
  | "history";

export interface GapAnalyzerTab {
  id: GapAnalyzerTabId;
  label: string;
  icon: LucideIcon;
}

export type BadgeType = "golden" | "easy-win" | "emerging" | "competitive";

export interface TabComponentProps {
  savedItems: Set<number>;
  onToggleSave: (id: number) => void;

  historyAnalyses: GapAnalysisReport[];
  preSelectedTopic: GapAnalysisReport | null;
  clearPreSelectedTopic: () => void;
  onAnalysisComplete: (analysisData: GapAnalysisReport) => void;

  historyReports: GapAggregateData[];
  preSelectedReport: GapAggregateData | null;
  onReportGenerated: (reportData: GapAggregateData) => void;
  clearPreSelectedReport: () => void;

  trendingState?: TrendingSearchState;
  setTrendingState?: React.Dispatch<React.SetStateAction<TrendingSearchState>>;

  channelState: ChannelSearchState;
  setChannelState: React.Dispatch<React.SetStateAction<ChannelSearchState>>;

  currentBalance?: number;
  onInsufficientCredits?: (cost: number) => void;
}

export interface TrendingSearchState {
  keyword: string;
  selectedCountry: string | null;
  selectedCategory: string | null;
  hasSearched: boolean;
  results: TrendingVideo[];
  selectedTopic: TrendingVideo | null;
}

export interface ChannelSearchState {
  channelName: string;
  hasSearched: boolean;
  results: TrendingVideo[];
  selectedTopic: TrendingVideo | null;
}

export interface DiscoveryStats {
  topicsAnalyzed: number;
  easyWinsPercentage: number;
  avgGapPercentage: number;
  highGrowthChannels: number;
}

export interface DiscoveryStatsResponse {
  success: boolean;
  message: string;
  data: DiscoveryStats;
  errors: string[];
}

export interface TrendingResponse {
  success: boolean;
  message: string;
  data: TrendingVideo[];
  errors: string[];
}

export interface ChannelVideosResponse {
  success: boolean;
  message: string;
  data: TrendingVideo[];
  errors: string[];
}

export interface YouTubeChannel {
  id: number;
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  ownerUserId: number;
  analyticsSnapshots: any[];
  historicalStatistics: any[];
  videos: any[];
}

export interface ChannelListResponse {
  success: boolean;
  data: YouTubeChannel[];
}

export interface GapAnalysisHistoryResponse {
  success: boolean;
  message: string;
  data: GapAnalysisReport[];
  errors?: string[];
}
