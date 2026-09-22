import { useState } from "react";
import { IconBadge, themeOf } from "@components/fieldVisuals";
import { icon } from "@components/ui/icon";
import SectionHeading from "@components/ui/SectionHeading";
import { fieldLabel } from "@constant/fieldLabels";
import { faNumber } from "@utils/jalali";

const COMPETENCIES = ["skills", "knowledge", "abilities"];
const COMPETENCY_TITLE = "شایستگی‌های شغلی";
const COMPETENCY_HINT = "مهارت‌ها، دانش و توانایی‌های لازم برای این شغل";
const COMPETENCY_COLUMNS = { 1: "", 2: "@2xl:grid-cols-2", 3: "@2xl:grid-cols-3" };

const AwardGlyph = icon(
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="M8.2 13.2L7 22l5-3 5 3-1.2-8.8" />
  </>
);

const SparkleGlyph = icon(
  <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />,
  "w-3 h-3 shrink-0",
);

const CheckGlyph = icon(<path d="M5 12.5l4.5 4.5L19 7.5" />, "w-3 h-3");

const SwapGlyph = icon(<path d="M7 7h13l-3-3M17 17H4l3 3" />, "w-3 h-3 shrink-0");

const ToggleChevron = ({ open }) =>
  icon(
    <path d="M6 9l6 6 6-6" />,
    `w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`,
  );

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
    ? `${faNumber(shown.length)} از ${faNumber(field.items.length)} مورد`
    : `${faNumber(field.items.length)} مورد`;
}

function RelevantPill({ theme }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 ${theme.pill}`}
    >
      {SparkleGlyph}
      مرتبط با پرسش شما
    </span>
  );
}

function ExpandButton({ expanded, total, theme, onToggle, compact = false }) {
  const full = expanded ? "نمایش خلاصه" : `مشاهده کامل (${faNumber(total)})`;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      title={full}
      className={`inline-flex items-center gap-1 shrink-0 h-8 rounded-full border bg-white px-3
                  text-xs font-medium cursor-pointer transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${theme.toggle}`}
    >
      {compact ? (
        <>
          <span className="@xs:hidden">{expanded ? "خلاصه" : `همه (${faNumber(total)})`}</span>
          <span className="hidden @xs:inline">{full}</span>
        </>
      ) : (
        full
      )}
      <ToggleChevron open={expanded} />
    </button>
  );
}

export function CareerPath({ root, steps, theme, renderStep }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
      <div className="flex items-center shrink-0">
        <span
          className={`max-w-56 rounded-xl px-3.5 py-2 text-[13px] font-bold leading-6 text-white
                      bg-gradient-to-br shadow-md ${theme.badge}`}
        >
          {root}
        </span>
        <span className={`hidden sm:block w-6 h-0.5 ${theme.line}`} />
      </div>
      <ol className="list-none m-0 p-0 flex flex-col flex-1 min-w-0">
        {steps.map((step, i) => (
          <li key={i} className="relative flex items-center gap-1 ps-5 py-1">
            <span
              className={`absolute start-0 top-0 w-0.5 h-1/2 ${theme.line} ${i === 0 ? "invisible" : ""}`}
            />
            <span
              className={`absolute start-0 bottom-0 w-0.5 h-1/2 ${theme.line} ${
                i === steps.length - 1 ? "invisible" : ""
              }`}
            />
            <span className={`absolute start-0 top-1/2 -translate-y-1/2 w-5 h-0.5 ${theme.line}`} />
            {renderStep ? (
              renderStep(step, i)
            ) : (
              <span className="flex items-start gap-2.5 leading-7">
                <LineBullet theme={theme} />
                <span>{step}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export const LINES_CLASS =
  "list-none p-0 m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-8 gap-y-2";

export function LineBullet({ theme }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 w-5 h-5 rounded-full ${theme.soft} flex items-center justify-center shrink-0`}
    >
      {CheckGlyph}
    </span>
  );
}

