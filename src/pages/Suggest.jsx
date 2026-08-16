import { useState } from "react";
import Card from "@components/ui/Card";
import JobForm from "@components/JobForm";
import { useSuggestJobMutation } from "@services/jobsApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

// A record written from scratch. It used to be the second half of the discovery path as
// well — an accepted proposal was stashed in sessionStorage on the search page and this
// form was where it could finally be edited and sent. The offer is editable where it is
// made now (`components/search/QuestionSearch.jsx`), so the stash is gone and this page
// is the blank form it always looked like.
export default function Suggest() {
  const [done, setDone] = useState(false);
  const [suggestJob, { isLoading }] = useSuggestJobMutation();

  async function submit(form, reset) {
    setDone(false);
    try {
      await suggestJob(form).unwrap();
      setDone(true);
      reset();
      showMessage.success("پیشنهاد ثبت شد و در انتظار بررسی ادمین است.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  return (
    <Card
      title="پیشنهاد شغل جدید"
      hint="همه فیلدها الزامی‌اند و پیشنهاد پس از تایید ادمین به دیتاست اضافه می‌شود. در فیلدهای چندمقداری هر مورد را جداگانه بنویسید و با + اضافه کنید؛ جداکننده را خودِ سامانه می‌گذارد."
    >
      {done && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          پیشنهاد ثبت شد و در انتظار بررسی ادمین است.
        </div>
      )}

      <JobForm onSubmit={submit} submitLabel="ثبت پیشنهاد" busy={isLoading} />
    </Card>
  );
}
