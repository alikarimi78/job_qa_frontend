import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_TICK, BAR, INK, SERIES } from "./theme";
import { ChartEmpty, ChartLegend, ChartTooltip, HOVER_CURSOR } from "./parts";

// New records per Persian month, one group of columns per month.
//
// The x axis is `reversed` and the y axis sits on the right: the months read from the
// right, like the rest of the page. Values are not printed on the columns — a number
// on all thirty-six of them is unreadable, so the legend names the series and the
// hover carries the figures.
export default function MonthlyBars({ months, series, height = 280 }) {
  const rows = months.map((month, index) => {
    const row = { label: month.label, full: month.full };
    for (const item of series) row[item.key] = item.values[index];
    return row;
  });

  const total = series.reduce(
    (sum, item) => sum + item.values.reduce((a, b) => a + b, 0),
    0
  );
  if (total === 0) {
    return <ChartEmpty>در این بازه رکورد تازه‌ای ثبت نشده است.</ChartEmpty>;
  }

  return (
    <>
      <ChartLegend
        items={series.map((item, index) => ({ label: item.label, color: SERIES[index] }))}
      />
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <BarChart data={rows} barGap={BAR.gap} barCategoryGap={BAR.categoryGap}
                    margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid stroke={INK.grid} vertical={false} />
            <XAxis
              dataKey="label"
              reversed
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: INK.grid }}
              interval={0}
              height={36}
            />
            <YAxis
              orientation="right"
              allowDecimals={false}
              width={36}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={HOVER_CURSOR}
              content={({ active, payload }) => (
                <ChartTooltip
                  active={active}
                  payload={payload}
                  label={payload?.[0]?.payload?.full}
                />
              )}
            />
            {series.map((item, index) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                name={item.label}
                fill={SERIES[index]}
                radius={BAR.columnRadius}
                maxBarSize={BAR.maxBarSize}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
