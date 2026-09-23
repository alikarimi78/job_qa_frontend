/** Loads one starred analysis in full and offers its PDF report. */
import { useSavedSearchQuery } from "@services/savedApi";
import useReportDownload from "./useReportDownload";

export default function useSavedSearchView(id) {
  const { data: savedSearch, isLoading, error } = useSavedSearchQuery(id);
  const { downloadReport, isDownloading } = useReportDownload();

  return {
    savedSearch,
    isLoading,
    error,
    isDownloading,
    downloadReport: () => downloadReport(savedSearch.question, savedSearch.result),
  };
}
