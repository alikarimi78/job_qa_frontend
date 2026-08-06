import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import { Spinner } from "@components/ui/Loader";
import JobDetails from "@components/JobDetails";
import { useSearchMutation, useSearchReportMutation } from "@services/jobsApi";
import { stashDraft } from "@utils/draft";
import { downloadBlob, safeFileName } from "@utils/download";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

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

export default function Search() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  // The question this answer came from, kept apart from the input the user may already
  // be retyping — the report prints the pair, and they have to be the same pair.
  const [asked, setAsked] = useState("");
  const [declined, setDeclined] = useState(false);
  // Counts searches so the detail boxes remount on each one: a box the user folded
  // open last time must not stay that way against a new answer's intent.
  const [runId, setRunId] = useState(0);
  const [search, { isLoading }] = useSearchMutation();
  const [searchReport, { isLoading: isReporting }] = useSearchReportMutation();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setResult(null);
    setDeclined(false);
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

  // Stash before navigating: the offer has to survive the hop to the form, and an
  // expired session in between sends the user through /login on the way.
  function accept() {
    stashDraft(result.job_draft);
    navigate("/suggest");
  }

  const offered = result?.mode === "job_generated" && result.job_draft;
  // related_jobs leads with the matched record itself; showing it twice reads as a bug
  const nearby = result?.related_jobs?.filter((t) => t !== result.job) ?? [];
  // A proposal's boxes describe a record that does not exist yet — say so, or they
  // read as a job the database already holds.
  const detailsTitle = offered
    ? "مشخصات شغل پیشنهادی (هنوز ثبت نشده است)"
    : result?.details?.length > 1
      ? "اطلاعات این مشاغل در پایگاه داده"
      : "اطلاعات این شغل در پایگاه داده";

  return (
    <>
      <Card className="text-center">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">درباره هر شغلی بپرسید</h1>
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
          می‌توانید شغل دلخواهتان را هم توصیف کنید؛ اگر در دیتاست نباشد، شغلی متناسب با آن پیشنهاد
          می‌شود.
        </p>
      </Card>

      {result && (
        <Card>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <span>
              {result.mode === "job_generated" ? (
                <Badge tone="warning">شغل پیشنهادی — هنوز ثبت نشده</Badge>
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

          <JobDetails key={runId} details={result.details} title={detailsTitle} />

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

          {offered && !declined && (
            <div className="flex items-center gap-2 flex-wrap mt-5 pt-4 border-t border-slate-200">
              <Button variant="primary" buttonProps={{ onClick: accept }}>
                بله، ثبتش می‌کنم
              </Button>
              <Button variant="outline" buttonProps={{ onClick: () => setDeclined(true) }}>
                نه، ممنون
              </Button>
            </div>
          )}

          {offered && declined && (
            <p className="text-xs text-slate-400 mt-5 pt-4 border-t border-slate-200">
              این پیشنهاد ثبت نشد. با پرسش تازه می‌توانید پیشنهاد دیگری بگیرید.
            </p>
          )}
        </Card>
      )}
    </>
  );
}
