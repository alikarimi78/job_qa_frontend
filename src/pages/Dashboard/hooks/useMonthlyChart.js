/** Everything the monthly chart draws besides the bars: the per-month rows, whether the period is empty, the legend, and the trend lines once the bars report their tops. */
import { useMemo } from "react";
import { monthlyRows, seriesTotal, trendLines } from "../utils/monthlyChartData";
import useBarTopPositions from "./useBarTopPositions";

export default function useMonthlyChart(months, series) {
  const { barTops, reportBarTop } = useBarTopPositions();
  const rows = useMemo(() => monthlyRows(months, series), [months, series]);

  return {
    rows,
    isEmpty: seriesTotal(series) === 0,
    legendItems: series.map((item) => ({ label: item.label, color: item.color.bar })),
    lines: trendLines(series, barTops, rows.length),
    reportBarTop,
  };
}
