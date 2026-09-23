/** Turns a stored job record (one string per column) into the `{ job_title, fields }` detail shape the job boxes render. */
import { COLUMN_LABELS, DETAIL_ORDER, PROSE_KEYS } from "@constants/jobFields";
import { itemsFromCell } from "./itemCells";

export function recordDetail(record) {
  const fields = [];
  for (const key of DETAIL_ORDER) {
    const value = String(record?.[key] ?? "").trim();
    const isProse = PROSE_KEYS.has(key);
    const items = isProse ? [] : itemsFromCell(value);
    if (!value || (!isProse && !items.length)) continue;
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

export const swapAliasWithTitle = (aliases, alias, title) =>
  title
    ? aliases.map((name) => (name === alias ? title : name))
    : aliases.filter((name) => name !== alias);
