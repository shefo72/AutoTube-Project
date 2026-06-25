"use client";

import { KPIs } from "./KPIs";
import { Chart } from "./Chart";
import { Tools } from "./Tools";
import { Opportunities } from "./Opportunities";
import { ProductivityFeed } from "./ProductivityFeed";

import DashboardSkeleton from "./DashboardSkeleton";
import { DashboardError } from "./DashboardError";

import { useDashboard } from "@/hooks/useDashboard";

export function DashboardHome() {
  const { data, isLoading, error, refetch } = useDashboard();
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
        <KPIs
          totalAnalyses={data.totalAnalyses}
          videosGenerated={data.videosGenerated}
          scriptsGenerated={data.scriptsGenerated}
          thumbnailsGenerated={data.thumbnailsGenerated}
        />
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_340px]">
          <Chart growthData={data.growthOverview} />
          <Tools />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Opportunities opportunities={data.topOpportunities} />
          <ProductivityFeed data={data.productivitySnapshot} />
        </div>
      </div>
    </div>
  );
}
