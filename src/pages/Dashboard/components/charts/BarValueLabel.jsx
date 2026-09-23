/** Number written just past the end of a horizontal bar. */
import { faNumber } from "@utils/numbers";
import { CHART_FONT_FAMILY, CHART_NEUTRALS } from "./chartTheme";

const LABEL_OFFSET = 8;

export default function BarValueLabel(props) {
  const box = props.viewBox ?? props;
  if (box?.x == null) return null;
  const pointsLeft = box.width < 0;
  const barEnd = box.x + box.width;

  return (
    <text
      x={barEnd + (pointsLeft ? -LABEL_OFFSET : LABEL_OFFSET)}
      y={box.y + box.height / 2}
      textAnchor={pointsLeft ? "end" : "start"}
      direction="ltr"
      dominantBaseline="central"
      style={{ fill: CHART_NEUTRALS.secondaryText, fontSize: 12, fontFamily: CHART_FONT_FAMILY }}
    >
      {faNumber(props.value)}
    </text>
  );
}
