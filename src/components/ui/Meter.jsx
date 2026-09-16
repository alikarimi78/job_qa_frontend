// A ratio as a labelled bar with its percent — the retrieval score on the analysis page, coverage and
// score on advanced analysis's match cards. A bare «تطابق: 0.67» read as a grade out of one.
export default function Meter({ label, ratio, title, fill = "from-blue-500 to-indigo-600" }) {
  const percent = Math.max(0, Math.min(100, Math.round((ratio ?? 0) * 100)));
  return (
    <div className="flex flex-col items-end gap-1.5" title={title}>
      <span className="text-[11px] text-slate-500 leading-4 whitespace-nowrap">
        {label}{" "}
        <b className="text-slate-800 font-bold">{`${percent.toLocaleString("fa-IR")}٪`}</b>
      </span>
      <span className="block w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <span
          className={`block h-full rounded-full bg-gradient-to-l ${fill}`}
          style={{ width: `${percent}%` }}
        />
      </span>
    </div>
  );
}
