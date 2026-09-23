/** Card showing one answer to a question: header, written answer, job boxes, and — when the job is missing from the database — the offer to add it, the editor, and the nearest existing job. */
import Card from "@components/ui/Card";
import JobDetails from "@components/job/JobDetails/JobDetails";
import { COMPOSED_NOTICE } from "../../constants";
import useSearchResult from "../../hooks/useSearchResult";
import AnswerPanel from "../AnswerPanel";
import CombinationDraft from "./CombinationDraft";
import DraftEditor from "./DraftEditor";
import DraftOfferPrompt from "./DraftOfferPrompt";
import NearestJob from "./NearestJob";
import Notice from "./Notice";
import OwnerChoiceDialog from "./OwnerChoiceDialog";
import ResultHeader from "./ResultHeader";
import SuggestionDeclinedNotice from "./SuggestionDeclinedNotice";
import SuggestionFiledNotice from "./SuggestionFiledNotice";

export default function SearchResultCard({ result, askedQuestion }) {
  const { view, ownerName, star, report, draft, nearest } = useSearchResult(result, askedQuestion);
  const isEditingComposed = view.isComposed && draft.isEditing;
  const showsCombination =
    view.isCombination &&
    (view.hasDraftOffer || result.draft_reason) &&
    !(view.hasDraftOffer && draft.isEditing);

  return (
    <Card>
      <div className="flex flex-col gap-6">
        <ResultHeader view={view} ownerName={ownerName} star={star} report={report} />

        {view.isComposed && !draft.isEditing && (
          <Notice title={COMPOSED_NOTICE.title}>{COMPOSED_NOTICE.body}</Notice>
        )}

        <AnswerPanel label={view.answerLabel} text={result.answer} />

        {!isEditingComposed && (
          <JobDetails
            details={result.details}
            title={view.detailsTitle}
            onPickAlias={view.isComposed ? draft.pickAlias : undefined}
            className=""
          />
        )}

        {showsCombination && (
          <CombinationDraft result={result} view={view} onPickAlias={draft.pickAlias} />
        )}

        {draft.isOpen && draft.isEditing && <DraftEditor draft={draft} />}
        {draft.isOpen && !draft.isEditing && <DraftOfferPrompt draft={draft} />}
        {view.hasDraftOffer && draft.isFiled && <SuggestionFiledNotice />}
        {view.hasDraftOffer && draft.isDeclined && <SuggestionDeclinedNotice />}

        {view.nearestJob && (
          <NearestJob job={view.nearestJob} isOpen={nearest.isOpen} onToggle={nearest.toggle} />
        )}
      </div>

      <OwnerChoiceDialog ownerChoice={draft.ownerChoice} isFiling={draft.isFiling} />
    </Card>
  );
}
