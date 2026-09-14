import { faNumber } from "@utils/jalali";
import { SERIES } from "./theme";

export function StatTile({ label, value, hint, tone = "default" }) {
  const accent =
    tone === "warning" ? "text-amber-600" : tone === "muted" ? "text-slate-500" : "text-slate-900";

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 flex flex-col gap-1">
      <span className="text-xs text-slate-500 leading-6">{label}</span>
      <span className={`text-2xl font-bold ${accent}`}>{faNumber(value)}</span>
      {hint && <span className="text-[11px] text-slate-400 leading-5">{hint}</span>}
    </div>
  );
}

export function Meter({ label, value, total, note }) {
  const ratio = total > 0 ? Math.min(1, value / total) : 0;
  const remaining = Math.max(0, total - value);

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
      <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#cde2fb" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${ratio * 100}%`, backgroundColor: SERIES[0] }}
        />
      </div>
      <span className="text-xs text-slate-500 leading-6">
        {remaining > 0
          ? `${faNumber(remaining)} رکورد تایید شده هنوز وارد موتور تحلیل نشده است؛ بازسازی پس از هر تایید به‌صورت خودکار انجام می‌شود و وضعیت آن در صفحه بررسی پیشنهادها قابل مشاهده است.`
          : note}
      </span>
    </div>
  );
}

export default StatTile;
