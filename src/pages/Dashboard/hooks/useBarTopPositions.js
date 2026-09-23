/** Collects where the top of each bar of a monthly chart was drawn, per series, so a trend line can be laid over the bars; ignores repeated reports of an unchanged position. */
import { useCallback, useState } from "react";

export default function useBarTopPositions() {
  const [barTops, setBarTops] = useState({});

  const reportBarTop = useCallback((seriesKey, index, x, y) => {
    setBarTops((previous) => {
      const known = previous[seriesKey]?.[index];
      if (known && known.x === x && known.y === y) return previous;
      const points = [...(previous[seriesKey] ?? [])];
      points[index] = { x, y };
      return { ...previous, [seriesKey]: points };
    });
  }, []);

  return { barTops, reportBarTop };
}
