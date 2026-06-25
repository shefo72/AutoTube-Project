export interface AnalyticsSummary {
  totalViews: number;
  subscribers: number;
  watchTimeHours: number;
  avgEngagementRate: number;
  avgClickThroughRate: number;
  videoCount: number;
}

export interface GrowthTrend {
  date: string;
  views: number;
  subscribers: number;
  engagementRate: number;
  clickThroughRate: number;
}

export interface ContentCategory {
  category: string;
  videoCount: number;
  percentage: number;
}

export interface TopVideo {
  title: string;
  views: number;
  ctr: string;
  up: boolean;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  topVideos: TopVideo[];
  growthTrends: GrowthTrend[];
  contentCategories: ContentCategory[];
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
  errors: Record<string, string[]>;
}
