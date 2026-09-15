import { useState } from "react";
import Button from "@components/ui/Button";
import { fieldLabel } from "@constant/fieldLabels";

const LIST_AS_LINES = new Set(["responsibilities"]);

const SwapGlyph = (
  <svg
    className="w-3 h-3 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M7 7h13l-3-3M17 17H4l3 3" />
  </svg>
);

const PathChevron = ({ className }) => (
  <svg
    className={`w-3 h-3 shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

// `career_path_next` is a set of jobs this one can lead to, not a sequence — «پرستاران» lists
// «بهیاران» beside «پرستاران بیهوشی» — so it is drawn as branches from the job, not as a staircase.
function CareerPath({ root, steps, primary }) {
  const line = primary ? "bg-blue-200" : "bg-slate-300";
  const arrow = primary ? "text-blue-300" : "text-slate-400";
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
      <div className="flex items-center shrink-0">
        <span
          className={`max-w-56 rounded-xl px-3 py-2 text-[13px] font-bold leading-6 text-white ${
            primary ? "bg-blue-600" : "bg-slate-600"
          }`}
        >
          {root}
        </span>
        <span className={`hidden sm:block w-6 h-0.5 ${line}`} />
      </div>
      <ol className="list-none m-0 p-0 flex flex-col flex-1 min-w-0">
        {steps.map((step, i) => (
          <li key={i} className="relative flex items-center gap-1 ps-5 py-1">
            <span
              className={`absolute start-0 top-0 w-0.5 h-1/2 ${line} ${i === 0 ? "invisible" : ""}`}
            />
            <span
              className={`absolute start-0 bottom-0 w-0.5 h-1/2 ${line} ${
                i === steps.length - 1 ? "invisible" : ""
              }`}
            />
            <span className={`absolute start-0 top-1/2 -translate-y-1/2 w-4 h-0.5 ${line}`} />
            <PathChevron className={`-ms-1.5 ${arrow}`} />
            <span
              className={`rounded-full px-3 py-1 text-[13px] border ${
                primary
                  ? "bg-white border-blue-200 text-blue-900"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function faCount(n) {
  return n.toLocaleString("fa-IR");
}

function FieldSection({ field, expanded, jobTitle, onPickAlias }) {
  const limit = field.preview > 0 ? field.preview : field.items.length;
  const shown = expanded ? field.items : field.items.slice(0, limit);
  const asPath = shown.length > 0 && field.key === "career_path_next";
  const asChips = shown.length > 0 && !LIST_AS_LINES.has(field.key) && !asPath;
  // A composed job's other names are offered as its title: a click opens the edit form with that
  // name as the title and the old title kept among the other names.
  const pickable = asChips && field.key === "aliases" && Boolean(onPickAlias);
  const chipTone = field.primary
    ? "bg-white border-blue-200 text-blue-900"
    : "bg-slate-50 border-slate-200 text-slate-700";

  return (
    <section className="py-4 first:pt-0 last:pb-0">
      <header className="flex items-center gap-2 mb-3">
        <span
          className={`w-1 h-4 rounded-full shrink-0 ${
            field.primary ? "bg-blue-500" : "bg-slate-300"
          }`}
        />
        <h4
          className={`text-sm font-bold m-0 ${
            field.primary ? "text-blue-800" : "text-slate-700"
          }`}
        >
          {fieldLabel(field.key, field.label)}
        </h4>
        {field.items.length > 0 && (
          <span className="text-[11px] text-slate-400 shrink-0">
            (
            {shown.length < field.items.length
              ? `${faCount(shown.length)} از ${faCount(field.items.length)}`
              : faCount(field.items.length)}{" "}
            مورد)
          </span>
        )}
        <span
          className={`flex-1 h-px ${field.primary ? "bg-blue-100" : "bg-slate-100"}`}
        />
      </header>

      <div
        className={`text-sm text-slate-700 rounded-xl px-4 py-3 border ${
          field.primary
            ? "bg-blue-50/70 border-blue-100"
            : "bg-white/70 border-slate-100"
        }`}
      >
        {asPath && <CareerPath root={jobTitle} steps={shown} primary={field.primary} />}
        {asChips && (
          <div className="flex flex-wrap gap-2">
            {shown.map((item, i) =>
              pickable ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => onPickAlias(item)}
                  title={`جایگزینی عنوان شغل با «${item}»`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] border
                              cursor-pointer transition-colors duration-200 ${chipTone}
                              hover:bg-blue-600 hover:text-white hover:border-blue-600
                              focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                >
                  {SwapGlyph}
                  {item}
                </button>
              ) : (
                <span key={i} className={`rounded-full px-3 py-1 text-[13px] border ${chipTone}`}>
                  {item}
                </span>
              ),
            )}
          </div>
        )}
        {pickable && (
          <p className="text-[11px] text-slate-500 mt-2.5 mb-0 leading-5">
            برای جایگزینی عنوان شغل با هر یک از نام‌های دیگر، روی آن کلیک نمایید.
          </p>
        )}
        {!asChips && !asPath && shown.length > 0 && (
          <ul className="list-none p-0 m-0 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-x-8 gap-y-1.5">
            {shown.map((item, i) => (
              <li key={i} className="flex items-start gap-2 leading-7">
                <span
                  className={`mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    field.primary ? "bg-blue-400" : "bg-slate-300"
                  }`}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {field.items.length === 0 && <p className="leading-8 m-0">{field.value}</p>}
      </div>
    </section>
  );
}

export default function JobDetails({ details, title, onPickAlias }) {
  const [expanded, setExpanded] = useState(false);
  if (!details?.length) return null;
  const named = details.length > 1;

  const truncated = details.some((job) =>
    job.fields.some((f) => f.preview > 0 && f.items.length > f.preview),
  );

  return (
    <div className="mt-6 pt-5 border-t border-slate-200">
      {(title || truncated) && (
        <div className="flex items-center gap-3 mb-3">
          {title && (
            <p className="text-xs font-medium text-slate-500 m-0 flex items-center gap-2">
              <span className="w-6 h-px bg-slate-300" />
              {title}
            </p>
          )}
          {truncated && (
            <span className="ms-auto">
              <Button
                variant="outline"
                size="sm"
                buttonProps={{
                  type: "button",
                  onClick: () => setExpanded((was) => !was),
                  "aria-expanded": expanded,
                }}
              >
                {expanded ? "نمایش خلاصه اطلاعات" : "مشاهده کامل اطلاعات"}
              </Button>
            </span>
          )}
        </div>
      )}
      {details.map((job) => (
        <div key={job.job_title}>
          {named && (
            <p className="text-sm font-bold text-slate-800 mt-5 mb-2 pb-2 border-b border-slate-100">
              {job.job_title}
            </p>
          )}
          <div className="divide-y divide-slate-100">
            {job.fields.map((field) => (
              <FieldSection
                key={field.key}
                field={field}
                expanded={expanded}
                jobTitle={job.job_title}
                onPickAlias={onPickAlias}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
