import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import { Spinner } from "@components/ui/Loader";
import AnswerPanel from "@components/AnswerPanel";
import JobDetails from "@components/JobDetails";
import JobForm, { PUBLIC_OWNER } from "@components/JobForm";
import { cellFromItems, itemsFromCell } from "@components/ui/ItemsInput";
import useSuggestionOwners from "@hook/useSuggestionOwners";
import { useSearchMutation, useSearchReportMutation, useSuggestJobMutation } from "@services/jobsApi";
import { useDeleteSavedSearchMutation, useSaveSearchMutation } from "@services/savedApi";
import { downloadBlob } from "@utils/download";
import { reportBody, reportFileName } from "@utils/report";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";
import { icon } from "@components/ui/icon";

const glyph = (className, path) => icon(path, className);

const Glyphs = {
  download: glyph("w-3.5 h-3.5", <path d="M12 3v12M7 12l5 5 5-5M4 20h16" />),
  star: glyph(
    "w-3.5 h-3.5",
    <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />,
  ),
  briefcase: glyph(
    "w-6 h-6",
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
    </>,
  ),
  merge: glyph(
    "w-6 h-6",
    <>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 009 9" />
    </>,
  ),
  ban: glyph(
    "w-6 h-6",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.7 5.7l12.6 12.6" />
    </>,
  ),
  help: glyph(
    "w-6 h-6",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01" />
    </>,
  ),
  info: glyph(
    "w-6 h-6",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </>,
  ),
  infoSmall: glyph(
    "w-4 h-4",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </>,
  ),
  globe: glyph(
    "w-3.5 h-3.5 shrink-0",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </>,
  ),
  building: glyph(
    "w-3.5 h-3.5 shrink-0",
    <>
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
      <path d="M19 21V11a2 2 0 00-2-2h-2" />
      <path d="M9 7h2M9 11h2M9 15h2" />
    </>,
  ),
  compass: glyph(
    "w-5 h-5",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>,
  ),
  databasePlus: glyph(
    "w-5 h-5",
    <>
      <ellipse cx="11" cy="5" rx="7" ry="3" />
      <path d="M4 5v6c0 1.7 3.1 3 7 3M18 5v4M4 11v6c0 1.7 3.1 3 7 3" />
      <path d="M18 14v6M15 17h6" />
    </>,
  ),
  check: glyph(
    "w-5 h-5",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </>,
  ),
  cross: glyph(
    "w-4 h-4",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </>,
  ),
};

const Chevron = ({ open }) =>
  glyph(
    `w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`,
    <path d="M6 9l6 6 6-6" />,
  );

const BRAND = "from-blue-600 to-indigo-600 shadow-indigo-600/25";
const JOB_META = { eyebrow: "نتیجه تحلیل", icon: Glyphs.briefcase, tone: BRAND };
const MODE_META = {
  out_of_domain: {
    eyebrow: "نتیجه تحلیل",
    title: "خارج از دامنه",
    icon: Glyphs.ban,
    tone: "from-rose-500 to-red-600 shadow-red-600/25",
  },
  needs_detail: {
    eyebrow: "نتیجه تحلیل",
    title: "نیازمند توضیح دقیق‌تر",
    icon: Glyphs.help,
    tone: "from-amber-400 to-amber-600 shadow-amber-600/25",
  },
  about: {
    eyebrow: "دستیار تحلیل مشاغل",
    title: "راهنمای سامانه",
    icon: Glyphs.info,
    tone: "from-slate-500 to-slate-700 shadow-slate-600/25",
  },
  interdisciplinary: { eyebrow: "تحلیل ترکیبی دو شغل", icon: Glyphs.merge, tone: BRAND },
  job_generated: { eyebrow: "شغل پیشنهادی", icon: Glyphs.briefcase, tone: BRAND },
  job_adapted: { eyebrow: "شغل پیشنهادی", icon: Glyphs.briefcase, tone: BRAND },
};

