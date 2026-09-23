/** Buttons beside an answer's title: star (keep it in the starred list) and download the PDF report. */
import { DownloadIcon, StarIcon } from "@components/icons";
import Button from "@components/ui/Button";
import Spinner from "@components/ui/Spinner";

const ACTION_ICON_CLASS = "w-3.5 h-3.5";

export default function ResultActions({ star, report }) {
  return (
    <>
      <Button
        variant={star.isStarred ? "primary" : "outline"}
        size="sm"
        onClick={star.toggleStar}
        disabled={star.isBusy}
        title={
          star.isStarred ? "حذف از تحلیل‌های ستاره‌دار" : "نگه‌داشتن این تحلیل در تحلیل‌های ستاره‌دار"
        }
      >
        {star.isBusy ? <Spinner /> : <StarIcon className={ACTION_ICON_CLASS} />}
        {star.isStarred ? "ستاره‌دار شد" : "ستاره‌دار کردن"}
      </Button>
      <Button variant="outline" size="sm" onClick={report.download} disabled={report.isDownloading}>
        {report.isDownloading ? <Spinner /> : <DownloadIcon className={ACTION_ICON_CLASS} />}
        گزارش PDF
      </Button>
    </>
  );
}
