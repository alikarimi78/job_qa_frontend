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
import { BAR, INK, SERIES } from "./theme";
import { ChartEmpty, ChartTooltip, HOVER_CURSOR } from "./parts";

function TipLabel(props) {
  const box = props.viewBox ?? props;
  if (box?.x == null) return null;
  const leftward = box.width < 0;
  const tip = box.x + box.width;

  return (
    <text
      x={tip + (leftward ? -8 : 8)}
      y={box.y + box.height / 2}
      textAnchor={leftward ? "end" : "start"}
      direction="ltr"
      dominantBaseline="central"
      style={{ fill: INK.secondary, fontSize: 12, fontFamily: "Vazirmatn, sans-serif" }}
    >
      {Number(props.value ?? 0).toLocaleString("fa-IR")}
    </text>
  );
}

const LABEL_STYLE = { fontSize: 12, fontFamily: "Vazirmatn, sans-serif" };

function makeCategoryTick(rows) {
  return function CategoryTick({ x, y, payload }) {
    const isZero = rows.find((row) => row.name === payload.value)?.value === 0;
    return (
      <g>
        <text
          x={x}
          y={y}
          dy={4}
          textAnchor="start"
          direction="ltr"
          style={{ ...LABEL_STYLE, fill: INK.muted }}
        >
          {payload.value}
        </text>
        {isZero && (
          <text
            x={x - 12}
            y={y}
            dy={4}
            textAnchor="end"
            direction="ltr"
            style={{ ...LABEL_STYLE, fill: INK.muted }}
          >
            ۰
          </text>
        )}
      </g>
    );
  };
}

// The chart takes the `hue` of what it counts (one of theme's HUES), and a row may name its own where
// the rows are states rather than kinds — active and blocked accounts. The tooltip is told the row's
// colour, recharts giving it the bar's.
export default function CategoryBars({
  rows,
  valueLabel = "تعداد",
  hue = SERIES[0],
  rowHeight = 38,
  minHeight = 120,
}) {
  if (rows.length === 0) return <ChartEmpty>موردی برای نمایش وجود ندارد.</ChartEmpty>;

  const fillOf = (row) => (row?.hue ?? hue).bar;

  const height = Math.max(minHeight, rows.length * rowHeight + 24);
  const longest = Math.max(...rows.map((row) => row.value), 0);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={rows}
          barCategoryGap={BAR.categoryGap}
          margin={{ top: 4, right: 8, bottom: 4, left: 36 }}
        >
          <CartesianGrid stroke={INK.grid} horizontal={false} />
          <XAxis type="number" reversed hide domain={[0, Math.max(1, longest * 1.15)]} />
          <YAxis
            type="category"
            dataKey="name"
            orientation="right"
            width={120}
            tick={makeCategoryTick(rows)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={HOVER_CURSOR}
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((entry) => ({ ...entry, color: fillOf(entry.payload) }))}
                label={payload?.[0]?.payload?.name}
              />
            )}
          />
          <Bar
            dataKey="value"
            name={valueLabel}
            fill={hue.bar}
            radius={BAR.rowRadius}
            maxBarSize={BAR.maxBarSize}
            isAnimationActive={false}
          >
            {rows.map((row) => (
              <Cell key={row.name} fill={fillOf(row)} />
            ))}
            <LabelList dataKey="value" content={<TipLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
