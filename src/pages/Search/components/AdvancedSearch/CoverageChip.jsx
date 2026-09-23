/** One of the user's items inside a ranked job: found (green, with the column it was found in), not found (grey), or unknown to the database (amber). */
import { CheckIcon, HelpCircleIcon, XIcon } from "@components/icons";
import { columnLabel } from "@constants/jobFields";

const CHIP_ICON_CLASS = "w-3 h-3 shrink-0";

const CHIP_BASE =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[13px] leading-6";

export function FoundChip({ item, foundInColumn }) {
  return (
    <span
      title={foundInColumn ? `در «${columnLabel(foundInColumn)}» این شغل یافت شد` : undefined}
      className={`${CHIP_BASE} bg-emerald-50 border-emerald-200 text-emerald-900`}
    >
      <span className="text-emerald-600">
        <CheckIcon className={CHIP_ICON_CLASS} />
      </span>
      {item}
      {foundInColumn && (
        <span className="text-[11px] text-emerald-700/80">— {columnLabel(foundInColumn)}</span>
      )}
    </span>
  );
}

export function MissingChip({ item }) {
  return (
    <span className={`${CHIP_BASE} border-dashed bg-slate-50 border-slate-300 text-slate-500`}>
      <span className="text-slate-400">
        <XIcon className={CHIP_ICON_CLASS} />
      </span>
      {item}
    </span>
  );
}

export function UnknownChip({ item }) {
  return (
    <span
      title="این عبارت در هیچ رکورد پایگاه داده ثبت نشده است و در محاسبه پوشش به حساب نیامده"
      className={`${CHIP_BASE} border-dashed bg-amber-50 border-amber-300 text-amber-900`}
    >
      <span className="text-amber-500">
        <HelpCircleIcon className={CHIP_ICON_CLASS} />
      </span>
      {item}
    </span>
  );
}

export function CoverageLegend({ showsUnknown }) {
  return (
    <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500">
      <span className="inline-flex items-center gap-1">
        <span className="text-emerald-600">
          <CheckIcon className={CHIP_ICON_CLASS} />
        </span>
        پوشش داده شد
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="text-slate-400">
          <XIcon className={CHIP_ICON_CLASS} />
        </span>
        پوشش داده نشد
      </span>
      {showsUnknown && (
        <span className="inline-flex items-center gap-1">
          <span className="text-amber-500">
            <HelpCircleIcon className={CHIP_ICON_CLASS} />
          </span>
          در واژگان پایگاه داده نبود
        </span>
      )}
    </div>
  );
}
