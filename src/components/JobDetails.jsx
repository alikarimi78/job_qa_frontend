import { useState } from "react";
import { fieldLabel } from "@constant/fieldLabels";

const LIST_AS_LINES = new Set(["responsibilities"]);

// The client shows these three as one «شایستگی‌های شغلی» card, placed where the first of them falls
// in the backend's order. The backend still sends three fields; each keeps its own box and toggle.
const COMPETENCIES = ["skills", "knowledge", "abilities"];
const COMPETENCY_TITLE = "شایستگی‌های شغلی";
const COMPETENCY_COLUMNS = { 1: "", 2: "@2xl:grid-cols-2", 3: "@2xl:grid-cols-3" };

const icon = (path) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

const AwardGlyph = icon(
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="M8.2 13.2L7 22l5-3 5 3-1.2-8.8" />
  </>
);

const COMPETENCY_ICONS = {
  skills: icon(
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
  ),
  knowledge: icon(
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" />
      <path d="M4 19.5A2.5 2.5 0 006.5 22H20v-5" />
    </>
  ),
  abilities: icon(<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />),
};

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

const ToggleChevron = ({ open }) => (
  <svg
    className={`w-3 h-3 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

function faCount(n) {
  return n.toLocaleString("fa-IR");
}

// Each field opens on its own: the backend's `preview` is how many items show before it does.
function useExpandable(field) {
  const [expanded, setExpanded] = useState(false);
  const limit = field.preview > 0 ? field.preview : field.items.length;
  const shown = expanded ? field.items : field.items.slice(0, limit);
  return {
    expanded,
    toggle: () => setExpanded((was) => !was),
    shown,
    hidden: field.items.length - shown.length,
    foldable: field.items.length > limit,
  };
}

function countText(field, shown) {
  if (!field.items.length) return null;
  return shown.length < field.items.length
    ? `${faCount(shown.length)} از ${faCount(field.items.length)} مورد`
    : `${faCount(field.items.length)} مورد`;
}

function ExpandButton({ expanded, total, primary, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className={`inline-flex items-center gap-1 shrink-0 rounded-full border px-2.5 py-1
                  text-[11px] font-medium cursor-pointer transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    primary
                      ? "bg-white border-blue-200 text-blue-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-700 hover:border-slate-700 hover:text-white"
                  }`}
    >
      {expanded ? "نمایش خلاصه" : `مشاهده کامل (${faCount(total)})`}
      <ToggleChevron open={expanded} />
    </button>
  );
}

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

function FieldItems({ field, shown, hidden, onExpand, jobTitle, onPickAlias }) {
  const asPath = shown.length > 0 && field.key === "career_path_next";
  const asChips = shown.length > 0 && !LIST_AS_LINES.has(field.key) && !asPath;
  // A composed job's other names are offered as its title: a click opens the edit form with that
  // name as the title and the old title kept among the other names.
  const pickable = asChips && field.key === "aliases" && Boolean(onPickAlias);
  const chipTone = field.primary
    ? "bg-white border-blue-200 text-blue-900"
    : "bg-slate-50 border-slate-200 text-slate-700";
  const more = hidden > 0 && (
    <button
      type="button"
      onClick={onExpand}
      className={`rounded-full px-3 py-1 text-[12px] border border-dashed cursor-pointer
                  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    field.primary
                      ? "border-blue-300 text-blue-700 hover:bg-blue-100/70"
                      : "border-slate-300 text-slate-500 hover:bg-slate-100"
                  }`}
    >
      نمایش {faCount(hidden)} مورد دیگر
    </button>
  );

  return (
    <>
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
          {more}
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
      {!asChips && more && <div className="mt-2">{more}</div>}
      {field.items.length === 0 && <p className="leading-8 m-0">{field.value}</p>}
    </>
  );
}

function FieldSection({ field, jobTitle, onPickAlias }) {
  const { expanded, toggle, shown, hidden, foldable } = useExpandable(field);
  const count = countText(field, shown);

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
        {count && <span className="text-[11px] text-slate-400 shrink-0">({count})</span>}
        <span
          className={`flex-1 h-px ${field.primary ? "bg-blue-100" : "bg-slate-100"}`}
        />
        {foldable && (
          <ExpandButton
            expanded={expanded}
            total={field.items.length}
            primary={field.primary}
            onToggle={toggle}
          />
        )}
      </header>

      <div
        className={`text-sm text-slate-700 rounded-xl px-4 py-3 border ${
          field.primary
            ? "bg-blue-50/70 border-blue-100"
            : "bg-white/70 border-slate-100"
        }`}
      >
        <FieldItems
          field={field}
          shown={shown}
          hidden={hidden}
          onExpand={toggle}
          jobTitle={jobTitle}
          onPickAlias={onPickAlias}
        />
      </div>
    </section>
  );
}

function CompetencyCard({ field }) {
  const { expanded, toggle, shown, hidden, foldable } = useExpandable(field);
  const count = countText(field, shown);

  return (
    <div
      className={`flex flex-col gap-3 min-w-0 rounded-xl border bg-white p-3.5 shadow-sm shadow-slate-900/5 ${
        field.primary ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200/80"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            field.primary ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {COMPETENCY_ICONS[field.key]}
        </span>
        <div className="min-w-0 flex-1">
          <h5
            className={`text-[13px] font-bold leading-5 m-0 ${
              field.primary ? "text-blue-800" : "text-slate-700"
            }`}
          >
            {fieldLabel(field.key, field.label)}
          </h5>
          {count && <p className="text-[11px] text-slate-400 leading-5 m-0">{count}</p>}
        </div>
        {foldable && (
          <ExpandButton
            expanded={expanded}
            total={field.items.length}
            primary={field.primary}
            onToggle={toggle}
          />
        )}
      </div>
      <div className="text-sm text-slate-700">
        <FieldItems field={field} shown={shown} hidden={hidden} onExpand={toggle} />
      </div>
    </div>
  );
}

