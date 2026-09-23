/** Dark tooltip shown when hovering a chart: the category label and each series' value with its colour dot. */
import { faNumber } from "@utils/numbers";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      dir="rtl"
      className="rounded-xl bg-slate-800 text-slate-50 px-3 py-2 shadow-xl
                 border border-slate-600/40 text-xs leading-6"
    >
      <div className="font-medium mb-1">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey ?? entry.name} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300">{entry.name}:</span>
          <span className="font-medium">{faNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}
