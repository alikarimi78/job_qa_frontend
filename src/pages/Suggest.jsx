import { useState } from "react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import JobForm from "@components/JobForm";
import { useSuggestJobMutation } from "@services/jobsApi";
import { clearDraft, readDraft } from "@utils/draft";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

export default function Suggest() {
  // Read once at mount: a draft accepted on the search page arrives here through
  // the stash, so re-renders never resurrect one a submit has already consumed.
  const [draft, setDraft] = useState(readDraft);
  const [done, setDone] = useState(false);
  const [suggestJob, { isLoading }] = useSuggestJobMutation();

  async function submit(form, reset) {
    setDone(false);
    try {
      await suggestJob(form).unwrap();
      clearDraft();
      setDone(true);
      reset();
      showMessage.success("پیشنهاد ثبت شد و در انتظار بررسی ادمین است.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  function startBlank() {
    clearDraft();
    setDraft(null);
  }

  return (
    <Card
      title="پیشنهاد شغل جدید"
      hint="همه فیلدها الزامی‌اند و پیشنهاد پس از تأیید ادمین به دیتاست اضافه می‌شود. در فیلدهای چندمقداری هر مورد را جداگانه بنویسید و با + اضافه کنید؛ جداکننده را خودِ سامانه می‌گذارد."
    >
      {draft && !done && (
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-sm text-amber-800 leading-7">
            این فرم با مشخصات شغل پیشنهادی «{draft.job_title}» پر شده است؛ پیش از ارسال آن را بررسی
            و در صورت نیاز ویرایش کنید.
          </span>
          <Button variant="outline" buttonProps={{ type: "button", onClick: startBlank }}>
            فرم خالی
          </Button>
        </div>
      )}

      {done && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          پیشنهاد ثبت شد و در انتظار بررسی ادمین است.
        </div>
      )}

      {/* Keyed so switching to a blank form actually resets the inputs */}
      <JobForm
        key={draft ? "draft" : "blank"}
        initial={draft}
        onSubmit={submit}
        submitLabel="ثبت پیشنهاد"
        busy={isLoading}
      />
    </Card>
  );
}
