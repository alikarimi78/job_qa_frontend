/** One pending suggestion: its title, number and scope, the approve/reject/edit/details buttons, and the full record when expanded. */
import JobRecordFields from "@components/job/JobRecordFields";
import Badge from "@components/ui/Badge";
import Button from "@components/ui/Button";
import { faNumber } from "@utils/numbers";

export default function SuggestionReviewItem({ suggestion, onApprove, onReject, onEdit, onToggle }) {
  return (
    <div className="border-t border-slate-200 first:border-t-0">
      <div className="flex items-center justify-between gap-3 flex-wrap py-3">
        <div>
          <strong className="text-sm text-slate-800">{suggestion.job_title}</strong>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">پیشنهاد #{faNumber(suggestion.id)}</span>
            <Badge tone={suggestion.scope.tone}>{suggestion.scope.label}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="success" onClick={() => onApprove(suggestion)}>
            تایید
          </Button>
          <Button variant="danger" onClick={() => onReject(suggestion)}>
            رد
          </Button>
          <Button variant="outline" onClick={() => onEdit(suggestion.id)}>
            ویرایش
          </Button>
          <Button variant="outline" onClick={() => onToggle(suggestion.id)}>
            {suggestion.isExpanded ? "بستن" : "جزئیات"}
          </Button>
        </div>
      </div>

      {suggestion.isExpanded && <JobRecordFields record={suggestion} className="mb-3" />}
    </div>
  );
}
