/** Card with the job editor for suggesting a new job; a green box confirms each successful filing. */
import JobForm from "@components/job/JobForm/JobForm";
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import useNewSuggestion, { FILED_MESSAGE } from "../hooks/useNewSuggestion";

export default function NewSuggestion() {
  const suggestion = useNewSuggestion();

  return (
    <Card
      title="پیشنهاد شغل جدید"
      hint="تکمیل تمامی بخش‌ها الزامی است و پیشنهاد پس از تایید مدیر سامانه به پایگاه داده افزوده می‌شود."
    >
      {suggestion.isFiled && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          {FILED_MESSAGE}
        </div>
      )}

      {suggestion.areOwnersLoading ? (
        <Loader />
      ) : (
        <JobForm
          onSubmit={suggestion.fileSuggestion}
          submitLabel="ثبت پیشنهاد"
          busy={suggestion.isFiling}
          owners={suggestion.owners}
          defaultOwner={suggestion.defaultOwner}
        />
      )}
    </Card>
  );
}
