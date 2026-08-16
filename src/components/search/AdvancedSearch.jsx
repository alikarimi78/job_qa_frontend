import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Card from "@components/ui/Card";
import ItemsInput from "@components/ui/ItemsInput";
import SubmitBar from "@components/ui/SubmitBar";
import ProfileMatches from "@components/ProfileMatches";
import { useAdvancedSearchMutation } from "@services/jobsApi";
import { faNumber } from "@utils/jalali";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

// Advanced search: the user describes themselves and the corpus is ranked against it,
// instead of one question being answered about one job. It is the analytical half of
// discovery — «کدام شغل‌ها به من می‌خورند» — and it never designs a new record; someone
// describing a job they *want* is still served by the free-text box on «جستجوی معمولی»,
// the other half of this page.
//
// It was its own route and its own sidebar item until the customer asked for one search
// section: it is a panel now, mounted by `pages/Search.jsx` under the mode switch, and
// nothing about what it sends or shows changed with the move.
//
// The fields are `job_qa_service/columns.py:PROFILE_FIELDS` and `app/schemas.py`'s copy
// of it, read as a form. The three lists must be changed together — a field named here
// and not there comes back as a 422 that names a key this page has no box for.
//
// `tools` is missing on purpose and is not an oversight to fix: 1099 of the 1116 tool
// cells in the dataset are untranslated English («AutoCAD | Revit»), so a Persian item
// could never match one and the box would report a permanent 0%. It is still on the
// suggestion form, where the user is writing the record rather than searching it.
const FIELDS = [
  ["skills", "مهارت‌ها و شایستگی‌ها", "حل مسئله", true],
  ["knowledge", "دانش تخصصی", "مکانیک خودرو", false],
  ["abilities", "توانایی‌ها", "تفکر تحلیلی", false],
  ["responsibilities", "وظایف و مسئولیت‌ها", "هدایت خودرو زرهی", false],
  ["work_context", "محیط کاری", "فضای باز", false],
  ["career_path_next", "مسیر شغلی بعدی", "سرپرست فنی", false],
];

const BLANK = Object.fromEntries(FIELDS.map(([key]) => [key, []]));

// The server's own rule, repeated here so the form can say what is missing before it
// spends a request on a 422 (`app/schemas.py`: PROFILE_MIN_ITEMS / PROFILE_MIN_FIELDS).
const MIN_SKILLS = 2;
const MIN_FIELDS = 2;

export default function AdvancedSearch() {
  const methods = useForm({ defaultValues: BLANK });
  const [result, setResult] = useState(null);
  const [advancedSearch, { isLoading }] = useAdvancedSearchMutation();

  const values = methods.watch();
  const filled = FIELDS.filter(([key]) => (values[key]?.length ?? 0) > 0).length;
  const enoughSkills = (values.skills?.length ?? 0) >= MIN_SKILLS;
  const ready = enoughSkills && filled >= MIN_FIELDS;

  async function submit(form) {
    // Empty lists are dropped rather than sent: the server counts *filled* fields, and
    // a key carrying [] would otherwise look like a field the user answered.
    const profile = Object.fromEntries(
      Object.entries(form).filter(([, items]) => items?.length)
    );
    setResult(null);
    try {
      const data = await advancedSearch(profile).unwrap();
      setResult(data);
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  return (
    <Card
      title="جستجوی پیشرفته"
      hint="به‌جای طرح پرسش، مهارت‌ها و ویژگی‌های خود را وارد نمایید تا نزدیک‌ترین مشاغل پایگاه داده رتبه‌بندی شوند و میزان پوشش هر شغل نسبت به موارد واردشده مشخص گردد. هر مورد را جداگانه وارد و با + اضافه نمایید."
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 items-start">
            {FIELDS.map(([key, label, placeholder, required]) => (
              <ItemsInput
                key={key}
                name={key}
                label={required ? `${label} *` : label}
                placeholder={placeholder}
                required={required}
                min={required ? MIN_SKILLS : 1}
                hint={required ? `دست‌کم ${faNumber(MIN_SKILLS)} مورد` : "اختیاری"}
              />
            ))}
          </div>

          <SubmitBar
            label="تحلیل و رتبه‌بندی"
            busy={isLoading}
            busyLabel="در حال تحلیل..."
            disabled={!ready || isLoading}
            hint={
              ready
                ? undefined
                : "برای انجام تحلیل، دست‌کم دو مهارت و در مجموع دو فیلد را تکمیل نمایید."
            }
          />
        </form>
      </FormProvider>

      <ProfileMatches result={result} />
    </Card>
  );
}
