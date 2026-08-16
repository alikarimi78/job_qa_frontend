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

// The plain half of «جستجوی شغل»: one question, one answer about one job. The other
// half is `AdvancedSearch`, next to it under the switch on the page.

// Inline and `currentColor`, the same way `constant/menuItems.jsx` draws its icons —
// no icon assets came with the style files.
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
  single: "accent",
  job_match: "success",
  job_generated: "warning",
  interdisciplinary: "accent",
  out_of_domain: "danger",
};

export default function QuestionSearch() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  // The question this answer came from, kept apart from the input the user may already
  // be retyping — the report prints the pair, and they have to be the same pair.
  const [asked, setAsked] = useState("");
  const [declined, setDeclined] = useState(false);
  const [filed, setFiled] = useState(false);
  // Counts searches, so the draft form below remounts on each one: its fields are seeded
  // from the offer at mount, and a second proposal has to refill them.
  const [runId, setRunId] = useState(0);
  const [search, { isLoading }] = useSearchMutation();
  const [searchReport, { isLoading: isReporting }] = useSearchReportMutation();
  const [suggestJob, { isLoading: isFiling }] = useSuggestJobMutation();

  async function submit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setResult(null);
    setDeclined(false);
    setFiled(false);
    try {
      const data = await search(question).unwrap();
      setResult(data);
      setAsked(question.trim());
      setRunId((n) => n + 1);
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  // Sends the answer back to be printed, rather than asking for it to be produced
  // again: the PDF is meant to be exactly the page it was downloaded from.
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

  // A proposed record is filed from here, on the page it was proposed on. It used to be
  // stashed and carried to «پیشنهاد شغل» to be edited and submitted there, which made
  // reviewing an offer a two-page errand for no gain — the same ten-column form is on
  // this page now, already filled in, and this is the submit at the end of it.
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
  // related_jobs leads with the matched record itself; showing it twice reads as a bug
  const nearby = result?.related_jobs?.filter((t) => t !== result.job) ?? [];
  const detailsTitle =
    result?.details?.length > 1 ? "اطلاعات این مشاغل در پایگاه داده" : "اطلاعات این شغل در پایگاه داده";

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
            <span>
              {result.mode === "job_generated" ? (
                <Badge tone="warning">شغل پیشنهادی؛ ثبت نشده است</Badge>
              ) : result.mode === "out_of_domain" ? (
                <Badge tone="danger">خارج از دامنه</Badge>
              ) : result.mode === "interdisciplinary" ? (
                <Badge tone="accent">{result.jobs?.join(" + ")}</Badge>
              ) : (
                result.job && <Badge tone={MODE_BADGE[result.mode] ?? "accent"}>{result.job}</Badge>
              )}
            </span>
            <span className="flex items-center gap-3">
              {result.score != null && (
                <span className="text-xs text-slate-400">تطابق: {result.score.toFixed(2)}</span>
              )}
              {/* Nothing to file a report about when the question was not about a job */}
              {result.mode !== "out_of_domain" && (
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

          <p className="whitespace-pre-wrap text-[15px] leading-9 text-slate-800 m-0">
            {result.answer}
          </p>

          {/* A proposal's own columns are the editable form below, not a second read-only
              copy of the same values — so the boxes are for records that actually exist. */}
          {!offered && <JobDetails details={result.details} title={detailsTitle} />}

          {result.mode === "job_match" && nearby.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-4">
              <span className="text-xs text-slate-400">مشاغل مرتبط:</span>
              {nearby.map((title) => (
                <Badge key={title} tone="neutral">
                  {title}
                </Badge>
              ))}
            </div>
          )}

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

              {/* Keyed on the run so a second proposal refills the boxes: JobForm seeds
                  its defaults once, at mount. Declining sits in the form's own submit bar,
                  beside «ثبت پیشنهاد»: the two are the same decision answered either way,
                  and the person makes it after reading the record, not before. */}
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
                <Link to="/my-suggestions" className="font-semibold underline">
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
        </Card>
      )}
    </>
  );
}
