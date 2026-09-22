import { useState } from "react";
import AnswerPanel from "@components/AnswerPanel";
import JobDetails from "@components/JobDetails";
import Badge from "@components/ui/Badge";
import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import Loader, { Spinner } from "@components/ui/Loader";
import Pager from "@components/ui/Pager";
import { ConfirmDialog } from "@components/manage/Forms";
import { useSearchReportMutation } from "@services/jobsApi";
import {
  useDeleteSavedSearchMutation,
  useSavedSearchQuery,
  useSavedSearchesQuery,
} from "@services/savedApi";
import { downloadBlob } from "@utils/download";
import { errorMessage } from "@utils/errors";
import { faDate, faNumber } from "@utils/jalali";
import { reportBody, reportFileName } from "@utils/report";
import { showMessage } from "@utils/toast";
import { icon } from "@components/ui/icon";

const PAGE_SIZE = 10;

const glyph = (className, path) => icon(path, className);

const StarGlyph = glyph(
  "w-5 h-5",
  <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />,
);
const TrashGlyph = glyph("w-3.5 h-3.5", <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />);
const DownloadGlyph = glyph("w-3.5 h-3.5", <path d="M12 3v12M7 12l5 5 5-5M4 20h16" />);
const BackGlyph = glyph("w-3.5 h-3.5", <path d="M9 6l6 6-6 6" />);

const MODE_LABELS = {
  single: "شغل موجود در پایگاه داده",
  job_match: "شغل موجود در پایگاه داده",
  job_adapted: "شغل پیشنهادی",
  job_generated: "شغل پیشنهادی",
  interdisciplinary: "ترکیب دو شغل",
  needs_detail: "نیازمند توضیح دقیق‌تر",
  about: "راهنمای سامانه",
  out_of_domain: "خارج از دامنه",
};

function SavedView({ id, onBack, onRemove }) {
  const { data, isLoading, error } = useSavedSearchQuery(id);
  const [searchReport, { isLoading: isReporting }] = useSearchReportMutation();

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-600 m-0">{errorMessage(error)}</p>
      </Card>
    );
  }

  const { question, created_at: createdAt, result } = data;

  async function downloadReport() {
    try {
      const blob = await searchReport(reportBody(question, result)).unwrap();
      downloadBlob(blob, reportFileName(result));
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs text-slate-500">پرسش ستاره‌دار</span>
            <h2 className="text-lg font-bold text-slate-800 m-0 leading-8">{question}</h2>
            <p className="text-xs text-slate-400 m-0 leading-6 fa-nums">
              ستاره‌دار شده در {faDate(createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Button variant="outline" size="sm" buttonProps={{ onClick: onBack }}>
              {BackGlyph}
              بازگشت به فهرست
            </Button>
            <Button
              variant="outline"
              size="sm"
              buttonProps={{ onClick: downloadReport, disabled: isReporting }}
            >
              {isReporting ? <Spinner /> : DownloadGlyph}
              گزارش PDF
            </Button>
            <Button
              variant="danger-outline"
              size="sm"
              buttonProps={{ onClick: () => onRemove({ id, question }) }}
            >
              {TrashGlyph}
              حذف از ستاره‌دارها
            </Button>
          </div>
        </header>

        <AnswerPanel label="تحلیل هوشمند" text={result.answer} />

        {result.details?.length > 0 && (
          <JobDetails
            details={result.details}
            title={
              result.details.length > 1
                ? "اطلاعات این مشاغل"
                : `اطلاعات «${result.details[0].job_title}»`
            }
            className=""
          />
        )}
      </div>
    </Card>
  );
}

export default function SavedSearches() {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [removing, setRemoving] = useState(null);

  const { data, isLoading, isFetching } = useSavedSearchesQuery({ page, pageSize: PAGE_SIZE });
  const [deleteSavedSearch, { isLoading: isDeleting }] = useDeleteSavedSearchMutation();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  async function remove() {
    const row = removing;
    try {
      await deleteSavedSearch(row.id).unwrap();
      setRemoving(null);
      if (openId === row.id) setOpenId(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      showMessage.success("از تحلیل‌های ستاره‌دار حذف شد.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  return (
    <>
      {openId != null ? (
        <SavedView id={openId} onBack={() => setOpenId(null)} onRemove={setRemoving} />
      ) : (
        <Card
          title="تحلیل‌های ستاره‌دار"
          hint="تحلیل‌هایی که نگه داشته‌اید، همان‌گونه که هنگام ستاره‌دار کردن دیده‌اید. این فهرست تنها برای شماست."
          actions={<Badge tone={total ? "accent" : "neutral"}>{faNumber(total)} تحلیل</Badge>}
        >
          {isLoading ? (
            <Loader />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span
                aria-hidden="true"
                className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center"
              >
                {StarGlyph}
              </span>
              <p className="text-sm text-slate-600 m-0 leading-7 max-w-md">
                هنوز تحلیلی را ستاره‌دار نکرده‌اید. پس از هر تحلیل، با دکمه «ستاره‌دار کردن» آن را
                همین‌جا نگه دارید تا بعداً بدون تحلیل دوباره در دسترس باشد.
              </p>
            </div>
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity duration-150" : undefined}>
              <ul className="list-none m-0 p-0 flex flex-col">
                {items.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-start justify-between gap-4 flex-wrap py-3.5
                               border-t border-slate-200 first:border-t-0"
                  >
                    <div className="min-w-0 flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 border border-amber-200
                                   flex items-center justify-center shrink-0"
                      >
                        {StarGlyph}
                      </span>
                      <div className="min-w-0">
                        <strong className="block text-sm text-slate-800 leading-6">
                          {row.question}
                        </strong>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          {row.job_title && <Badge tone="accent">{row.job_title}</Badge>}
                          <span className="text-xs text-slate-400">
                            {MODE_LABELS[row.mode] ?? row.mode}
                          </span>
                          <span className="text-xs text-slate-400 fa-nums">
                            {faDate(row.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        buttonProps={{ onClick: () => setOpenId(row.id) }}
                      >
                        مشاهده تحلیل
                      </Button>
                      <Button
                        variant="danger-outline"
                        size="sm"
                        buttonProps={{ onClick: () => setRemoving(row) }}
                      >
                        {TrashGlyph}
                        حذف
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              <Pager
                page={data?.page ?? page}
                pageSize={data?.page_size ?? PAGE_SIZE}
                total={total}
                busy={isFetching}
                onPage={setPage}
              />
            </div>
          )}
        </Card>
      )}

      <ConfirmDialog
        open={removing !== null}
        title="حذف از تحلیل‌های ستاره‌دار"
        message={`آیا «${removing?.question ?? ""}» از فهرست ستاره‌دارها حذف شود؟ نتیجه ذخیره‌شده آن پاک می‌شود و برای دیدن دوباره باید تحلیل را از نو انجام دهید.`}
        busy={isDeleting}
        onClose={() => setRemoving(null)}
        onConfirm={remove}
      />
    </>
  );
}
