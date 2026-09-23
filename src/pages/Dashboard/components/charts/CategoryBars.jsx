/** Horizontal bar chart of a few named counts (e.g. accounts per role), with the value printed at each bar's end; a row may carry its own colour. */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BarValueLabel from "./BarValueLabel";
import { createCategoryTick } from "./CategoryTick";
import ChartEmpty from "./ChartEmpty";
import ChartTooltip from "./ChartTooltip";
import { BAR_STYLE, CHART_NEUTRALS, HOVER_CURSOR_STYLE } from "./chartTheme";

const MIN_HEIGHT = 120;
const ROW_HEIGHT = 38;
const HEIGHT_PADDING = 24;
const VALUE_HEADROOM = 1.15;

export default function CategoryBars({ rows, valueLabel, color }) {
  if (rows.length === 0) return <ChartEmpty>موردی برای نمایش وجود ندارد.</ChartEmpty>;

  const barColorOf = (row) => (row?.color ?? color).bar;
  const height = Math.max(MIN_HEIGHT, rows.length * ROW_HEIGHT + HEIGHT_PADDING);
  const largestValue = Math.max(...rows.map((row) => row.value), 0);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={rows}
          barCategoryGap={BAR_STYLE.categoryGap}
          margin={{ top: 4, right: 8, bottom: 4, left: 36 }}
        >
          <CartesianGrid stroke={CHART_NEUTRALS.grid} horizontal={false} />
          <XAxis
            type="number"
            reversed
            hide
            domain={[0, Math.max(1, largestValue * VALUE_HEADROOM)]}
          />
          <YAxis
            type="category"
            dataKey="name"
            orientation="right"
            width={120}
            tick={createCategoryTick(rows)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={HOVER_CURSOR_STYLE}
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((entry) => ({ ...entry, color: barColorOf(entry.payload) }))}
                label={payload?.[0]?.payload?.name}
              />
            )}
          />
          <Bar
            dataKey="value"
            name={valueLabel}
            radius={BAR_STYLE.rowRadius}
            maxBarSize={BAR_STYLE.maxBarSize}
            isAnimationActive={false}
          >
            {rows.map((row) => (
              <Cell key={row.name} fill={barColorOf(row)} />
            ))}
            <LabelList dataKey="value" content={<BarValueLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
