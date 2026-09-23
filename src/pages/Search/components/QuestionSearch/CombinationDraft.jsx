/** For a two-job combination: either the composed combined job (with a notice that it is not in the database) or the reason no combined job could be composed. */
import JobDetails from "@components/job/JobDetails/JobDetails";
import { COMPOSED_NOTICE, DRAFT_REASON_MESSAGES } from "../../constants";
import Notice from "./Notice";

const reasonMessage = (result) =>
  (DRAFT_REASON_MESSAGES[result.draft_reason] ?? DRAFT_REASON_MESSAGES.unavailable)(result);

export default function CombinationDraft({ result, view, onPickAlias }) {
  return (
    <div className="flex flex-col gap-4">
      <Notice
        title={view.hasDraftOffer ? COMPOSED_NOTICE.title : "شغل ترکیبی برای پیشنهاد ایجاد نشد"}
      >
        {view.hasDraftOffer ? COMPOSED_NOTICE.body : reasonMessage(result)}
      </Notice>
      {view.hasDraftOffer && (
        <JobDetails
          details={[view.draftDetail]}
          title={`مشخصات تدوین‌شده «${view.draftDetail.job_title}»`}
          onPickAlias={onPickAlias}
          className=""
        />
      )}
    </div>
  );
}
