/** One starred analysis opened in full: the question, when it was starred, the answer and job boxes, with back, PDF and un-star buttons. */
import { ChevronRightIcon, DownloadIcon, TrashIcon } from "@components/icons";
import JobDetails from "@components/job/JobDetails/JobDetails";
import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import Spinner from "@components/ui/Spinner";
import { errorMessage } from "@utils/errors";
import { faDate } from "@utils/jalali";
import useSavedSearchView from "../../hooks/useSavedSearchView";
import AnswerPanel from "../AnswerPanel";

const BUTTON_ICON_CLASS = "w-3.5 h-3.5";

const detailsTitleFor = (details) =>
  details.length > 1 ? "اطلاعات این مشاغل" : `اطلاعات «${details[0].job_title}»`;

export default function SavedSearchView({ id, onBack, onRemove }) {
  const { savedSearch, isLoading, error, isDownloading, downloadReport } = useSavedSearchView(id);

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-600 m-0">{errorMessage(error)}</p>
      </Card>
    );
  }

  const { question, created_at: starredAt, result } = savedSearch;

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs text-slate-500">پرسش ستاره‌دار</span>
            <h2 className="text-lg font-bold text-slate-800 m-0 leading-8">{question}</h2>
            <p className="text-xs text-slate-400 m-0 leading-6 fa-nums">
              ستاره‌دار شده در {faDate(starredAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ChevronRightIcon className={BUTTON_ICON_CLASS} />
              بازگشت به فهرست
            </Button>
            <Button variant="outline" size="sm" onClick={downloadReport} disabled={isDownloading}>
              {isDownloading ? <Spinner /> : <DownloadIcon className={BUTTON_ICON_CLASS} />}
              گزارش PDF
            </Button>
            <Button variant="danger-outline" size="sm" onClick={() => onRemove({ id, question })}>
              <TrashIcon className={BUTTON_ICON_CLASS} />
              حذف از ستاره‌دارها
            </Button>
          </div>
        </header>

        <AnswerPanel label="تحلیل هوشمند" text={result.answer} />

        {result.details?.length > 0 && (
          <JobDetails details={result.details} title={detailsTitleFor(result.details)} className="" />
        )}
      </div>
    </Card>
  );
}
