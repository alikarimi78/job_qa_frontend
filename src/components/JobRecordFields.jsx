import { FIELD_LABELS } from "@constant/fieldLabels";
import { splitItems } from "@components/ui/ItemsInput";

// A stored record read column by column, for the reviewer's «جزئیات» and for a corpus row the
// reader may look at but not edit. The list columns are chips, split where the cell is joined;
// `work_context` is one of them, as it is in JobForm, or its «|» would print raw.
const ROWS = [
  ["aliases", "نام‌های دیگر", true],
  ["tools", FIELD_LABELS.tools, true],
  ["skills", FIELD_LABELS.skills, true],
  ["knowledge", FIELD_LABELS.knowledge, true],
  ["abilities", FIELD_LABELS.abilities, true],
  ["description", "شرح شغل", false],
  ["responsibilities", "وظایف و مسئولیت‌ها", true],
  ["work_context", FIELD_LABELS.work_context, true],
  ["career_path_next", FIELD_LABELS.career_path_next, true],
];

function FieldRow({ label, value, list }) {
  const items = list ? splitItems(value) : [];

  return (
    <div className="py-2.5 border-t border-slate-200 first:border-t-0">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="bg-white border border-slate-200 rounded-full px-2.5 py-0.5 text-[13px] text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="m-0 mt-1 text-[13px] leading-7 text-slate-700">{value || "—"}</p>
      )}
    </div>
  );
}

export default function JobRecordFields({ record, className = "" }) {
  return (
    <div className={`px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 ${className}`}>
      {ROWS.map(([key, label, list]) => (
        <FieldRow key={key} label={label} value={record[key]} list={list} />
      ))}
    </div>
  );
}
