import { FormProvider, useForm } from "react-hook-form";
import Input from "@components/ui/Input";
import ItemsInput, { cellFromItems, itemsFromCell } from "@components/ui/ItemsInput";
import SubmitBar from "@components/ui/SubmitBar";
import Textarea from "@components/ui/Textarea";

// The dataset's ten canonical columns. Every one is required by JobIn on the
// backend, so a field missing here fails the whole submit with a 422.
//
// They are split the way the dataset splits them, not the way they happen to look on
// screen: the three PROSE columns — job_title, description, work_context — are text a
// comma belongs in, and the other seven are «|»-joined lists. That split is now visible
// in the form itself. A list column is collected one item at a time («+»), because
// asking the user to type the separator was asking them to guess it, and a guessed «،»
// went into the corpus as one unsplittable cell that no search could ever match.
// The joining happens here, at the edge, so the request body is exactly what it was.
const PROSE = [
  ["job_title", "عنوان شغل", "توسعه‌دهنده بک‌اند"],
  ["work_context", "محیط کاری", "دفتر یا دورکاری"],
];

const LISTS = [
  ["aliases", "نام‌های دیگر", "برنامه‌نویس سرور"],
  ["tools", "ابزارها", "پایتون"],
  ["skills", "مهارت‌ها", "حل مسئله"],
  ["knowledge", "دانش تخصصی", "ساختمان داده"],
  ["abilities", "توانایی‌ها", "تفکر تحلیلی"],
  ["career_path_next", "مسیر شغلی بعدی", "مهندس ارشد"],
  ["responsibilities", "وظایف و مسئولیت‌ها", "طراحی و پیاده‌سازی API"],
];

const KEYS = [...PROSE.map(([k]) => k), "description", ...LISTS.map(([k]) => k)];

// A draft from the discovery path arrives in the dataset's own shape — «|»-joined
// strings — so the list columns are split back into items to fill the boxes, and
// rejoined on submit. Anything else the draft carried is dropped by projecting onto
// the ten keys.
function toFormValues(initial) {
  const values = { job_title: "", work_context: "", description: "" };
  for (const key of ["job_title", "work_context", "description"]) {
    values[key] = initial?.[key] ?? "";
  }
  for (const [key] of LISTS) {
    values[key] = itemsFromCell(initial?.[key] ?? "");
  }
  return values;
}

// `actions` rides through to the SubmitBar: the discovery path puts «رد پیشنهاد» next to
// the green submit, since accepting and declining a proposed record are two answers to
// the same form.
export default function JobForm({ onSubmit, submitLabel, busy, initial, actions }) {
  const methods = useForm({ defaultValues: toFormValues(initial) });

  const submit = (values) => {
    const body = { job_title: values.job_title, work_context: values.work_context,
                   description: values.description };
    for (const [key] of LISTS) body[key] = cellFromItems(values[key]);
    onSubmit(body, () => methods.reset(toFormValues(null)));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)} className="flex flex-col gap-4">
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

        <SubmitBar label={submitLabel} busy={busy} actions={actions} />
      </form>
    </FormProvider>
  );
}
