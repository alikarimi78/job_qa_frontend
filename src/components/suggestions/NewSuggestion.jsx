import { useState } from "react";
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import JobForm from "@components/JobForm";
import useSuggestionOwners from "@hook/useSuggestionOwners";
import { useSuggestJobMutation } from "@services/jobsApi";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

export default function NewSuggestion() {
  const [done, setDone] = useState(false);
  const [suggestJob, { isLoading }] = useSuggestJobMutation();
  // A super_admin may name any organization, everyone else only their own, and an account
  // in none is shown no choice — the super_admin, who sits in none, used to get none either.
  // The form waits for them: its default owner is fixed when it mounts.
  const { owners, allowPublic, defaultOwner, loading } = useSuggestionOwners();

  async function submit(form, reset) {
    setDone(false);
    try {
      await suggestJob(form).unwrap();
      setDone(true);
      reset();
      showMessage.success("پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  return (
    <Card
      title="پیشنهاد شغل جدید"
      hint="تکمیل تمامی فیلدها الزامی است و پیشنهاد پس از تایید مدیر سامانه به پایگاه داده افزوده می‌شود. در فیلدهای چندمقداری، هر مورد را جداگانه وارد و با + اضافه نمایید؛ جداکننده را سامانه اعمال می‌کند."
    >
      {done && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است.
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <JobForm
          onSubmit={submit}
          submitLabel="ثبت پیشنهاد"
          busy={isLoading}
          owners={owners}
          allowPublic={allowPublic}
          defaultOwner={defaultOwner}
        />
      )}
    </Card>
  );
}
