import { FIELD_LABELS } from "@constant/fieldLabels";
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

const FIELDS = [
  ["skills", "مهارت‌ها و شایستگی‌ها", "حل مسئله", true],
  ["knowledge", "دانش تخصصی", "مکانیک خودرو", false],
  ["abilities", "توانایی‌ها", "تفکر تحلیلی", false],
  ["responsibilities", "وظایف و مسئولیت‌ها", "هدایت خودرو زرهی", false],
  ["work_context", FIELD_LABELS.work_context, "فضای باز", false],
  ["career_path_next", FIELD_LABELS.career_path_next, "سرپرست فنی", false],
];

const BLANK = Object.fromEntries(FIELDS.map(([key]) => [key, []]));

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
