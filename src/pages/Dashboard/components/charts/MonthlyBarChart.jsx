/** The recharts part of the monthly chart: one bar per series per month, month names below and counts on the side. Memoised so reporting bar positions does not redraw it. */
import { memo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { AXIS_TICK_STYLE, BAR_STYLE, CHART_NEUTRALS, HOVER_CURSOR_STYLE } from "./chartTheme";
import PositionReportingBar from "./PositionReportingBar";

function MonthlyBarChart({ rows, series, onBarTop }) {
  return (
    <ResponsiveContainer>
      <BarChart
        data={rows}
        barGap={BAR_STYLE.gap}
        barCategoryGap={BAR_STYLE.categoryGap}
        margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
      >
        <CartesianGrid stroke={CHART_NEUTRALS.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={AXIS_TICK_STYLE}
          tickLine={false}
          axisLine={{ stroke: CHART_NEUTRALS.grid }}
          interval={0}
          height={36}
        />
        <YAxis
          orientation="left"
          allowDecimals={false}
          width={36}
          tick={AXIS_TICK_STYLE}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={HOVER_CURSOR_STYLE}
          content={({ active, payload }) => (
            <ChartTooltip active={active} payload={payload} label={payload?.[0]?.payload?.full} />
          )}
        />
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={item.color.bar}
            radius={BAR_STYLE.columnRadius}
            maxBarSize={BAR_STYLE.maxBarSize}
            isAnimationActive={false}
            shape={(barProps) => (
              <PositionReportingBar {...barProps} onBarTop={onBarTop} seriesKey={item.key} />
            )}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default memo(MonthlyBarChart);
