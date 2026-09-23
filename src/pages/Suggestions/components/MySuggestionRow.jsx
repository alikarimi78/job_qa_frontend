/** One of the user's suggestions: title and description beside its scope and review-status badges. */
import Badge from "@components/ui/Badge";

export default function MySuggestionRow({ suggestion }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-200 first:border-t-0">
      <div className="min-w-0">
        <strong className="text-sm text-slate-800">{suggestion.job_title}</strong>
        <p className="text-xs text-slate-500 mt-1 leading-6 line-clamp-2">{suggestion.description}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Badge tone={suggestion.scope.tone}>{suggestion.scope.label}</Badge>
        <Badge tone={suggestion.statusBadge.tone}>{suggestion.statusBadge.label}</Badge>
      </div>
    </div>
  );
}
