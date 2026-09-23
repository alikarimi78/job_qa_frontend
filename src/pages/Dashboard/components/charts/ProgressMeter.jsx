/** Wide progress bar "X of Y" with a note underneath, drawn in a chart colour. */
import { faNumber } from "@utils/numbers";

export default function ProgressMeter({ label, value, total, color, note }) {
  const ratio = total > 0 ? Math.min(1, value / total) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span className="text-sm text-slate-700">{label}</span>
        <span className="text-sm text-slate-500">
          <strong className="text-slate-900 font-bold">{faNumber(value)}</strong>
          {" از "}
          {faNumber(total)}
        </span>
      </div>
      <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: color.track }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${ratio * 100}%`, backgroundColor: color.bar }}
        />
      </div>
      <span className="text-xs text-slate-500 leading-6">{note}</span>
    </div>
  );
}
