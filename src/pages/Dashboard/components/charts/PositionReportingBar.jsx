/** A normal chart bar that also reports where its top centre was drawn, so the trend line can connect the bar tops. */
import { Rectangle } from "recharts";
import useReportBarTop from "../../hooks/useReportBarTop";

export default function PositionReportingBar({ onBarTop, seriesKey, ...barProps }) {
  useReportBarTop(onBarTop, seriesKey, barProps);
  return <Rectangle {...barProps} />;
}
