/** The job record's columns as the client shows them: display order, which ones are prose rather than «|»-separated lists, and their labels. Must stay in step with the backend's column list. */
import { FIELD_LABELS } from "./fieldLabels";

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

export const LIST_KEYS = DETAIL_ORDER.filter((key) => !PROSE_KEYS.has(key));

export const COMPETENCY_KEYS = ["skills", "knowledge", "abilities"];

export const COLUMN_LABELS = {
  job_title: "عنوان شغل",
  description: "شرح شغل",
  responsibilities: "وظایف و مسئولیت‌ها",
  aliases: "نام‌های دیگر",
  ...FIELD_LABELS,
};

export const columnLabel = (key) => COLUMN_LABELS[key] ?? key;
