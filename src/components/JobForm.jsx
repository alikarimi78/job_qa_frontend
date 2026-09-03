import { FormProvider, useForm } from "react-hook-form";
import Input from "@components/ui/Input";
import ItemsInput, { cellFromItems, itemsFromCell } from "@components/ui/ItemsInput";
import SubmitBar from "@components/ui/SubmitBar";
import Textarea from "@components/ui/Textarea";

const PROSE = [
  ["job_title", "عنوان شغل", "توسعه‌دهنده بک‌اند"],
];

const LISTS = [
  ["aliases", "نام‌های دیگر", "برنامه‌نویس سرور"],
  ["work_context", "محیط کاری", "کار گروهی"],
  ["tools", "ابزارها", "پایتون"],
  ["skills", "مهارت‌ها", "حل مسئله"],
  ["knowledge", "دانش تخصصی", "ساختمان داده"],
  ["abilities", "توانایی‌ها", "تفکر تحلیلی"],
  ["career_path_next", "مسیر شغلی بعدی", "مهندس ارشد"],
  ["responsibilities", "وظایف و مسئولیت‌ها", "طراحی و پیاده‌سازی API"],
];

const KEYS = [...PROSE.map(([k]) => k), "description", ...LISTS.map(([k]) => k)];

function toFormValues(initial) {
  const values = { job_title: "", description: "" };
  for (const key of ["job_title", "description"]) {
    values[key] = initial?.[key] ?? "";
  }
  for (const [key] of LISTS) {
    values[key] = itemsFromCell(initial?.[key] ?? "");
  }
  return values;
}

export default function JobForm({ onSubmit, submitLabel, busy, initial, actions, formId }) {
  const methods = useForm({ defaultValues: toFormValues(initial) });

  const submit = (values) => {
    const body = { job_title: values.job_title, description: values.description };
    for (const [key] of LISTS) body[key] = cellFromItems(values[key]);
    onSubmit(body, () => methods.reset(toFormValues(null)));
  };

  return (
    <FormProvider {...methods}>
      <form
        id={formId}
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {PROSE.map(([key, label, placeholder]) => (
            <Input
              key={key}
              name={key}
              label={label}
              placeholder={placeholder}
              registerProps={{ required: `${label} را وارد نمایید` }}
            />
          ))}
        </div>

        <Textarea
          name="description"
          label="شرح شغل"
          placeholder="توسعه و نگهداری منطق سمت سرور..."
          rows={3}
          registerProps={{ required: "شرح شغل را وارد نمایید" }}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 items-start">
          {LISTS.map(([key, label, placeholder]) => (
            <ItemsInput
              key={key}
              name={key}
              label={label}
              placeholder={placeholder}
              required
              hint="هر مورد را جداگانه وارد و با + اضافه نمایید"
            />
          ))}
        </div>

        {!formId && <SubmitBar label={submitLabel} busy={busy} actions={actions} />}
      </form>
    </FormProvider>
  );
}
