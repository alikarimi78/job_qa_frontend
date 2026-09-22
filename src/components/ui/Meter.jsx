import { faNumber } from "@utils/jalali";

export default function Meter({ label, ratio, title }) {
  const percent = Math.max(0, Math.min(100, Math.round((ratio ?? 0) * 100)));
  return (
    <div className="flex flex-col items-end gap-1.5" title={title}>
      <span className="text-[11px] text-slate-500 leading-4 whitespace-nowrap">
        {label}{" "}
        <b className="text-slate-800 font-bold">{`${faNumber(percent)}٪`}</b>
      </span>
      <span className="block w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <span
          className="block h-full rounded-full bg-gradient-to-l from-emerald-400 to-emerald-600"
          style={{ width: `${percent}%` }}
        />
      </span>
    </div>
  );
}
