/** Configuration of the job-analysis page: its three tabs, how each kind of search answer is headed, which answers can be reported or offered as a suggestion, and the fields of the advanced (profile) search. */
import {
  BanIcon,
  BriefcaseIcon,
  GitMergeIcon,
  HelpCircleIcon,
  InfoIcon,
  SearchIcon,
  SlidersIcon,
  StarIcon,
} from "@components/icons";
import { PRIMARY_GRADIENT } from "@constants/accentThemes";
import { COLUMN_LABELS } from "@constants/jobFields";

export const SEARCH_TABS = {
  simple: "simple",
  advanced: "advanced",
  saved: "saved",
};

export const SEARCH_TAB_OPTIONS = [
  { value: SEARCH_TABS.simple, label: "تحلیل عمومی", icon: SearchIcon },
  { value: SEARCH_TABS.advanced, label: "تحلیل پیشرفته", icon: SlidersIcon },
  { value: SEARCH_TABS.saved, label: "ستاره‌دارها", icon: StarIcon },
];

export const DEFAULT_RESULT_HEADING = {
  eyebrow: "نتیجه تحلیل",
  icon: BriefcaseIcon,
  gradient: PRIMARY_GRADIENT,
};

export const RESULT_HEADINGS = {
  out_of_domain: {
    eyebrow: "نتیجه تحلیل",
    title: "خارج از دامنه",
    icon: BanIcon,
    gradient: "from-rose-500 to-red-600 shadow-red-600/25",
  },
  needs_detail: {
    eyebrow: "نتیجه تحلیل",
    title: "نیازمند توضیح دقیق‌تر",
    icon: HelpCircleIcon,
    gradient: "from-amber-400 to-amber-600 shadow-amber-600/25",
  },
  about: {
    eyebrow: "دستیار تحلیل مشاغل",
    title: "راهنمای سامانه",
    icon: InfoIcon,
    gradient: "from-slate-500 to-slate-700 shadow-slate-600/25",
  },
  interdisciplinary: { eyebrow: "تحلیل ترکیبی دو شغل", icon: GitMergeIcon, gradient: PRIMARY_GRADIENT },
  job_generated: { eyebrow: "شغل پیشنهادی", icon: BriefcaseIcon, gradient: PRIMARY_GRADIENT },
  job_adapted: { eyebrow: "شغل پیشنهادی", icon: BriefcaseIcon, gradient: PRIMARY_GRADIENT },
};

export const NO_REPORT_MODES = new Set(["out_of_domain", "about", "needs_detail"]);
export const COMPOSED_MODES = new Set(["job_generated", "job_adapted"]);
export const STORED_JOB_MODES = new Set(["single", "job_match"]);
export const COMBINATION_MODE = "interdisciplinary";

export const DRAFT_REASON_MESSAGES = {
  exists: ({ draft_job: existingJob }) =>
    `شغلی با عنوان «${existingJob}» که این ترکیب را پوشش می‌دهد در پایگاه داده موجود است؛ برای مشاهده مشخصات آن، همین عنوان را تحلیل نمایید.`,
  not_a_job: () =>
    "ترکیب این دو حوزه به شغل مشخصی اشاره ندارد، بنابراین شغلی برای پیشنهاد ایجاد نشد.",
  too_vague: () =>
    "پرسش شما دو حوزه را نام می‌برد، نه یک شغل مشخص؛ برای ثبت پیشنهاد، عنوان شغل ترکیبی مورد نظر را برای تحلیل وارد نمایید، برای نمونه «مهندس رباتیک جراحی».",
  unavailable: () => "امکان ایجاد شغل ترکیبی پیشنهادی در حال حاضر فراهم نیست.",
};

export const COMPOSED_NOTICE = {
  title: "این شغل در پایگاه داده موجود نیست",
  body: "مشخصات زیر بر اساس ورودی شما و نزدیک‌ترین رکورد موجود در پایگاه داده تدوین شده است.",
};

export const SAVED_SEARCH_MODE_LABELS = {
  single: "شغل موجود در پایگاه داده",
  job_match: "شغل موجود در پایگاه داده",
  job_adapted: "شغل پیشنهادی",
  job_generated: "شغل پیشنهادی",
  interdisciplinary: "ترکیب دو شغل",
  needs_detail: "نیازمند توضیح دقیق‌تر",
  about: "راهنمای سامانه",
  out_of_domain: "خارج از دامنه",
};

export const SAVED_SEARCHES_PAGE_SIZE = 10;

export const QUESTION_MAX_LENGTH = 500;

export const PROFILE_FIELDS = [
  { key: "skills", label: COLUMN_LABELS.skills, placeholder: "تفکر انتقادی", min: 2 },
  { key: "knowledge", label: COLUMN_LABELS.knowledge, placeholder: "اقتصاد و حسابداری", min: 1 },
  { key: "abilities", label: COLUMN_LABELS.abilities, placeholder: "استدلال ریاضی", min: 1 },
  { key: "work_context", label: COLUMN_LABELS.work_context, placeholder: "اهمیت بالای دقت در کار", min: 1 },
  { key: "tools", label: COLUMN_LABELS.tools, placeholder: "Microsoft Excel", min: 0 },
  { key: "responsibilities", label: COLUMN_LABELS.responsibilities, placeholder: "تهیه صورت‌های مالی", min: 0 },
  { key: "career_path_next", label: COLUMN_LABELS.career_path_next, placeholder: "مدیران امور مالی", min: 0 },
];
