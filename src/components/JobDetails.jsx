// The matched record's own columns, rendered beside the generated answer. The prose
// answer stays what it always was; these are the data it was written from, so someone
// who asked about tools can read the duties without asking a second question.
//
// **Nothing here folds.** Every field was a `<details>` box that had to be clicked open,
// with only the columns the answer used («primary») open to begin with — so the page
// arrived mostly closed and the reader had to guess which label hid what they wanted.
// The record is short enough to print in full: label above, content below, all of it on
// screen. `primary` still means something and is still the backend's call — those fields
// are tinted and sorted first — but it now decides *emphasis*, not visibility.
//
// Duties are written as sentences; every other list column holds short labels that scan
// better as chips. Prose columns (شرح شغل، محیط کاری) arrive with no items at all and
// render as a paragraph.
const LIST_AS_LINES = new Set(["responsibilities"]);

function faCount(n) {
  return n.toLocaleString("fa-IR");
}

function FieldBox({ field }) {
  const asChips = field.items.length > 0 && !LIST_AS_LINES.has(field.key);

  return (
    <section
      className={`
        rounded-2xl border p-4 transition-colors duration-200
        ${
          field.primary
            ? "bg-blue-50/70 border-blue-200"
            : "bg-white/70 border-slate-200 hover:border-slate-300"
        }
        ${/* Sentences and paragraphs read badly in a narrow column: they take the row. */ ""}
        ${asChips ? "" : "md:col-span-2 xl:col-span-3"}
      `}
    >
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
          {field.label}
        </h4>
        {field.items.length > 0 && (
          <span className="text-[11px] text-slate-400 ms-auto shrink-0">
            {faCount(field.items.length)} مورد
          </span>
        )}
      </header>

      <div className="text-sm text-slate-700">
        {/* Keyed by position: a «|»-joined cell may well repeat a value, and the
            list is fixed for as long as it is on screen. */}
        {asChips && (
          <div className="flex flex-wrap gap-2">
            {field.items.map((item, i) => (
              <span
                key={i}
                className={`rounded-full px-3 py-1 text-[13px] border ${
                  field.primary
                    ? "bg-white border-blue-200 text-blue-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        )}
        {!asChips && field.items.length > 0 && (
          <ul className="list-none p-0 m-0 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-6 gap-y-1.5">
            {field.items.map((item, i) => (
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

export default function JobDetails({ details, title }) {
  if (!details?.length) return null;
  const named = details.length > 1; // interdisciplinary: say which job is which

  return (
    <div className="mt-6 pt-5 border-t border-slate-200">
      {title && (
        <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-2">
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
          {/* Fixed column counts rather than an `auto-fit` track, because the boxes are
              two widths: a chip column and a full-width paragraph. `dense` is what keeps
              the second kind from leaving a hole behind it — a later chip box backfills
              the gap instead of the grid ending in half-empty rows. */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start [grid-auto-flow:dense]">
            {job.fields.map((field) => (
              <FieldBox key={field.key} field={field} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
