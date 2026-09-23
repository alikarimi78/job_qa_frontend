/** Builds the category-axis label of a horizontal bar chart; a category whose value is zero also gets a "۰" where its bar would be. */
import { CHART_FONT_FAMILY, CHART_NEUTRALS } from "./chartTheme";

const TICK_STYLE = { fontSize: 12, fontFamily: CHART_FONT_FAMILY, fill: CHART_NEUTRALS.mutedText };
const ZERO_OFFSET = 12;

export function createCategoryTick(rows) {
  return function CategoryTick({ x, y, payload }) {
    const isZero = rows.find((row) => row.name === payload.value)?.value === 0;
    return (
      <g>
        <text x={x} y={y} dy={4} textAnchor="start" direction="ltr" style={TICK_STYLE}>
          {payload.value}
        </text>
        {isZero && (
          <text x={x - ZERO_OFFSET} y={y} dy={4} textAnchor="end" direction="ltr" style={TICK_STYLE}>
            ۰
          </text>
        )}
      </g>
    );
  };
}