function FieldItems({ field, theme, shown, hidden, onExpand, jobTitle, onPickAlias }) {
  if (!field.items.length) return <p className="leading-8 m-0 text-slate-700">{field.value}</p>;
  const pickable = field.key === "aliases" && Boolean(onPickAlias);

  return (
    <>
      {field.key === "career_path_next" ? (
        <CareerPath root={jobTitle} steps={shown} theme={theme} />
      ) : (
        <ul className={LINES_CLASS}>
          {shown.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 leading-7">
              <LineBullet theme={theme} />
              {pickable ? (
                <button
                  type="button"
                  onClick={() => onPickAlias(item)}
                  title={`جایگزینی عنوان شغل با «${item}»`}
                  className="group inline-flex items-start gap-1.5 text-start cursor-pointer rounded-md -mx-1 px-1
                             transition-colors duration-200 hover:bg-slate-100 focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  {item}
                  <span className="mt-2 text-slate-400 group-hover:text-slate-600">{SwapGlyph}</span>
                </button>
              ) : (
                <span>{item}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {pickable && (
        <p className="text-[11px] text-slate-500 mt-2.5 mb-0 leading-5">
          برای جایگزینی عنوان شغل با هر یک از نام‌های دیگر، روی آن کلیک نمایید.
        </p>
      )}
      {hidden > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onExpand}
            className={`rounded-full px-3 py-1 text-[12px] leading-6 border border-dashed bg-white/70 cursor-pointer
                        transition-colors duration-200 focus:outline-none focus-visible:ring-2
                        focus-visible:ring-blue-500/40 ${theme.more}`}
          >
            نمایش {faNumber(hidden)} مورد دیگر
          </button>
        </div>
      )}
    </>
  );
}

export function FieldShell({ fieldKey, label, primary, count, aside, invalid, children }) {
  const theme = themeOf(fieldKey);
  return (
    <section
      className={`rounded-2xl border bg-white shadow-sm shadow-slate-900/5 overflow-hidden ${
        invalid
          ? "ring-2 ring-red-300 border-transparent"
          : primary
            ? `ring-2 ${theme.ring} border-transparent`
            : "border-slate-200/80"
      }`}
    >
      <header className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-l ${theme.header} to-white`}>
        <IconBadge theme={theme} fieldKey={fieldKey} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
            <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">
              {fieldLabel(fieldKey, label)}
            </h4>
            {primary && <RelevantPill theme={theme} />}
          </div>
          {count && <p className="text-xs text-slate-500 m-0 leading-5">{count}</p>}
        </div>
        {aside}
      </header>

      <div className="px-4 pt-2 pb-4 text-sm text-slate-700">{children}</div>
    </section>
  );
}

function FieldCard({ field, jobTitle, onPickAlias }) {
  const theme = themeOf(field.key);
  const { expanded, toggle, shown, hidden, foldable } = useExpandable(field);

  return (
    <FieldShell
      fieldKey={field.key}
      label={field.label}
      primary={field.primary}
      count={countText(field, shown)}
      aside={
        foldable && (
          <ExpandButton expanded={expanded} total={field.items.length} theme={theme} onToggle={toggle} />
        )
      }
    >
      <FieldItems
        field={field}
        theme={theme}
        shown={shown}
        hidden={hidden}
        onExpand={toggle}
        jobTitle={jobTitle}
        onPickAlias={onPickAlias}
      />
    </FieldShell>
  );
}

export function CompetencyItemShell({ fieldKey, label, primary, count, aside, invalid, children }) {
  const theme = themeOf(COMPETENCIES[0]);
  return (
    <div
      className={`@container flex flex-col gap-3 min-w-0 rounded-xl border bg-white p-3.5 shadow-sm shadow-slate-900/5 ${
        invalid
          ? "ring-2 ring-red-300 border-transparent"
          : primary
            ? `ring-2 ${theme.ring} border-transparent`
            : "border-slate-200/70"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <IconBadge theme={theme} fieldKey={fieldKey} size="md" />
        <div className="min-w-0 flex-1">
          <h5 className="text-[13px] font-bold text-slate-800 m-0 leading-6">
            {fieldLabel(fieldKey, label)}
          </h5>
          {count && <p className="text-[11px] text-slate-500 m-0 leading-5">{count}</p>}
        </div>
        {aside}
      </div>
      {primary && (
        <div>
          <RelevantPill theme={theme} />
        </div>
      )}
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

function CompetencyCard({ field, theme }) {
  const { expanded, toggle, shown, hidden, foldable } = useExpandable(field);

  return (
    <CompetencyItemShell
      fieldKey={field.key}
      label={field.label}
      primary={field.primary}
      count={countText(field, shown)}
      aside={
        foldable && (
          <ExpandButton
            expanded={expanded}
            total={field.items.length}
            theme={theme}
            onToggle={toggle}
            compact
          />
        )
      }
    >
      <FieldItems field={field} theme={theme} shown={shown} hidden={hidden} onExpand={toggle} />
    </CompetencyItemShell>
  );
}

export function CompetencyShell({ size, children }) {
  const theme = themeOf(COMPETENCIES[0]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5 overflow-hidden">
      <header className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-l ${theme.header} to-white`}>
        <IconBadge theme={theme} glyph={AwardGlyph} />
        <div className="min-w-0 flex-1">
          <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">{COMPETENCY_TITLE}</h4>
          <p className="text-xs text-slate-500 m-0 leading-5">{COMPETENCY_HINT}</p>
        </div>
      </header>

      <div className={`@container ${theme.body} p-3 sm:p-4`}>
        <div className={`grid grid-cols-1 gap-3 ${COMPETENCY_COLUMNS[size]}`}>{children}</div>
      </div>
    </section>
  );
}

function CompetencyGroup({ fields }) {
  const theme = themeOf(COMPETENCIES[0]);
  return (
    <CompetencyShell size={fields.length}>
      {fields.map((field) => (
        <CompetencyCard key={field.key} field={field} theme={theme} />
      ))}
    </CompetencyShell>
  );
}

export function arrange(fields) {
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

export default function JobDetails({ details, title, onPickAlias, className = "mt-6" }) {
  if (!details?.length) return null;
  const named = details.length > 1;

  return (
    <div className={className}>
      {title && <SectionHeading title={title} />}
      {details.map((job, index) => (
        <div key={job.job_title} className={index > 0 ? "mt-8" : ""}>
          {named && (
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {faNumber(index + 1)}
              </span>
              <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">{job.job_title}</h4>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {arrange(job.fields).map((block) =>
              block.group ? (
                <CompetencyGroup key="competencies" fields={block.group} />
              ) : (
                <FieldCard
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
