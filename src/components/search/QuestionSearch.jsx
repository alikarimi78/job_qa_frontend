import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import { Spinner } from "@components/ui/Loader";
import JobDetails from "@components/JobDetails";
import JobForm from "@components/JobForm";
import { useSearchMutation, useSearchReportMutation, useSuggestJobMutation } from "@services/jobsApi";
import { downloadBlob, safeFileName } from "@utils/download";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";


const DownloadIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v12M7 12l5 5 5-5M4 20h16" />
  </svg>
);

const MODE_BADGE = {
  job_match: "success",
  job_generated: "warning",
  job_adapted: "warning",
  interdisciplinary: "accent",
  out_of_domain: "danger",
};

const NO_REPORT = new Set(["out_of_domain", "about"]);

export default function QuestionSearch() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [asked, setAsked] = useState("");
  const [declined, setDeclined] = useState(false);
  const [filed, setFiled] = useState(false);
  const [runId, setRunId] = useState(0);
  const [search, { isLoading }] = useSearchMutation();
  const [searchReport, { isLoading: isReporting }] = useSearchReportMutation();
  const [suggestJob, { isLoading: isFiling }] = useSuggestJobMutation();

  async function runSearch(text) {
    const asking = text.trim();
    if (!asking) return;
    setResult(null);
    setDeclined(false);
    setFiled(false);
    try {
      const data = await search(asking).unwrap();
      setResult(data);
      setAsked(asking);
      setRunId((n) => n + 1);
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  function submit(e) {
    e.preventDefault();
    runSearch(question);
  }

  function askRelated(title) {
    setQuestion(title);
    window.scrollTo({ top: 0, behavior: "smooth" });
    runSearch(title);
  }

  async function downloadReport() {
    try {
      const blob = await searchReport({
        question: asked,
        mode: result.mode,
        answer: result.answer,
        job: result.job ?? null,
        jobs: result.jobs ?? null,
        details: result.details ?? [],
        related_jobs: result.related_jobs ?? null,
      }).unwrap();
      const subject = result.job ?? result.jobs?.join(" و ") ?? result.details?.[0]?.job_title;
      downloadBlob(blob, `${safeFileName(`گزارش ${subject ?? ""}`, "گزارش تحلیل شغل")}.pdf`);
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  async function fileSuggestion(body) {
    try {
      await suggestJob(body).unwrap();
      setFiled(true);
      showMessage.success("پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  const offered = result?.mode === "job_generated" && result.job_draft;
  // The engine resolves a question to the job it is about before answering it, so the
  // record under a `job_adapted` answer describes that job and is *not* in the database —
  // it was composed from the question and the nearest records. Every other mode's boxes
  // are the stored record, and the heading names it rather than saying «این شغل» and
  // leaving the reader to guess which of the two it means.
  const composed = result?.mode === "job_adapted";
  const nearby = result?.related_jobs ?? [];
  const subject = result?.details?.[0]?.job_title ?? result?.job;
  const detailsTitle =
    result?.details?.length > 1
      ? "اطلاعات این مشاغل در پایگاه داده"
      : composed
        ? `مشخصات تدوین‌شده «${subject}»`
        : subject
          ? `اطلاعات «${subject}» در پایگاه داده`
          : "اطلاعات این شغل در پایگاه داده";

  return (
    <>
      <Card className="text-center">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">
          پرسش درباره مشاغل
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          وظایف، مهارت‌ها، ابزارها، محیط کاری و مسیر ارتقای بیش از ۱۰۰۰ شغل
        </p>

        <form onSubmit={submit} className="flex gap-2 max-w-xl mx-auto mt-5">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="مثلاً: وظایف افسر توپخانه چیست؟"
            maxLength={500}
            className="flex-1 h-11 px-4 rounded-xl bg-white text-sm text-slate-800
                       border border-slate-200 outline-none transition-all duration-200
                       placeholder:text-slate-400
                       hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          <Button variant="primary" size="lg" buttonProps={{ type: "submit", disabled: isLoading }}>
            {isLoading ? <Spinner /> : "جستجو"}
          </Button>
        </form>

        <p className="text-xs text-slate-400 mt-4 leading-6">
          می‌توانید شغل مورد نظر خود را نیز توصیف کنید؛ چنانچه در پایگاه داده موجود نباشد، شغلی
          متناسب با آن پیشنهاد می‌شود و امکان ویرایش و ثبت آن در همین صفحه فراهم است.
        </p>
      </Card>

      {result && (
        <Card>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <span className="min-w-0">
              {result.mode === "job_generated" ? (
                <Badge tone="warning">شغل پیشنهادی؛ ثبت نشده است</Badge>
              ) : result.mode === "out_of_domain" ? (
                <Badge tone="danger">خارج از دامنه</Badge>
              ) : result.mode === "about" ? (
                <Badge tone="neutral">راهنمای سامانه</Badge>
              ) : result.mode === "interdisciplinary" ? (
                <Badge tone="accent">{result.jobs?.join(" + ")}</Badge>
              ) : (
                // The job the question was about — the one the engine resolved it to,
                // not the question itself and not the nearest record it was ranked
                // against. A title can be long enough to need two lines.
                result.job && (
                  <Badge tone={MODE_BADGE[result.mode] ?? "accent"} wrap className="max-w-full">
                    {result.job}
                  </Badge>
                )
              )}
            </span>
            <span className="flex items-center gap-3">
              {result.score != null && (
                <span className="text-xs text-slate-400">تطابق: {result.score.toFixed(2)}</span>
              )}
              {!NO_REPORT.has(result.mode) && (
                <Button
                  variant="outline"
                  size="sm"
                  buttonProps={{ onClick: downloadReport, disabled: isReporting }}
                >
                  {isReporting ? <Spinner /> : <DownloadIcon />}
                  گزارش PDF
                </Button>
              )}
            </span>
          </div>

          {composed && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
              <strong className="text-sm text-amber-900">
                این شغل در پایگاه داده ثبت نشده است
              </strong>
              <p className="text-xs text-amber-800 mt-1 leading-6">
                مشخصات زیر بر اساس پرسش شما و نزدیک‌ترین رکوردهای پایگاه داده تدوین شده است و
                بخشی از پایگاه داده به شمار نمی‌رود.
              </p>
            </div>
          )}

          <p className="whitespace-pre-wrap text-[15px] leading-9 text-slate-800 m-0">
            {result.answer}
          </p>

          {!offered && <JobDetails details={result.details} title={detailsTitle} />}

          {offered && !declined && !filed && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                <strong className="text-sm text-amber-900">
                  این شغل در پایگاه داده موجود نیست
                </strong>
                <p className="text-xs text-amber-800 mt-1 leading-6">
                  مشخصات پیشنهادی زیر را بررسی و در صورت نیاز ویرایش نمایید؛ پس از ثبت، جهت بررسی
                  و تایید به مدیر سامانه ارسال می‌شود.
                </p>
              </div>

              <JobForm
                key={runId}
                initial={result.job_draft}
                onSubmit={fileSuggestion}
                submitLabel="ثبت پیشنهاد"
                busy={isFiling}
                actions={
                  <Button
                    variant="danger-outline"
                    size="lg"
                    buttonProps={{
                      type: "button",
                      onClick: () => setDeclined(true),
                      disabled: isFiling,
                    }}
                  >
                    رد پیشنهاد
                  </Button>
                }
              />
            </div>
          )}

          {offered && filed && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 leading-7">
                پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است. وضعیت آن از بخش{" "}
                <Link to="/suggestions?tab=mine" className="font-semibold underline">
                  پیشنهادهای من
                </Link>{" "}
                قابل پیگیری است.
              </div>
            </div>
          )}

          {offered && declined && (
            <p className="text-xs text-slate-400 mt-5 pt-4 border-t border-slate-200">
              این پیشنهاد رد شد و ثبت نگردید. در صورت نیاز می‌توانید با طرح پرسشی جدید، پیشنهاد
              دیگری دریافت نمایید.
            </p>
          )}

          {nearby.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-6 m-0">
                نزدیک‌ترین مشاغل موجود در پایگاه داده
                {offered && "؛ شغل پیشنهادی بالا از هیچ‌یک از آن‌ها برداشته نشده است"}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-3">
                {nearby.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => askRelated(title)}
                    disabled={isLoading}
                    title={`جست‌وجوی «${title}»`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                               border bg-slate-100 text-slate-600 border-slate-200
                               transition-colors duration-200 cursor-pointer
                               hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200
                               focus:outline-none focus:ring-2 focus:ring-blue-500/30
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