function CompetencyGroup({ fields }) {
  const primary = fields.some((field) => field.primary);

  return (
    <section className="py-4 first:pt-0 last:pb-0">
      <header className="flex items-center gap-2.5 mb-3">
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white shadow-md ${
            primary
              ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-600/25"
              : "bg-gradient-to-br from-slate-500 to-slate-700 shadow-slate-600/20"
          }`}
        >
          {AwardGlyph}
        </span>
        <h4 className={`text-sm font-bold m-0 ${primary ? "text-blue-800" : "text-slate-700"}`}>
          {COMPETENCY_TITLE}
        </h4>
        <span className="text-[11px] text-slate-400 shrink-0">
          ({faCount(fields.length)} بخش)
        </span>
        <span className={`flex-1 h-px ${primary ? "bg-blue-100" : "bg-slate-100"}`} />
      </header>

      <div
        className={`@container rounded-2xl border p-2.5 sm:p-3 ${
          primary
            ? "bg-gradient-to-bl from-blue-50 via-indigo-50/50 to-white border-blue-100"
            : "bg-gradient-to-bl from-slate-50 via-slate-50/60 to-white border-slate-100"
        }`}
      >
        <div className={`grid grid-cols-1 gap-3 ${COMPETENCY_COLUMNS[fields.length]}`}>
          {fields.map((field) => (
            <CompetencyCard key={field.key} field={field} />
          ))}
        </div>
      </div>
    </section>
  );
}

// The fields in the backend's order, with the three competencies folded into one group where the
// first of them appears.
function arrange(fields) {
  const members = COMPETENCIES.map((key) => fields.find((field) => field.key === key)).filter(
    Boolean,
  );
  const blocks = [];
  let grouped = false;
  for (const field of fields) {
    if (!COMPETENCIES.includes(field.key)) {
      blocks.push({ field });
    } else if (!grouped) {
      blocks.push({ group: members });
      grouped = true;
    }
  }
  return blocks;
}

export default function JobDetails({ details, title, onPickAlias }) {
  if (!details?.length) return null;
  const named = details.length > 1;

  return (
    <div className="mt-6 pt-5 border-t border-slate-200">
      {title && (
        <p className="text-xs font-medium text-slate-500 m-0 mb-3 flex items-center gap-2">
          <span className="w-6 h-px bg-slate-300" />
          {title}
        </p>
      )}
      {details.map((job) => (
        <div key={job.job_title}>
          {named && (
            <p className="text-sm font-bold text-slate-800 mt-5 mb-2 pb-2 border-b border-slate-100">
              {job.job_title}
            </p>
          )}
          <div className="divide-y divide-slate-100">
            {arrange(job.fields).map((block) =>
              block.group ? (
                <CompetencyGroup key="competencies" fields={block.group} />
              ) : (
                <FieldSection
                  key={block.field.key}
                  field={block.field}
                  jobTitle={job.job_title}
                  onPickAlias={onPickAlias}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
