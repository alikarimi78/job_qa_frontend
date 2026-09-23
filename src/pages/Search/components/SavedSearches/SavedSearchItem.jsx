/** One row of the starred list: the question, its job title, kind of answer and date, with view and remove buttons. */
import { StarIcon, TrashIcon } from "@components/icons";
import Badge from "@components/ui/Badge";
import Button from "@components/ui/Button";
import { faDate } from "@utils/jalali";
import { SAVED_SEARCH_MODE_LABELS } from "../../constants";

export default function SavedSearchItem({ savedSearch, onOpen, onRemove }) {
  return (
    <li
      className="flex items-start justify-between gap-4 flex-wrap py-3.5
                 border-t border-slate-200 first:border-t-0"
    >
      <div className="min-w-0 flex items-start gap-3">
        <span
          aria-hidden="true"
          className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 border border-amber-200
                     flex items-center justify-center shrink-0"
        >
          <StarIcon className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <strong className="block text-sm text-slate-800 leading-6">{savedSearch.question}</strong>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {savedSearch.job_title && <Badge tone="accent">{savedSearch.job_title}</Badge>}
            <span className="text-xs text-slate-400">
              {SAVED_SEARCH_MODE_LABELS[savedSearch.mode] ?? savedSearch.mode}
            </span>
            <span className="text-xs text-slate-400 fa-nums">{faDate(savedSearch.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onOpen}>
          مشاهده تحلیل
        </Button>
        <Button variant="danger-outline" size="sm" onClick={onRemove}>
          <TrashIcon className="w-3.5 h-3.5" />
          حذف
        </Button>
      </div>
    </li>
  );
}
