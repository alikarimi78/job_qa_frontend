/** Requests the PDF report of a search answer and saves it with a file name built from the job's title. */
import { useSearchReportMutation } from "@services/jobsApi";
import { downloadBlob } from "@utils/download";
import { errorMessage } from "@utils/errors";
import { reportBody, reportFileName } from "@utils/report";
import { showMessage } from "@utils/toast";

export default function useReportDownload() {
  const [searchReport, { isLoading: isDownloading }] = useSearchReportMutation();

  const downloadReport = async (question, result) => {
    try {
      const pdf = await searchReport(reportBody(question, result)).unwrap();
      downloadBlob(pdf, reportFileName(result));
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  return { downloadReport, isDownloading };
}
