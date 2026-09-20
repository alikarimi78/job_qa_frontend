import { FIELD_LABELS } from "@constant/fieldLabels";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Card from "@components/ui/Card";
import ItemsInput from "@components/ui/ItemsInput";
import SubmitBar from "@components/ui/SubmitBar";
import ProfileMatches from "@components/ProfileMatches";
import { useAdvancedSearchMutation, useProfileVocabularyQuery } from "@services/jobsApi";
import { faNumber } from "@utils/jalali";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

// The examples in the boxes are one job read column by column — «حسابداران و حسابرسان», whose record
// holds every one of them — so a reader sees what a profile of a single person looks like rather than
// six unrelated words. The fourth entry is how many items the field must carry, 0 where it is
// optional: the client's copy of `routers/search/schemas.py:PROFILE_REQUIRED`, which refuses a
// profile falling short of it. The required four are what tell two jobs with the same skills apart;
// duties and where the reader wants to go stay optional.
const FIELDS = [
  ["skills", FIELD_LABELS.skills, "تفکر انتقادی", 2],
  ["knowledge", FIELD_LABELS.knowledge, "اقتصاد و حسابداری", 1],
  ["abilities", FIELD_LABELS.abilities, "استدلال ریاضی", 1],
  ["work_context", FIELD_LABELS.work_context, "اهمیت بالای دقت در کار", 1],
  ["responsibilities", "وظایف و مسئولیت‌ها", "تهیه صورت‌های مالی", 0],
  ["career_path_next", FIELD_LABELS.career_path_next, "مدیران امور مالی", 0],
];

const BLANK = Object.fromEntries(FIELDS.map(([key]) => [key, []]));
const REQUIRED = FIELDS.filter(([, , , min]) => min > 0);

export default function AdvancedSearch() {
  const methods = useForm({ defaultValues: BLANK });
  const [result, setResult] = useState(null);
  const [advancedSearch, { isLoading }] = useAdvancedSearchMutation();
  // The phrases the records themselves use, per field. An item picked from them is one coverage can
  // find, where the same skill in other words («ارتباط مؤثر» for «سخن گفتن») often matches nothing.
  const { data: vocabulary } = useProfileVocabularyQuery();

  const values = methods.watch();
  // What is still missing, named, so the button says why it is disabled rather than only that it is.
  const missing = REQUIRED.filter(([key, , , min]) => (values[key]?.length ?? 0) < min);
  const ready = missing.length === 0;

  async function submit(form) {
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
      title="تحلیل پیشرفته"
      hint="به‌جای طرح پرسش، مهارت‌ها و ویژگی‌های خود را وارد نمایید تا نزدیک‌ترین مشاغل پایگاه داده رتبه‌بندی شوند و میزان پوشش هر شغل نسبت به موارد واردشده مشخص گردد. بخش‌های ستاره‌دار الزامی هستند. هر مورد را جداگانه وارد و با + اضافه نمایید؛ برای محاسبه دقیق پوشش، موارد را از فهرست پیشنهادی که هنگام تایپ نمایش داده می‌شود انتخاب نمایید."
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 items-start">
            {FIELDS.map(([key, label, placeholder, min]) => (
              <ItemsInput
                key={key}
                name={key}
                label={label}
                placeholder={placeholder}
                required={min > 0}
                min={Math.max(min, 1)}
                hint={[
                  min > 0 ? `الزامی — دست‌کم ${faNumber(min)} مورد` : "اختیاری",
                  vocabulary?.fields?.[key] ? "از فهرست پیشنهادی انتخاب نمایید" : null,
                ]
                  .filter(Boolean)
                  .join("؛ ")}
                suggestions={vocabulary?.fields?.[key]}
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
                : `برای انجام تحلیل، این بخش‌ها را تکمیل نمایید: ${missing
                    .map(([, label, , min]) => `${label} (${faNumber(min)} مورد)`)
                    .join("، ")}`
            }
          />
        </form>
      </FormProvider>

      <ProfileMatches result={result} />
    </Card>
  );
}
