export interface GrowthData {
  dayName: string;
  value: number;
}

export interface Opportunity {
  keyword: string;
  gapScore: number;
  demandScore: number;
}

export interface WeeklyOutput {
  scripts: number;
  thumbnails: number;
  videos: number;
  analyses: number;
}

export interface Productivity {
  lastActivityAt: string;
  lastActivityType: string;
  mostUsedFeature: string;
  weeklyOutput: WeeklyOutput;
  impactScore: number;
  insight: string;
}

export interface DashboardResponse {
  totalAnalyses: number;
  videosGenerated: number;
  scriptsGenerated: number;
  thumbnailsGenerated: number;
  topOpportunities: Opportunity[];
  productivitySnapshot: Productivity;
  growthOverview: GrowthData[];
}
