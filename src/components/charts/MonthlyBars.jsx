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
import { AXIS_TICK, BAR, INK, LINE } from "./theme";
import { ChartEmpty, ChartLegend, ChartTooltip, HOVER_CURSOR } from "./parts";

function TipBar({ report, series, ...props }) {
  const { x, y, width, index } = props;

  useLayoutEffect(() => {
    if ([x, y, width, index].every(Number.isFinite)) report(series, index, x + width / 2, y);
  }, [report, series, index, x, y, width]);

  return <Rectangle {...props} />;
}

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
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={item.hue.bar}
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

  const lines = series
    .map((item) => ({
      key: item.key,
      color: item.hue.line,
      points: (tips[item.key] ?? []).slice(0, rows.length),
    }))
    .filter((line) => line.points.length === rows.length && line.points.every(Boolean));

  return (
    <>
      <ChartLegend
        items={series.map((item) => ({ label: item.label, color: item.hue.bar }))}
      />
      <div className="relative" style={{ width: "100%", height }}>
        <Chart rows={rows} series={series} report={report} />

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
