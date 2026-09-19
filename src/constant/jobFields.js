import { FIELD_LABELS } from "./fieldLabels";
import { itemsFromCell } from "@components/ui/ItemsInput";

// The nine columns a job's boxes show, in the order the backend's `DETAIL_FIELDS` draws them. The
// client needs its own copy only where it lays out a record the backend did not send as details:
// the job form, and a stored record read in the admin panels. Keep it in step with
// `job_qa_service/columns.py`.
export const DETAIL_ORDER = [
  "description",
  "responsibilities",
  "skills",
  "knowledge",
  "abilities",
  "work_context",
  "tools",
  "career_path_next",
  "aliases",
];

export const PROSE_KEYS = new Set(["job_title", "description"]);

export const COLUMN_LABELS = {
  job_title: "عنوان شغل",
  description: "شرح شغل",
  responsibilities: "وظایف و مسئولیت‌ها",
  aliases: "نام‌های دیگر",
  ...FIELD_LABELS,
};

// A stored record in the shape `render.job_detail` sends, so JobDetails can draw it: prose as its
// value, a list column split into items, empty columns left out. Nothing folds — whoever reads a
// record here is reviewing it, and needs every item.
export function recordDetail(record) {
  const fields = [];
  for (const key of DETAIL_ORDER) {
    const value = String(record?.[key] ?? "").trim();
    const items = PROSE_KEYS.has(key) ? [] : itemsFromCell(value);
    if (!value || (!PROSE_KEYS.has(key) && !items.length)) continue;
    fields.push({
      key,
      label: COLUMN_LABELS[key],
      value: items.length ? items.join("، ") : value,
      items,
      primary: false,
      preview: items.length,
    });
  }
  return { job_title: String(record?.job_title ?? "").trim(), fields };
}
