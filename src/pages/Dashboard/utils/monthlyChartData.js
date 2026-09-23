/** Pure data shaping for the monthly bar chart: one row per month with a value per series, the grand total, and the trend line of each series once all its bar tops are known. */
export function monthlyRows(months, series) {
  return months.map((month, index) => {
    const row = { label: month.label, full: month.full };
    for (const item of series) row[item.key] = item.values[index];
    return row;
  });
}

export const seriesTotal = (series) =>
  series.reduce((sum, item) => sum + item.values.reduce((a, b) => a + b, 0), 0);

export function trendLines(series, barTops, rowCount) {
  return series
    .map((item) => ({
      key: item.key,
      color: item.color.line,
      points: (barTops[item.key] ?? []).slice(0, rowCount),
    }))
    .filter((line) => line.points.length === rowCount && line.points.every(Boolean));
}
