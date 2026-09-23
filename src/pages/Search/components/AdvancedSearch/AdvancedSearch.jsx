/** The advanced tab of the analysis page: the user enters skills, knowledge and other traits, and the closest jobs are ranked with how much of the profile each covers. */
import { FormProvider } from "react-hook-form";
import Card from "@components/ui/Card";
import SubmitBar from "@components/ui/SubmitBar";
import { faNumber } from "@utils/numbers";
import { PROFILE_FIELDS } from "../../constants";
import useAdvancedSearch from "../../hooks/useAdvancedSearch";
import ProfileFieldInput from "./ProfileFieldInput";
import ProfileMatches from "./ProfileMatches";

const INTRO =
  "به‌جای طرح پرسش، مهارت‌ها و ویژگی‌های خود را وارد نمایید تا نزدیک‌ترین مشاغل پایگاه داده رتبه‌بندی شوند و میزان پوشش هر شغل نسبت به موارد واردشده مشخص گردد. بخش‌های ستاره‌دار الزامی هستند. هر مورد را جداگانه وارد و با + اضافه نمایید؛ برای محاسبه دقیق پوشش، موارد را از فهرست پیشنهادی که هنگام تایپ نمایش داده می‌شود انتخاب نمایید.";

const unmetFieldsHint = (unmetFields) =>
  `برای انجام تحلیل، این بخش‌ها را تکمیل نمایید: ${unmetFields
    .map((field) => `${field.label} (${faNumber(field.min)} مورد)`)
    .join("، ")}`;

export default function AdvancedSearch() {
  const search = useAdvancedSearch();

  return (
    <Card title="تحلیل پیشرفته" hint={INTRO}>
      <FormProvider {...search.methods}>
        <form onSubmit={search.submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 items-start">
            {PROFILE_FIELDS.map((field) => (
              <ProfileFieldInput
                key={field.key}
                field={field}
                suggestions={search.suggestionsFor(field.key)}
              />
            ))}
          </div>

          <SubmitBar
            label="تحلیل و رتبه‌بندی"
            busy={search.isSearching}
            busyLabel="در حال تحلیل..."
            disabled={!search.isReady || search.isSearching}
            hint={search.isReady ? undefined : unmetFieldsHint(search.unmetFields)}
          />
        </form>
      </FormProvider>

      <ProfileMatches result={search.result} />
    </Card>
  );
}
