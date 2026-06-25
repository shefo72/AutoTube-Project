// "use client";

// import { useMemo } from "react";
// import type { TopicData, SortOption } from "@/types/gap-analyzer";

// interface UseTopicFilterOptions {
//   data: TopicData[];
//   activeCategories?: Set<string>;
//   selectedSort?: SortOption;
// }

// export function useTopicFilter({
//   data,
//   activeCategories = new Set(),
//   selectedSort = "Gap Score",
// }: UseTopicFilterOptions): TopicData[] {
//   return useMemo(() => {
//     const filtered = data.filter(
//       (d) => activeCategories.size === 0 || activeCategories.has(d.category)
//     );

//     return [...filtered].sort((a, b) => {
//       switch (selectedSort) {
//         case "Demand":
//           return b.demand - a.demand;
//         case "Competition":
//           return a.competition - b.competition;
//         case "Trend":
//           return b.trend - a.trend;
//         case "Gap Score":
//         default:
//           return b.gapScore - a.gapScore;
//       }
//     });
//   }, [data, activeCategories, selectedSort]);
// }
