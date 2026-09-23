/** Monthly count chart: bars per series for each month with a trend line over them, a legend when there are several series, and a message when the period is empty. */
import useMonthlyChart from "../../hooks/useMonthlyChart";
import ChartEmpty from "./ChartEmpty";
import ChartLegend from "./ChartLegend";
import MonthlyBarChart from "./MonthlyBarChart";
import TrendLines from "./TrendLines";

const DEFAULT_HEIGHT = 280;

export default function MonthlyBars({ months, series, height = DEFAULT_HEIGHT }) {
  const chart = useMonthlyChart(months, series);

  if (chart.isEmpty) {
    return <ChartEmpty>در این بازه رکورد جدیدی ثبت نشده است.</ChartEmpty>;
  }

  return (
    <>
      <ChartLegend items={chart.legendItems} />
      <div className="relative" style={{ width: "100%", height }}>
        <MonthlyBarChart rows={chart.rows} series={series} onBarTop={chart.reportBarTop} />
        <TrendLines lines={chart.lines} />
      </div>
    </>
  );
}
