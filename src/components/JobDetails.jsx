// The matched record's own columns, rendered as one box per field beside the
// generated answer. The prose answer stays what it always was; these boxes are the
// data it was written from, so someone who asked about tools can still open the
// duties box without asking a second question.
//
// Which boxes matter is the backend's call, not this component's: `primary` marks
// the columns the answer used — what the question's intent asked for — and those
// open, while the rest of the profile stays one click away.

// Duties are written as sentences; every other list column holds short labels that
// scan better as chips. Prose columns (شرح شغل، محیط کاری) arrive with no items at
// all and render as a paragraph.
const LIST_AS_LINES = new Set(["responsibilities"]);

function faCount(n) {
  return n.toLocaleString("fa-IR");
}

function FieldBox({ field }) {
  const asChips = field.items.length > 0 && !LIST_AS_LINES.has(field.key);

  return (
    <details
      open={field.primary}
      className={`
        group rounded-xl border transition-all duration-200
        ${
          field.primary
            ? "bg-blue-50/70 border-blue-200"
            : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
        }
        ${/* Sentences and paragraphs need the whole row — but only once they are open.
             Closed, a box is just its label, and a full row for that leaves the grid holed. */ ""}
        ${asChips ? "" : "open:col-span-full"}
      `}
    >
      <summary
        className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none
                   [&::-webkit-details-marker]:hidden"
      >
        <span
          className={`text-sm font-semibold ${field.primary ? "text-blue-700" : "text-slate-700"}`}
        >
          {field.label}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {field.items.length > 0 && (
            <span className="text-xs text-slate-400">{faCount(field.items.length)} مورد</span>
          )}
          <svg
            className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>

      <div className="px-4 pb-4 text-sm text-slate-700">
        {/* Keyed by position: a «|»-joined cell may well repeat a value, and the
            list is fixed for as long as it is on screen. */}
        {asChips && (
          <div className="flex flex-wrap gap-2">
            {field.items.map((item, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 rounded-full px-3 py-0.5 text-[13px] text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}
        {!asChips && field.items.length > 0 && (
          <ul className="list-disc ps-5 space-y-1 leading-7 marker:text-slate-400">
            {field.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        {field.items.length === 0 && <p className="leading-8 m-0">{field.value}</p>}
      </div>
    </details>
  );
}

export default function JobDetails({ details, title }) {
  if (!details?.length) return null;
  const named = details.length > 1; // interdisciplinary: say which job is which

  return (
    <div className="mt-6 pt-5 border-t border-slate-200">
      {title && <p className="text-xs text-slate-500 mb-3">{title}</p>}
      {details.map((job) => (
        <div key={job.job_title}>
          {named && <p className="text-sm font-semibold text-slate-800 mt-4 mb-2">{job.job_title}</p>}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3 items-start">
            {job.fields.map((field) => (
              <FieldBox key={field.key} field={field} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
