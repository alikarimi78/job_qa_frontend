import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Select from "@components/ui/Select";
import { Spinner } from "@components/ui/Loader";
import JobDetails from "@components/JobDetails";
import JobForm, { PUBLIC_OWNER } from "@components/JobForm";
import useSuggestionOwners from "@hook/useSuggestionOwners";
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

// `needs_detail` carries no record either: the question named a field, not a job.
const NO_REPORT = new Set(["out_of_domain", "about", "needs_detail"]);

// The modes whose record was composed rather than found — typed as a name or asked as a
// question, it is the same kind of record, and it is shown and offered the same way.
const COMPOSED = new Set(["job_generated", "job_adapted"]);

// Why a combination came back with no job to offer, keyed on its `draft_reason`.
const DRAFT_REASONS = {
  exists: ({ draft_job }) =>
    `شغلی با عنوان «${draft_job}» که این ترکیب را پوشش می‌دهد در پایگاه داده موجود است؛ برای مشاهده مشخصات آن، همین عنوان را جست‌وجو نمایید.`,
  not_a_job: () =>
    "ترکیب این دو حوزه به شغل مشخصی اشاره ندارد، بنابراین شغلی برای پیشنهاد ایجاد نشد.",
  too_vague: () =>
    "پرسش شما دو حوزه را نام می‌برد، نه یک شغل مشخص؛ برای ثبت پیشنهاد، عنوان شغل ترکیبی مورد نظر را جست‌وجو نمایید، برای نمونه «مهندس رباتیک جراحی».",
  unavailable: () => "امکان ایجاد شغل ترکیبی پیشنهادی در حال حاضر فراهم نیست.",
};

function Notice({ title, children }) {
  return (
    <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
      <strong className="text-sm text-amber-900">{title}</strong>
      <p className="text-xs text-amber-800 mt-1 leading-6">{children}</p>
    </div>
  );
}

