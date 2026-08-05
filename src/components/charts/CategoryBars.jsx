import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BAR, INK, SERIES } from "./theme";
import { ChartEmpty, ChartTooltip, HOVER_CURSOR } from "./parts";

// The value at the bar's tip, positioned from the rectangle recharts hands over rather
// than through `position="left"`: with the value axis reversed, that keyword put the
// number back at the baseline, on top of the category name it belongs beside
// («۲احد عملیات»). The tip here is the left edge, because the bar grows leftwards.
//
// The geometry arrives as `viewBox` on a LabelList's `content`, not as loose x/y props,
// and on a reversed axis its `width` is negative — `x` is the baseline and `x + width`
// is the tip. Deriving the tip that way keeps this correct whichever direction the bar
// grows, instead of assuming the leftward one.
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

// The category name, to the right of the axis — and the value for a category sitting at
// zero.
//
// `direction="ltr"` is doing real work: SVG anchors text at the *start* of the inline
// direction, and the page is RTL, so recharts' own tick ran leftwards from the axis and
// laid the names across the bars. Setting the run's direction makes "start" mean the
// left edge again; the Persian glyphs inside still shape right-to-left, which is bidi's
// job and not this attribute's.
//
// The zero is drawn here rather than left to the LabelList above because recharts drops
// a zero-width rectangle *and the label with it* — the row came out as a bare name with
// nothing beside it, which reads as "no data" rather than "none".
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

// One measure across named categories — accounts per role, accounts per unit.
//
// One series, so one colour for every bar and no legend: the card's title already says
// what is plotted, and shading each bar by its own length would double-encode the only
// thing the bar already shows. Here the values *are* few, so each bar is labelled at
// its end and the axis carries nothing the label does not.
export default function CategoryBars({ rows, valueLabel = "تعداد", rowHeight = 38, minHeight = 120 }) {
  if (rows.length === 0) return <ChartEmpty>موردی برای نمایش وجود ندارد.</ChartEmpty>;

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
          {/* Headroom for the value sitting past the end of the longest bar */}
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
                payload={payload}
                label={payload?.[0]?.payload?.name}
              />
            )}
          />
          <Bar
            dataKey="value"
            name={valueLabel}
            fill={SERIES[0]}
            radius={BAR.rowRadius}
            maxBarSize={BAR.maxBarSize}
            isAnimationActive={false}
          >
            <LabelList dataKey="value" content={<TipLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
