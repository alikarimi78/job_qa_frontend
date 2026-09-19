import { memo, useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_TICK, BAR, INK, LINE, SERIES } from "./theme";
import { ChartEmpty, ChartLegend, ChartTooltip, HOVER_CURSOR } from "./parts";

// A series names its colour (`hue`, one of theme's HUES) by what it counts, so a filter that drops the
// series before it cannot repaint it; one that names none falls back on its place.
const hueOf = (item, index) => item.hue ?? SERIES[index];

// A bar that reports where its tip is, so the line joining a series' tips is drawn from the positions
// recharts itself computed. Side-by-side bars sit off the centre of their month, which is where a
// plain <Line> would put its points. A zero month has no rectangle but still reports its baseline, so
// the line dips to it instead of skipping the month.
function TipBar({ report, series, ...props }) {
  const { x, y, width, index } = props;

  useLayoutEffect(() => {
    if ([x, y, width, index].every(Number.isFinite)) report(series, index, x + width / 2, y);
  }, [report, series, index, x, y, width]);

  return <Rectangle {...props} />;
}

// The bars alone, memoized apart from the line drawn over them. recharts remounts every bar whenever it
// is handed a new `rows`, and a remounted bar reports its tip again; were the tips state to re-render
// this part, each report would lead to another — a loop that a resize can start and that React ends by
// unmounting the whole page ("Maximum update depth exceeded"). So `rows` is memoized too, and only a
// change of months or series re-renders the chart.
const Chart = memo(function Chart({ rows, series, report }) {
  return (
    <ResponsiveContainer>
      <BarChart data={rows} barGap={BAR.gap} barCategoryGap={BAR.categoryGap}
                margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={INK.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: INK.grid }}
          interval={0}
          height={36}
        />
        <YAxis
          orientation="left"
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
            fill={hueOf(item, index).bar}
            radius={BAR.columnRadius}
            maxBarSize={BAR.maxBarSize}
            isAnimationActive={false}
            shape={(props) => <TipBar {...props} report={report} series={item.key} />}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
});

export default function MonthlyBars({ months, series, height = 280 }) {
  const [tips, setTips] = useState({});

  const report = useCallback((key, index, x, y) => {
    setTips((was) => {
      const known = was[key]?.[index];
      if (known && known.x === x && known.y === y) return was;
      const points = [...(was[key] ?? [])];
      points[index] = { x, y };
      return { ...was, [key]: points };
    });
  }, []);

  const rows = useMemo(
    () =>
      months.map((month, index) => {
        const row = { label: month.label, full: month.full };
        for (const item of series) row[item.key] = item.values[index];
        return row;
      }),
    [months, series]
  );

  const total = series.reduce(
    (sum, item) => sum + item.values.reduce((a, b) => a + b, 0),
    0
  );
  if (total === 0) {
    return <ChartEmpty>در این بازه رکورد جدیدی ثبت نشده است.</ChartEmpty>;
  }

  // Only a series whose every month has reported is drawn, so switching the range never shows a line
  // still half made of the previous range's points.
  const lines = series
    .map((item, index) => ({
      key: item.key,
      color: hueOf(item, index).line,
      points: (tips[item.key] ?? []).slice(0, rows.length),
    }))
    .filter((line) => line.points.length === rows.length && line.points.every(Boolean));

  return (
    <>
      <ChartLegend
        items={series.map((item, index) => ({ label: item.label, color: hueOf(item, index).bar }))}
      />
      <div className="relative" style={{ width: "100%", height }}>
        <Chart rows={rows} series={series} report={report} />

        {/* Over the chart rather than inside it, so no bar can cover a line; it takes no pointer
            events, so hovering still reaches the bars and their tooltip. */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-visible"
          width="100%"
          height="100%"
        >
          {lines.map((line) => (
            <g key={line.key} data-series={line.key}>
              <polyline
                points={line.points.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke={line.color}
                strokeWidth={LINE.width}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {line.points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={LINE.dot}
                  fill={INK.surface}
                  stroke={line.color}
                  strokeWidth={LINE.width}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
