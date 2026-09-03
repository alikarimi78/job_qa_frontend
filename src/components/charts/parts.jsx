import { INK } from "./theme";
import { faNumber } from "@utils/jalali";


export function ChartTooltip({ active, payload, label }) {
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

export function ChartLegend({ items }) {
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

export function ChartEmpty({ children }) {
  return (
    <p className="text-sm text-slate-500 py-8 text-center leading-7">{children}</p>
  );
}

export const HOVER_CURSOR = { fill: "rgba(15, 23, 42, 0.04)" };

export { INK };
