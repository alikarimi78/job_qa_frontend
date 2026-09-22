export const FIELD_LABELS = {
  tools: "آشنایی با ابزارها",
  work_context: "ویژگی‌های محیط کاری",
  career_path_next: "مسیر پیشرفت شغلی",
  skills: "مهارت‌های شغلی",
  knowledge: "دانش تخصصی شغل",
  abilities: "توانایی‌های شغلی",
};

export const fieldLabel = (key, fallback) => FIELD_LABELS[key] ?? fallback;

export const relabelDetail = (detail) => ({
  ...detail,
  fields: detail.fields.map((field) => ({ ...field, label: fieldLabel(field.key, field.label) })),
});
