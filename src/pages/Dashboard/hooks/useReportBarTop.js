/** After a bar is drawn, reports the centre of its top edge to the chart so the trend line can pass through it. */
import { useLayoutEffect } from "react";

export default function useReportBarTop(onBarTop, seriesKey, { x, y, width, index }) {
  useLayoutEffect(() => {
    if ([x, y, width, index].every(Number.isFinite)) onBarTop(seriesKey, index, x + width / 2, y);
  }, [onBarTop, seriesKey, index, x, y, width]);
}
