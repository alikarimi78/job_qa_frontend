import { FormProvider, useForm } from "react-hook-form";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Textarea from "@components/ui/Textarea";
import { Spinner } from "@components/ui/Loader";

// The dataset's ten canonical columns. Every one is required by JobIn on the
// backend, so a field missing here fails the whole submit with a 422.
const FIELDS = [
  ["job_title", "عنوان شغل", "توسعه‌دهنده بک‌اند"],
  ["aliases", "نام‌های دیگر", "برنامه‌نویس سرور | مهندس API"],
  ["tools", "ابزارها", "پایتون | جنگو | PostgreSQL"],
  ["skills", "مهارت‌ها", "حل مسئله | طراحی سیستم"],
  ["knowledge", "دانش تخصصی", "ساختمان داده | پایگاه داده"],
  ["abilities", "توانایی‌ها", "تفکر تحلیلی | تمرکز طولانی"],
  ["work_context", "محیط کاری", "دفتر یا دورکاری"],
  ["career_path_next", "مسیر شغلی بعدی", "مهندس ارشد | مدیر فنی"],
];

const AREAS = [
  ["description", "شرح شغل", "توسعه و نگهداری منطق سمت سرور..."],
  ["responsibilities", "وظایف و مسئولیت‌ها", "طراحی API | بهینه‌سازی کوئری‌ها"],
];

const KEYS = [...FIELDS, ...AREAS].map(([key]) => key);
const EMPTY = Object.fromEntries(KEYS.map((key) => [key, ""]));

// The «|» rule is stated once by the caller's card and demonstrated by every list
// column's placeholder («پایتون | جنگو | PostgreSQL»). Repeating it under each of the
// seven list fields was pure noise. The three prose columns — job_title, description,
// work_context — take a comma as punctuation and must never receive a «|».

export default function JobForm({ onSubmit, submitLabel, busy, initial }) {
  // Projected onto the ten columns, so whatever extra keys a generated draft carried
  // never reach the request body.
  const methods = useForm({
    defaultValues: Object.fromEntries(KEYS.map((key) => [key, initial?.[key] ?? ""])),
  });

  const submit = (values) => onSubmit(values, () => methods.reset(EMPTY));

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {FIELDS.map(([key, label, placeholder]) => (
            <Input
              key={key}
              name={key}
              label={label}
              placeholder={placeholder}
              registerProps={{ required: `${label} را وارد کنید` }}
            />
          ))}
        </div>

        {AREAS.map(([key, label, placeholder]) => (
          <Textarea
            key={key}
            name={key}
            label={label}
            placeholder={placeholder}
            rows={3}
            registerProps={{ required: `${label} را وارد کنید` }}
          />
        ))}

        <div>
          <Button variant="primary" buttonProps={{ type: "submit", disabled: busy }}>
            {busy ? (
              <>
                <Spinner />
                در حال ثبت...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
