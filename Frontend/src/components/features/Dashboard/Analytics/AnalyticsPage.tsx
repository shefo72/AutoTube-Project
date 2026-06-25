"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useGetChannelIdQuery } from "@/services/youtubeChannel";
import { AnalyticsKPIs } from "./AnalyticsKPIs";
import { ViewsChart } from "./ViewsChart";
import { CategoriesPie } from "./CategoriesPie";
import { EngagementChart } from "./EngagementChart";
import { TopVideos } from "./TopVideos";
import { SubscribersChart } from "./SubscribersChart";
import { DashboardError } from "@/components/features/Dashboard/HomeDashboard/DashboardError";
import DashboardSkeleton from "@/components/features/Dashboard/HomeDashboard/DashboardSkeleton";
import { ConnectChannel } from "./ConnectChannel";

export function AnalyticsPage() {
  const {
    data: channelData,
    isLoading: isChannelLoading,
    error: channelError,
  } = useGetChannelIdQuery();

  if (isChannelLoading) {
    return <DashboardSkeleton />;
  }

  if (channelError) {
    if ("status" in channelError && channelError.status === 404) {
      return (
        <div className="flex-1 overflow-y-auto">
          <ConnectChannel />
        </div>
      );
    }

    return (
      <DashboardError
        error="Failed to load channel data"
        reset={() => window.location.reload()}
      />
    );
  }

  if (!channelData?.channelId) {
    return (
      <div className="flex-1 overflow-y-auto">
        <ConnectChannel />
      </div>
    );
  }

  return <AnalyticsDashboardContent channelId={channelData.channelId} />;
}

function AnalyticsDashboardContent({ channelId }: { channelId: string }) {
  const { data, isLoading, error, refetch } = useAnalytics(channelId);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError error={error} reset={refetch} />;
  }

  if (!data) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-5 p-5 md:p-8">
        <AnalyticsKPIs summary={data?.summary} />

        <div className="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-[1fr_300px]">
          <ViewsChart trends={data?.growthTrends} />
          <CategoriesPie categories={data?.contentCategories} />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-2">
          <SubscribersChart trends={data?.growthTrends} />
          <EngagementChart trends={data?.growthTrends} />
        </div>

        <TopVideos videos={data?.topVideos} />
      </div>
    </div>
  );
}
