/** Everything the question-search result card does, gathered from the smaller hooks: how the answer is described, starring, the PDF report, the nearest-job panel and the suggestion offer. */
import useToggle from "@hooks/useToggle";
import { describeSearchResult } from "../utils/describeSearchResult";
import useDraftSuggestion from "./useDraftSuggestion";
import useReportDownload from "./useReportDownload";
import useStarredSearch from "./useStarredSearch";

function ownerNameFor(organizationId, owners) {
  if (organizationId == null) return null;
  return (
    owners.find((organization) => organization.id === organizationId)?.name ??
    `سازمان شماره ${organizationId}`
  );
}

export default function useSearchResult(result, askedQuestion) {
  const view = describeSearchResult(result);
  const star = useStarredSearch(askedQuestion, result);
  const { downloadReport, isDownloading } = useReportDownload();
  const draft = useDraftSuggestion(view);
  const [isNearestOpen, toggleNearest] = useToggle(false);

  return {
    view,
    ownerName: ownerNameFor(view.ownerOrganizationId, draft.owners),
    star,
    report: { download: () => downloadReport(askedQuestion, result), isDownloading },
    draft,
    nearest: { isOpen: isNearestOpen, toggle: toggleNearest },
  };
}