const NO_REPORT = new Set(["out_of_domain", "about", "needs_detail"]);

const COMPOSED = new Set(["job_generated", "job_adapted"]);

const DRAFT_REASONS = {
  exists: ({ draft_job }) =>
    `شغلی با عنوان «${draft_job}» که این ترکیب را پوشش می‌دهد در پایگاه داده موجود است؛ برای مشاهده مشخصات آن، همین عنوان را تحلیل نمایید.`,
  not_a_job: () =>
    "ترکیب این دو حوزه به شغل مشخصی اشاره ندارد، بنابراین شغلی برای پیشنهاد ایجاد نشد.",
  too_vague: () =>
    "پرسش شما دو حوزه را نام می‌برد، نه یک شغل مشخص؛ برای ثبت پیشنهاد، عنوان شغل ترکیبی مورد نظر را برای تحلیل وارد نمایید، برای نمونه «مهندس رباتیک جراحی».",
  unavailable: () => "امکان ایجاد شغل ترکیبی پیشنهادی در حال حاضر فراهم نیست.",
};

const COMPOSED_NOTICE = {
  title: "این شغل در پایگاه داده موجود نیست",
  body: "مشخصات زیر بر اساس ورودی شما و نزدیک‌ترین رکورد موجود در پایگاه داده تدوین شده است.",
};

