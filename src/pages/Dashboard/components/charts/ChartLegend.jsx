/** Colour key above a chart; hidden when there is only one series. */
export default function ChartLegend({ items }) {
  if (items.length < 2) return null;
  return (
    <div className="flex items-center gap-4 flex-wrap mb-3">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2 text-xs text-slate-600">
          <span
            className="w-3 h-3 rounded-[3px] shrink-0"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