export default function QuestionSearch() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [asked, setAsked] = useState("");
  const [declined, setDeclined] = useState(false);
  const [filed, setFiled] = useState(false);
  const [editing, setEditing] = useState(false);
  const [owner, setOwner] = useState(PUBLIC_OWNER);
  const [runId, setRunId] = useState(0);
  const [openNearest, setOpenNearest] = useState(false);
  const [search, { isLoading }] = useSearchMutation();
  const [searchReport, { isLoading: isReporting }] = useSearchReportMutation();
  const [suggestJob, { isLoading: isFiling }] = useSuggestJobMutation();
  // The owner choice the suggestion page offers, so a job composed here can be filed for the
  // caller's own organization too; without it this page could only ever file public records.
  const { owners, allowPublic } = useSuggestionOwners();

  async function runSearch(text) {
    const asking = text.trim();
    if (!asking) return;
    setResult(null);
    setDeclined(false);
    setFiled(false);
    setEditing(false);
    setOwner(PUBLIC_OWNER);
    setOpenNearest(false);
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
      setEditing(false);
      showMessage.success("پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  const mode = result?.mode;
  const composed = COMPOSED.has(mode);
  const combination = mode === "interdisciplinary";
  // The job this search offers for filing, and the boxes that show it: a composed record is
  // itself the answer's boxes, while a combination composes one beside its two stored records.
  // Every offer is then shown the same way — boxes, and «پذیرش» / «رد» / «ویرایش» under them.
  const draft = result?.job_draft ?? null;
  const draftDetail = composed ? result?.details?.[0] : result?.draft_detail;
  const offered = Boolean(draft && draftDetail);
  const nearest = result?.nearest ?? null;
  const subject = result?.details?.[0]?.job_title ?? result?.job;
  const detailsTitle =
    result?.details?.length > 1
      ? "اطلاعات این مشاغل"
      : composed
        ? `مشخصات تدوین‌شده «${subject}»`
        : subject
          ? `اطلاعات «${subject}»`
          : "اطلاعات این شغل";

  // «پذیرش» files the record exactly as shown. The owner is the one thing a suggestion adds to
  // it, chosen beside the buttons when there is a choice at all — the rule JobForm follows.
  function accept() {
    const body = { ...draft };
    if (owners.length) body.organization_id = owner === PUBLIC_OWNER ? null : Number(owner);
    fileSuggestion(body);
  }

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
              {mode === "out_of_domain" ? (
                <Badge tone="danger">خارج از دامنه</Badge>
              ) : mode === "needs_detail" ? (
                <Badge tone="warning">نیازمند توضیح دقیق‌تر</Badge>
              ) : mode === "about" ? (
                <Badge tone="neutral">راهنمای سامانه</Badge>
              ) : combination ? (
                <Badge tone="accent">{result.jobs?.join(" + ")}</Badge>
              ) : (
                // The job the question was about — the one the engine resolved it to, not the
                // question itself and not the nearest record it was ranked against. A title can
                // be long enough to need two lines.
                result.job && (
                  <Badge tone={MODE_BADGE[mode] ?? "accent"} wrap className="max-w-full">
                    {result.job}
                  </Badge>
                )
              )}
            </span>
            <span className="flex items-center gap-3">
              {result.score != null && (
                <span className="text-xs text-slate-400">تطابق: {result.score.toFixed(2)}</span>
              )}
              {!NO_REPORT.has(mode) && (
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
            <Notice title="این شغل در پایگاه داده ثبت نشده است">
              مشخصات زیر بر اساس ورودی شما و نزدیک‌ترین رکورد پایگاه داده تدوین شده است و تا پیش
              از تایید مدیر سامانه، بخشی از پایگاه داده به شمار نمی‌رود.
            </Notice>
          )}

          <p className="whitespace-pre-wrap text-[15px] leading-9 text-slate-800 m-0">
            {result.answer}
          </p>

          {!(composed && editing) && <JobDetails details={result.details} title={detailsTitle} />}

          {combination && (offered || result.draft_reason) && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <Notice
                title={offered ? "شغل ترکیبی پیشنهادی" : "شغل ترکیبی برای پیشنهاد ایجاد نشد"}
              >
                {offered
                  ? "مشخصات زیر بر اساس پرسش شما و دو رکورد بالا تدوین شده است و تا پیش از تایید مدیر سامانه، بخشی از پایگاه داده به شمار نمی‌رود."
                  : (DRAFT_REASONS[result.draft_reason] ?? DRAFT_REASONS.unavailable)(result)}
              </Notice>
              {offered && !editing && (
                <JobDetails
                  details={[draftDetail]}
                  title={`مشخصات تدوین‌شده «${draftDetail.job_title}»`}
                />
              )}
            </div>
          )}

          {offered && !filed && !declined && editing && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <JobForm
                key={`${runId}-edit`}
                initial={draft}
                onSubmit={fileSuggestion}
                submitLabel="ثبت پیشنهاد"
                busy={isFiling}
                owners={owners}
                allowPublic={allowPublic}
                actions={
                  <Button
                    variant="outline"
                    size="lg"
                    buttonProps={{
                      type: "button",
                      onClick: () => setEditing(false),
                      disabled: isFiling,
                    }}
                  >
                    انصراف
                  </Button>
                }
              />
            </div>
          )}

          {offered && !filed && !declined && !editing && (
            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-slate-600 leading-7 m-0">
                آیا این شغل به‌عنوان پیشنهاد ثبت شود؟ ثبت نهایی پس از تایید مدیر سامانه انجام
                می‌شود.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {owners.length > 0 && (
                  <Select
                    value={owner}
                    onChange={(event) => setOwner(event.target.value)}
                    className="min-w-44"
                    selectProps={{ "aria-label": "دامنه شغل", disabled: isFiling }}
                  >
                    {allowPublic && <option value={PUBLIC_OWNER}>عمومی — همه سازمان‌ها</option>}
                    {owners.map((organization) => (
                      <option key={organization.id} value={String(organization.id)}>
                        اختصاصی — {organization.name}
                      </option>
                    ))}
                  </Select>
                )}
                <Button
                  variant="success"
                  size="sm"
                  buttonProps={{ type: "button", onClick: accept, disabled: isFiling }}
                >
                  {isFiling ? <Spinner /> : "پذیرش"}
                </Button>
                <Button
                  variant="danger-outline"
                  size="sm"
                  buttonProps={{ type: "button", onClick: () => setDeclined(true), disabled: isFiling }}
                >
                  رد
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  buttonProps={{ type: "button", onClick: () => setEditing(true), disabled: isFiling }}
                >
                  ویرایش
                </Button>
              </div>
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

          {nearest && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-6 m-0">نزدیک‌ترین شغل موجود در پایگاه داده</p>
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <button
                  type="button"
                  onClick={() => setOpenNearest((was) => !was)}
                  aria-expanded={openNearest}
                  title={`نمایش اطلاعات «${nearest.job_title}»`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                             border bg-slate-100 text-slate-600 border-slate-200
                             transition-colors duration-200 cursor-pointer
                             hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  {nearest.job_title}
                  <svg
                    className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                      openNearest ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>

              {openNearest && (
                <JobDetails details={[nearest]} title={`اطلاعات «${nearest.job_title}»`} />
              )}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
