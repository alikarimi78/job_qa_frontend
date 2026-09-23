/** Review queue of pending job suggestions: approve, reject or correct each one, filter by scope, and follow the embedding rebuild that approval triggers. */
import JobEditDialog from "@components/job/JobEditDialog";
import OrganizationSelect from "@components/OrganizationSelect";
import Badge from "@components/ui/Badge";
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import { faNumber } from "@utils/numbers";
import RebuildPanel from "./components/RebuildPanel";
import SuggestionReviewItem from "./components/SuggestionReviewItem";
import useSuggestionReviews from "./hooks/useSuggestionReviews";

const EDIT_HINT =
  "اصلاح پیشنهاد پیش از تصمیم‌گیری. با ذخیره، رکورد همچنان در صف بررسی باقی می‌ماند؛ افزودن آن به پایگاه داده مستلزم انتخاب گزینه «تایید» است.";

export default function SuggestionReviewsPage() {
  const reviews = useSuggestionReviews();
  const pendingCount = reviews.suggestions.length;

  return (
    <>
      <Card
        title="بررسی پیشنهادها"
        hint="پیشنهاد عمومی تاییدشده به پایگاه داده مشترک تمامی سازمان‌ها افزوده می‌شود و پیشنهاد اختصاصی تنها در نتایج تحلیل همان سازمان دیده می‌شود"
        actions={
          <Badge tone={pendingCount ? "warning" : "neutral"}>
            {faNumber(pendingCount)} پیشنهاد در انتظار
          </Badge>
        }
      >
        <RebuildPanel rebuild={reviews.rebuild} />

        {reviews.isSuperAdmin && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <label className="text-sm text-slate-600">دامنه:</label>
            <OrganizationSelect
              value={reviews.scopeFilter}
              onChange={reviews.setScopeFilter}
              organizations={reviews.organizations}
              publicLabel="عمومی"
            />
          </div>
        )}

        {reviews.isLoading && <Loader />}
        {!reviews.isLoading && pendingCount === 0 && (
          <p className="text-sm text-slate-500">پیشنهاد در انتظاری وجود ندارد.</p>
        )}

        <div className="flex flex-col">
          {reviews.suggestions.map((suggestion) => (
            <SuggestionReviewItem
              key={suggestion.id}
              suggestion={suggestion}
              onApprove={reviews.approve}
              onReject={reviews.reject}
              onEdit={reviews.startEditing}
              onToggle={reviews.toggleExpanded}
            />
          ))}
        </div>
      </Card>

      {reviews.editingSuggestion && (
        <JobEditDialog
          job={reviews.editingSuggestion}
          hint={EDIT_HINT}
          owners={reviews.organizations}
          allowPublic={reviews.isSuperAdmin}
          busy={reviews.isSaving}
          onClose={reviews.stopEditing}
          onSubmit={reviews.saveEdit}
        />
      )}
    </>
  );
}