function Notice({ title, children }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-amber-200/80 bg-gradient-to-l from-amber-50 to-orange-50/40">
      <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        {Glyphs.infoSmall}
      </span>
      <div className="min-w-0">
        <strong className="block text-sm text-amber-900 leading-6">{title}</strong>
        <p className="text-xs text-amber-800/90 mt-0.5 mb-0 leading-6">{children}</p>
      </div>
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
  const [owner, setOwner] = useState(null);
  const [choosing, setChoosing] = useState(false);
  const [seed, setSeed] = useState(null);
  const [runId, setRunId] = useState(0);
  const [openNearest, setOpenNearest] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [search, { isLoading }] = useSearchMutation();
  const [searchReport, { isLoading: isReporting }] = useSearchReportMutation();
  const [suggestJob, { isLoading: isFiling }] = useSuggestJobMutation();
  const [saveSearch, { isLoading: isStarring }] = useSaveSearchMutation();
  const [deleteSavedSearch, { isLoading: isUnstarring }] = useDeleteSavedSearchMutation();
  const { owners, defaultOwner, loading: ownersLoading } = useSuggestionOwners();
  const chosenOwner = owner ?? (defaultOwner == null ? PUBLIC_OWNER : String(defaultOwner));

  async function runSearch(text) {
    const asking = text.trim();
    if (!asking) return;
    setResult(null);
    setDeclined(false);
    setFiled(false);
    setEditing(false);
    setOwner(null);
    setChoosing(false);
    setSeed(null);
    setOpenNearest(false);
    setSavedId(null);
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
      const blob = await searchReport(reportBody(asked, result)).unwrap();
      downloadBlob(blob, reportFileName(result));
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  async function toggleStar() {
    try {
      if (savedId != null) {
        await deleteSavedSearch(savedId).unwrap();
        setSavedId(null);
        showMessage.info("از تحلیل‌های ستاره‌دار حذف شد.");
        return;
      }
      const row = await saveSearch({ question: asked, result }).unwrap();
      setSavedId(row.id);
      showMessage.success("در تحلیل‌های ستاره‌دار ذخیره شد.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  async function fileSuggestion(body) {
    try {
      await suggestJob(body).unwrap();
      setFiled(true);
      setEditing(false);
      setChoosing(false);
      showMessage.success("پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است.");
    } catch (err) {
      showMessage.error(errorMessage(err));
    }
  }

  const mode = result?.mode;
  const composed = COMPOSED.has(mode);
  const combination = mode === "interdisciplinary";
  const draft = result?.job_draft ?? null;
  const draftDetail = composed ? result?.details?.[0] : result?.draft_detail;
  const offered = Boolean(draft && draftDetail);
  const pickable = offered && !filed && !declined;

  function pickAlias(alias) {
    const aliases = itemsFromCell(draft.aliases ?? "").map((name) =>
      name === alias ? draft.job_title : name,
    );
    setSeed({ ...draft, job_title: alias, aliases: cellFromItems(aliases) });
    setEditing(true);
  }
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

  const meta = MODE_META[mode] ?? JOB_META;
  const heading = meta.title ?? (combination ? result?.jobs?.join(" + ") : result?.job);
  const answerLabel = NO_REPORT.has(mode) ? "پاسخ دستیار" : "تحلیل هوشمند";

  const ownerChoices = [
    {
      value: PUBLIC_OWNER,
      title: "عمومی — همه سازمان‌ها",
      hint: "این شغل در نتایج تحلیل کاربران تمامی سازمان‌ها دیده می‌شود.",
      icon: Glyphs.globe,
    },
    ...owners.map((organization) => ({
      value: String(organization.id),
      title: `اختصاصی — ${organization.name}`,
      hint: "این شغل تنها در نتایج تحلیل کاربران همین سازمان دیده می‌شود.",
      icon: Glyphs.building,
    })),
  ];
  const ownerBody = chosenOwner === PUBLIC_OWNER ? null : Number(chosenOwner);

  const stored = mode === "single" || mode === "job_match";
  const ownerId = result?.organization_id ?? null;
  const ownerName =
    ownerId == null
      ? null
      : (owners.find((organization) => organization.id === ownerId)?.name ??
        `سازمان شماره ${ownerId}`);

  function accept() {
    const body = { ...draft };
    if (owners.length) body.organization_id = ownerBody;
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

        <form onSubmit={submit} className="flex gap-2 max-w-2xl mx-auto mt-5">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="مثلاً: یک حسابدار برای ورود به حوزه تحلیل داده به چه مهارت‌هایی نیاز دارد؟"
            maxLength={500}
            className="flex-1 h-11 px-4 rounded-xl bg-white text-sm text-slate-800
                       border border-slate-200 outline-none transition-all duration-200
                       placeholder:text-slate-400
                       hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          <Button variant="primary" size="lg" buttonProps={{ type: "submit", disabled: isLoading }}>
            {isLoading ? <Spinner /> : "تحلیل مبتنی بر AI"}
          </Button>
        </form>

        <p className="text-xs text-slate-400 mt-4 leading-6">
          می‌توانید شغل مورد نظر خود را نیز توصیف کنید؛ چنانچه در پایگاه داده موجود نباشد، شغلی
          متناسب با آن پیشنهاد می‌شود و امکان ویرایش و ثبت آن در همین صفحه فراهم است.
        </p>
      </Card>

      {result && (
        <Card>
          <div className="flex flex-col gap-6">
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <span
                  aria-hidden="true"
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.tone} text-white shadow-lg
                              flex items-center justify-center shrink-0`}
                >
                  {meta.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500 m-0 leading-5">{meta.eyebrow}</p>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 m-0 leading-8 break-words">
                    {heading}
                  </h2>
                  {stored && (
                    <div className="flex items-center gap-x-2 gap-y-1 flex-wrap mt-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5
                                    text-xs font-medium leading-5 ${
                                      ownerId == null
                                        ? "bg-slate-50 border-slate-200 text-slate-600"
                                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                                    }`}
                      >
                        {ownerId == null ? Glyphs.globe : Glyphs.building}
                        {ownerId == null ? "شغل عمومی" : `شغل سازمانی - ${ownerName}`}
                      </span>
                      <span className="text-xs text-slate-500 leading-6">
                        {ownerId == null
                          ? "این شغل در نتایج تحلیل تمامی سازمان‌ها دیده می‌شود."
                          : "این شغل تنها در نتایج تحلیل کاربران همین سازمان دیده می‌شود."}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0">
                {!NO_REPORT.has(mode) && (
                  <>
                    <Button
                      variant={savedId != null ? "primary" : "outline"}
                      size="sm"
                      buttonProps={{
                        onClick: toggleStar,
                        disabled: isStarring || isUnstarring,
                        title:
                          savedId != null
                            ? "حذف از تحلیل‌های ستاره‌دار"
                            : "نگه‌داشتن این تحلیل در تحلیل‌های ستاره‌دار",
                      }}
                    >
                      {isStarring || isUnstarring ? <Spinner /> : Glyphs.star}
                      {savedId != null ? "ستاره‌دار شد" : "ستاره‌دار کردن"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      buttonProps={{ onClick: downloadReport, disabled: isReporting }}
                    >
                      {isReporting ? <Spinner /> : Glyphs.download}
                      گزارش PDF
                    </Button>
                  </>
                )}
              </div>
            </header>

            {composed && !editing && <Notice title={COMPOSED_NOTICE.title}>{COMPOSED_NOTICE.body}</Notice>}

            <AnswerPanel label={answerLabel} text={result.answer} />

            {!(composed && editing) && (
              <JobDetails
                details={result.details}
                title={detailsTitle}
                onPickAlias={composed && pickable ? pickAlias : undefined}
                className=""
              />
            )}

            {combination && (offered || result.draft_reason) && !(offered && editing) && (
              <div className="flex flex-col gap-4">
                <Notice
                  title={offered ? COMPOSED_NOTICE.title : "شغل ترکیبی برای پیشنهاد ایجاد نشد"}
                >
                  {offered
                    ? COMPOSED_NOTICE.body
                    : (DRAFT_REASONS[result.draft_reason] ?? DRAFT_REASONS.unavailable)(result)}
                </Notice>
                {offered && (
                  <JobDetails
                    details={[draftDetail]}
                    title={`مشخصات تدوین‌شده «${draftDetail.job_title}»`}
                    onPickAlias={pickable ? pickAlias : undefined}
                    className=""
                  />
                )}
              </div>
            )}

            {offered && !filed && !declined && editing && (
              <section>
                <JobForm
                  key={`${runId}-edit`}
                  initial={{ ...(seed ?? draft), organization_id: ownerBody }}
                  primary={draftDetail.fields.filter((field) => field.primary).map((field) => field.key)}
                  onSubmit={fileSuggestion}
                  submitLabel="ثبت پیشنهاد"
                  busy={isFiling}
                  owners={owners}
                  actions={
                    <Button
                      variant="outline"
                      size="lg"
                      buttonProps={{
                        type: "button",
                        onClick: () => { setEditing(false); setSeed(null); },
                        disabled: isFiling,
                      }}
                    >
                      انصراف
                    </Button>
                  }
                />
              </section>
            )}

            {offered && !filed && !declined && !editing && (
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-l from-indigo-50/80 via-white to-white p-4 md:p-5 flex items-center gap-4 flex-wrap">
                <span
                  aria-hidden="true"
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                             shadow-md shadow-indigo-600/25 flex items-center justify-center shrink-0"
                >
                  {Glyphs.databasePlus}
                </span>
                <p className="flex-1 min-w-[14rem] text-sm text-slate-700 leading-7 m-0">
                  با توجه به اینکه شغل تحلیل‌شده در پایگاه داده سامانه نیست، آیا تمایل به اضافه کردن آن به
                  پایگاه داده را دارید؟
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="success"
                    size="md"
                    buttonProps={{
                      type: "button",
                      onClick: () => setChoosing(true),
                      disabled: isFiling || ownersLoading,
                    }}
                  >
                    پذیرش
                  </Button>
                  <Button
                    variant="danger-outline"
                    size="md"
                    buttonProps={{ type: "button", onClick: () => setDeclined(true), disabled: isFiling }}
                  >
                    رد
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    buttonProps={{ type: "button", onClick: () => { setSeed(null); setEditing(true); }, disabled: isFiling || ownersLoading }}
                  >
                    ویرایش
                  </Button>
                </div>
              </div>
            )}

            {offered && filed && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0"
                >
                  {Glyphs.check}
                </span>
                <p className="text-sm text-emerald-900 leading-7 m-0">
                  پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است. وضعیت آن از بخش{" "}
                  <Link to="/suggestions?tab=mine" className="font-semibold underline">
                    پیشنهادهای من
                  </Link>{" "}
                  قابل پیگیری است.
                </p>
              </div>
            )}

            {offered && declined && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span aria-hidden="true" className="text-slate-400 shrink-0">
                  {Glyphs.cross}
                </span>
                <p className="text-xs text-slate-500 leading-6 m-0">
                  این پیشنهاد رد شد و ثبت نگردید. در صورت نیاز می‌توانید با طرح پرسشی جدید، پیشنهاد
                  دیگری دریافت نمایید.
                </p>
              </div>
            )}

            {nearest && (
              <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-l from-slate-50 to-white p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    aria-hidden="true"
                    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"
                  >
                    {Glyphs.compass}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 m-0 leading-5">نزدیک‌ترین شغل موجود در پایگاه داده</p>
                    <p className="text-sm font-bold text-slate-800 m-0 leading-7">{nearest.job_title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenNearest((was) => !was)}
                    aria-expanded={openNearest}
                    title={`نمایش اطلاعات «${nearest.job_title}»`}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-slate-200
                               bg-white text-xs font-medium text-slate-700 cursor-pointer
                               transition-colors duration-200
                               hover:bg-slate-800 hover:text-white hover:border-slate-800
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    {openNearest ? "بستن اطلاعات" : "مشاهده اطلاعات"}
                    <Chevron open={openNearest} />
                  </button>
                </div>

                {openNearest && (
                  <JobDetails
                    details={[nearest]}
                    title={`اطلاعات «${nearest.job_title}»`}
                    className="mt-5"
                  />
                )}
              </div>
            )}
          </div>

          <Modal
            open={offered && choosing}
            onClose={() => !isFiling && setChoosing(false)}
            size="sm"
            title="محل ثبت پیشنهاد"
            hint={`شغل «${draft?.job_title ?? ""}» در کدام بخش پایگاه داده ثبت شود؟`}
            footer={
              <>
                <Button
                  variant="success"
                  size="lg"
                  buttonProps={{ type: "button", onClick: accept, disabled: isFiling }}
                >
                  {isFiling ? <Spinner /> : "ثبت پیشنهاد"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  buttonProps={{
                    type: "button",
                    onClick: () => setChoosing(false),
                    disabled: isFiling,
                  }}
                >
                  انصراف
                </Button>
              </>
            }
          >
            <fieldset className="flex flex-col gap-2 m-0 p-0 border-0">
              <legend className="sr-only">دامنه شغل</legend>
              {ownerChoices.map((choice) => (
                <label
                  key={choice.value}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer
                              transition-colors duration-200 ${
                                chosenOwner === choice.value
                                  ? "border-blue-400 bg-blue-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                >
                  <input
                    type="radio"
                    name="suggestion-owner"
                    value={choice.value}
                    checked={chosenOwner === choice.value}
                    onChange={() => setOwner(choice.value)}
                    disabled={isFiling}
                    className="mt-1.5 accent-blue-600"
                  />
                  <span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                      <span className="text-slate-500">{choice.icon}</span>
                      {choice.title}
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5 leading-6">
                      {choice.hint}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="text-xs text-slate-400 mt-4 leading-6">
              ثبت نهایی پس از تایید مدیر سامانه انجام می‌شود.
            </p>
          </Modal>
        </Card>
      )}
    </>
  );
}
