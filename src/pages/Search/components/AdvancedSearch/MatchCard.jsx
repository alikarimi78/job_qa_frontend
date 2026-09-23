/** One ranked job in the advanced search: header with coverage, the field-by-field coverage of the user's items, and the job's full details behind a toggle (open for the best match). */
import JobDetails from "@components/job/JobDetails/JobDetails";
import ToggleChevron from "@components/ui/ToggleChevron";
import useToggle from "@hooks/useToggle";
import { summarizeMatch } from "../../utils/summarizeMatch";
import { CoverageLegend } from "./CoverageChip";
import FieldCoverageRow from "./FieldCoverageRow";
import MatchCardHeader from "./MatchCardHeader";

export default function MatchCard({ match, rank }) {
  const isBest = rank === 0;
  const [isDetailsOpen, toggleDetails] = useToggle(isBest);
  const summary = summarizeMatch(match);

  return (
    <article
      className={`rounded-2xl border bg-white shadow-sm shadow-slate-900/5 overflow-hidden ${
        isBest ? "ring-2 ring-indigo-300/80 border-transparent" : "border-slate-200/80"
      }`}
    >
      <MatchCardHeader match={match} rank={rank} summary={summary} />

      {summary.fields.length > 0 && (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h5 className="text-[13px] font-bold text-slate-700 m-0 leading-6">پوشش موارد واردشده</h5>
            <CoverageLegend showsUnknown={summary.unknownCount > 0} />
          </div>
          <div className="divide-y divide-slate-100">
            {summary.fields.map((field) => (
              <FieldCoverageRow key={field.key} field={field} />
            ))}
          </div>
        </div>
      )}

      <footer className="flex items-center justify-end px-4 py-3 border-t border-slate-100">
        <button
          type="button"
          onClick={toggleDetails}
          aria-expanded={isDetailsOpen}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-slate-200
                     bg-white text-xs font-medium text-slate-700 cursor-pointer transition-colors duration-200
                     hover:bg-slate-800 hover:text-white hover:border-slate-800
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {isDetailsOpen ? "بستن جزئیات شغل" : "نمایش جزئیات شغل"}
          <ToggleChevron isOpen={isDetailsOpen} />
        </button>
      </footer>

      {isDetailsOpen && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-3 sm:px-4 pb-4">
          <JobDetails details={[match.detail]} className="pt-4" />
        </div>
      )}
    </article>
  );
}
