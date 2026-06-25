import { useCallback } from "react";

export type GenerationAction =
  | "video"
  | "thumbnail"
  | "script"
  | "all-in-one"
  | "analytics"
  | "search";

export interface CostParams {
  action: GenerationAction;
  videoDurationSeconds?: number;
  hasReferenceImage?: boolean;
}

export const useCreditCheck = (currentBalance: number = 0) => {
  const calculateCost = useCallback((params: CostParams): number => {
    switch (params.action) {
      case "video":
        return Math.max(1, (params.videoDurationSeconds || 0) * 1);
      case "thumbnail":
        return params.hasReferenceImage ? 10 : 5;
      case "script":
        return 10;
      case "all-in-one":
        return 30;
      case "analytics":
        return 15;
      case "search":
        return 5;
      default:
        return 0;
    }
  }, []);

  const validateAction = useCallback(
    (params: CostParams) => {
      const cost = calculateCost(params);
      return {
        isAllowed: currentBalance >= cost,
        requiredCredits: cost,
        shortfall: Math.max(0, cost - currentBalance),
      };
    },
    [currentBalance, calculateCost]
  );

  return { validateAction, calculateCost };
};
