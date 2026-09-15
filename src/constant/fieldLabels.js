// The client's names for three columns. The backend still labels them «ابزارها», «محیط کاری» and
// «مسیر شغلی بعدی»; every place the client shows a column's name reads these instead, and the PDF
// prints them too, since the report is built from the details the client posts back.
export const FIELD_LABELS = {
  tools: "آشنایی با ابزارها",
  work_context: "ویژگی‌های محیط کاری",
  career_path_next: "مسیر پیشرفت شغلی",
};

export const fieldLabel = (key, fallback) => FIELD_LABELS[key] ?? fallback;

export const relabelDetail = (detail) => ({
  ...detail,
  fields: detail.fields.map((field) => ({ ...field, label: fieldLabel(field.key, field.label) })),
});
