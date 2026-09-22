import { FIELD_LABELS } from "./fieldLabels";
import { itemsFromCell } from "@components/ui/ItemsInput";

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
