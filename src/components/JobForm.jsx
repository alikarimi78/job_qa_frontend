import { useState } from "react";

const FIELDS = [
  ["job_title", "عنوان شغل", "توسعه‌دهنده بک‌اند"],
  ["aliases", "نام‌های دیگر", "برنامه‌نویس سرور | مهندس API"],
  ["tools", "ابزارها", "پایتون | جنگو | PostgreSQL"],
  ["skills", "مهارت‌ها", "حل مسئله | طراحی سیستم"],
  ["work_context", "محیط کاری", "دفتر یا دورکاری"],
  ["career_path_next", "مسیر شغلی بعدی", "مهندس ارشد | مدیر فنی"],
];

const AREAS = [
  ["description", "شرح شغل", "توسعه و نگهداری منطق سمت سرور..."],
  ["responsibilities", "وظایف و مسئولیت‌ها", "طراحی API | بهینه‌سازی کوئری‌ها"],
];

const EMPTY = Object.fromEntries([...FIELDS, ...AREAS].map(([k]) => [k, ""]));

// Shared by the user suggestion page and the admin direct-add form
export default function JobForm({ onSubmit, submitLabel, busy }) {
  const [form, setForm] = useState(EMPTY);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form, () => setForm(EMPTY)); }}>
      <div className="grid2">
        {FIELDS.map(([key, label, ph]) => (
          <div key={key}>
            <label>{label}</label>
            <input required value={form[key]} onChange={set(key)} placeholder={ph} />
          </div>
        ))}
      </div>
      {AREAS.map(([key, label, ph]) => (
        <div key={key} style={{ marginTop: 12 }}>
          <label>{label}</label>
          <textarea required rows={3} value={form[key]} onChange={set(key)} placeholder={ph} />
        </div>
      ))}
      <button className="primary" style={{ marginTop: 16 }} disabled={busy}>
        {busy ? "..." : submitLabel}
      </button>
    </form>
  );
}
