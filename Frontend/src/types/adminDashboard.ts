export type Plan = "None" | "Pro" | "Agency";
export type UserStatus = "Active" | "Inactive";

export interface PerformanceData {
  month: string;
  views: number;
}

export interface UserData {
  id: number;
  name: string;
  fullName?: string;
  email: string;
  plan: Plan;
  status: UserStatus;
  joined: string;
  analyses: number;
  videos: number;
  revenue: string;
  performance: PerformanceData[];
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  avgAnalysesPerUser: number;
}

export interface UserDetails extends UserData {
  totalAnalyses: number;
  videosCreated: number;
}
