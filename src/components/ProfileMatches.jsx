import { useState } from "react";
import AnswerPanel from "@components/AnswerPanel";
import JobDetails from "@components/JobDetails";
import { IconBadge, icon, themeOf } from "@components/fieldVisuals";
import Meter from "@components/ui/Meter";
import SectionHeading from "@components/ui/SectionHeading";
import { fieldLabel } from "@constant/fieldLabels";


const SparkleGlyph = icon(
  <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />,
  "w-3 h-3 shrink-0",
);
const CheckGlyph = icon(<path d="M5 12.5l4.5 4.5L19 7.5" />, "w-3 h-3 shrink-0");
const CrossGlyph = icon(<path d="M7 7l10 10M17 7L7 17" />, "w-3 h-3 shrink-0");

const Chevron = ({ open }) =>
  icon(
    <path d="M6 9l6 6 6-6" />,
    `w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`,
  );

const faCount = (n) => n.toLocaleString("fa-IR");
const faPercent = (ratio) => `${Math.round(ratio * 100).toLocaleString("fa-IR")}٪`;

// One profile field against one job: which of the user's items it holds and which it does not. The
// two differ by icon and border as well as colour, and the legend above the rows names both.
function FieldRow({ field }) {
  const theme = themeOf(field.key);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3">
      <div className="flex items-center gap-2.5 sm:w-52 shrink-0">
        <IconBadge theme={theme} fieldKey={field.key} size="sm" />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-slate-700 m-0 leading-5">
            {fieldLabel(field.key, field.label)}
          </p>
          <p className="text-[11px] text-slate-500 m-0 leading-5">پوشش {faPercent(field.ratio)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 sm:pt-0.5">
        {field.matched.map((item, i) => (
          <span
            key={`m${i}`}
            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[13px] leading-6
                       bg-emerald-50 border-emerald-200 text-emerald-900"
          >
            <span className="text-emerald-600">{CheckGlyph}</span>
            {item}
          </span>
        ))}
        {field.missing.map((item, i) => (
          <span
            key={`x${i}`}
            className="inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-0.5 text-[13px] leading-6
                       bg-slate-50 border-slate-300 text-slate-500"
          >
            <span className="text-slate-400">{CrossGlyph}</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// A ranked job: the first in the app's blue-to-indigo, as the best match, every other one neutral.
// Its fields and its details use the same colours and icons as the question page's job details.
function MatchCard({ match, rank }) {
  const [open, setOpen] = useState(rank === 0);
  const best = rank === 0;
  const fields = match.fields.filter((field) => field.matched.length || field.missing.length);
  const found = fields.reduce((n, field) => n + field.matched.length, 0);
  const asked = fields.reduce((n, field) => n + field.matched.length + field.missing.length, 0);

  return (
    <article
      className={`rounded-2xl border bg-white shadow-sm shadow-slate-900/5 overflow-hidden ${
        best ? "ring-2 ring-indigo-300/80 border-transparent" : "border-slate-200/80"
      }`}
    >
      <header
        className={`flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-3.5 bg-gradient-to-l ${
          best ? "from-indigo-50" : "from-slate-50"
        } to-white`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span
            aria-hidden="true"
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-bold ${
              best
                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {faCount(rank + 1)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
              <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">
                <span className="sr-only">رتبه {faCount(rank + 1)}: </span>
                {match.job_title}
              </h4>
              {best && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 bg-indigo-700 text-white">
                  {SparkleGlyph}
                  بهترین تطابق
                </span>
              )}
            </div>
            {asked > 0 && (
              <p className="text-xs text-slate-500 m-0 leading-5">
                {faCount(found)} از {faCount(asked)} مورد واردشده در این شغل یافت شد
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
          <Meter
            label="پوشش موارد شما"
            ratio={match.coverage}
            fill="from-emerald-400 to-emerald-600"
            title="سهم مواردی از پروفایل شما که در این شغل یافت شد"
          />
          <Meter
            label="میزان تطابق"
            ratio={match.score}
            title="امتیاز کلی تطابق این شغل با پروفایل شما"
          />
        </div>
      </header>

      {fields.length > 0 && (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h5 className="text-[13px] font-bold text-slate-700 m-0 leading-6">پوشش موارد واردشده</h5>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="text-emerald-600">{CheckGlyph}</span>
                پوشش داده شد
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-400">{CrossGlyph}</span>
                پوشش داده نشد
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {fields.map((field) => (
              <FieldRow key={field.key} field={field} />
            ))}
          </div>
        </div>
      )}

      <footer className="flex items-center justify-end px-4 py-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setOpen((was) => !was)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-slate-200
                     bg-white text-xs font-medium text-slate-700 cursor-pointer transition-colors duration-200
                     hover:bg-slate-800 hover:text-white hover:border-slate-800
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {open ? "بستن جزئیات شغل" : "نمایش جزئیات شغل"}
          <Chevron open={open} />
        </button>
      </footer>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-3 sm:px-4 pb-4">
          <JobDetails details={[match.detail]} className="pt-4" />
        </div>
      )}
    </article>
  );
}

export default function ProfileMatches({ result }) {
  if (!result) return null;
  const matches = result.matches ?? [];

  return (
    <div className="mt-6 flex flex-col gap-6">
      <AnswerPanel label="تحلیل هوشمند" text={result.answer} />

      {matches.length > 0 && (
        <div>
          <SectionHeading
            title="مشاغل متناسب با پروفایل شما"
            note={`(${faCount(matches.length)} شغل)`}
          />
          <div className="flex flex-col gap-4">
            {matches.map((match, rank) => (
              <MatchCard key={match.job_title} match={match} rank={rank} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
