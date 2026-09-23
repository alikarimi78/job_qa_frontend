/** Memoised monthly series for the growth and suggestion charts, rebuilt only when the stats or the month range change. */
import { useMemo } from "react";
import { growthSeries, suggestionSeries } from "../utils/dashboardData";

export const useGrowthSeries = (stats, months) =>
  useMemo(() => growthSeries(stats, months), [stats, months]);

export const useSuggestionSeries = (stats, months) =>
  useMemo(() => suggestionSeries(stats, months), [stats, months]);
