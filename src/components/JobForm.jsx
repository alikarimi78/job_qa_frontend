import { FormProvider, useForm } from "react-hook-form";
import Input from "@components/ui/Input";
import ItemsInput, { cellFromItems, itemsFromCell } from "@components/ui/ItemsInput";
import Select from "@components/ui/Select";
import SubmitBar from "@components/ui/SubmitBar";
import Textarea from "@components/ui/Textarea";
import { FIELD_LABELS } from "@constant/fieldLabels";

const PROSE = [
  ["job_title", "عنوان شغل", "توسعه‌دهنده بک‌اند"],
];

const LISTS = [
  ["aliases", "نام‌های دیگر", "برنامه‌نویس سرور"],
  ["work_context", FIELD_LABELS.work_context, "کار گروهی"],
  ["tools", FIELD_LABELS.tools, "پایتون"],
  ["skills", FIELD_LABELS.skills, "حل مسئله"],
  ["knowledge", FIELD_LABELS.knowledge, "ساختمان داده"],
  ["abilities", FIELD_LABELS.abilities, "تفکر تحلیلی"],
  ["career_path_next", FIELD_LABELS.career_path_next, "مهندس ارشد"],
  ["responsibilities", "وظایف و مسئولیت‌ها", "طراحی و پیاده‌سازی API"],
];

const KEYS = [...PROSE.map(([k]) => k), "description", ...LISTS.map(([k]) => k)];

const PUBLIC = "";
// The same "no organization" value, for a caller that files a record without opening the form.
export const PUBLIC_OWNER = PUBLIC;

// `owners` is the organizations this caller may hand the record to, and `allowPublic`
// whether the shared corpus is one of the choices. With neither — a user who sits in no
// organization — the field is not drawn and the body never mentions the owner, which is
// what leaves an existing record where it already was.
function toFormValues(initial, owners, allowPublic) {
  const values = { job_title: "", description: "" };
  for (const key of ["job_title", "description"]) {
    values[key] = initial?.[key] ?? "";
  }
  for (const [key] of LISTS) {
    values[key] = itemsFromCell(initial?.[key] ?? "");
  }
  values.organization_id =
    initial?.organization_id != null
      ? String(initial.organization_id)
      : allowPublic
        ? PUBLIC
        : String(owners[0]?.id ?? PUBLIC);
  return values;
}

export default function JobForm({
  onSubmit,
  submitLabel,
  busy,
  initial,
  actions,
  formId,
  owners = [],
  allowPublic = true,
}) {
  const methods = useForm({ defaultValues: toFormValues(initial, owners, allowPublic) });
  const owner = methods.watch("organization_id");

  // An other name becomes the title and the title takes its place among the other names, so the
  // swap loses neither.
  const promoteAlias = (alias) => {
    const title = methods.getValues("job_title").trim();
    const aliases = methods.getValues("aliases") ?? [];
    const next = title
      ? aliases.map((name) => (name === alias ? title : name))
      : aliases.filter((name) => name !== alias);
    methods.setValue("job_title", alias, { shouldDirty: true, shouldValidate: true });
    methods.setValue("aliases", next, { shouldDirty: true, shouldValidate: true });
  };

  const submit = (values) => {
    const body = { job_title: values.job_title, description: values.description };
    for (const [key] of LISTS) body[key] = cellFromItems(values[key]);
    if (owners.length) {
      body.organization_id =
        values.organization_id === PUBLIC ? null : Number(values.organization_id);
    }
    onSubmit(body, () => methods.reset(toFormValues(null, owners, allowPublic)));
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

          {owners.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">دامنه شغل</label>
              <Select
                value={owner}
                onChange={(event) =>
                  methods.setValue("organization_id", event.target.value)
                }
                className="w-full h-11"
              >
                {allowPublic && <option value={PUBLIC}>عمومی — همه سازمان‌ها</option>}
                {owners.map((organization) => (
                  <option key={organization.id} value={String(organization.id)}>
                    اختصاصی — {organization.name}
                  </option>
                ))}
              </Select>
              <span className="text-xs text-slate-500 leading-6">
                شغل عمومی در نتایج تحلیل تمامی سازمان‌ها دیده می‌شود؛ شغل اختصاصی تنها برای
                کاربران همان سازمان.
              </span>
            </div>
          )}
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
              hint={
                key === "aliases"
                  ? "هر مورد را جداگانه وارد و با + اضافه نمایید؛ با دکمه جابه‌جایی کنار هر نام، آن نام جایگزین عنوان شغل می‌شود"
                  : "هر مورد را جداگانه وارد و با + اضافه نمایید"
              }
              onPick={key === "aliases" ? promoteAlias : undefined}
              pickLabel={(item) => `جایگزینی عنوان شغل با «${item}»`}
            />
          ))}
        </div>

        {!formId && <SubmitBar label={submitLabel} busy={busy} actions={actions} />}
      </form>
    </FormProvider>
  );
}
