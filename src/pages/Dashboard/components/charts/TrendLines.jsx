/** SVG layer drawn over the monthly bars: for each series a line with dots joining the tops of its bars. */
import { CHART_NEUTRALS, LINE_STYLE } from "./chartTheme";

export default function TrendLines({ lines }) {
  return (
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
            strokeWidth={LINE_STYLE.width}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {line.points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={LINE_STYLE.dotRadius}
              fill={CHART_NEUTRALS.surface}
              stroke={line.color}
              strokeWidth={LINE_STYLE.width}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
