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
// **And nothing sits beside anything else.** The fields were a `1 / 2 / 3` card grid,
// which was fine while a record was ~200 tokens; the retranslated corpus fills every
// taxonomy (22 abilities, 28 context factors, 20 next roles) and no two columns are
// anywhere near the same height, so the grid drew ragged half-empty cards and the reader
// had to hunt across three tracks for the next field. Each column is now one full-width
// section stacked under the last — label as a heading, content beneath it — so the page
// reads top to bottom in the order the backend sorted the fields, whatever their length.
// The chips still wrap across the whole width, which is the width they wanted.
//
// Duties are written as sentences; every other list column holds short labels that scan
// better as chips. Prose columns (شرح شغل) arrive with no items at all and render as a
// paragraph.
//
// **And not all of it at once.** The retranslated corpus puts 121 items in a record at
// the median and 532 in the largest — 293 tools on «برنامه‌نویسان کامپیوتر» alone — so
// printing every column whole buried the four or five lines the reader came for. Each
// column now shows `field.preview` items and one button opens the rest. The whole
// column is in the payload either way, so the toggle is a slice and never a request,
// and the PDF report still prints all of it.
//
// The five that show are chosen, not the first five that happened to be stored: the
// backend keeps `skills` / `knowledge` / `abilities` / `work_context` in O*NET's own
// importance order and re-ranks tools, duties and next roles against the question that
// was asked (`job_qa_service/engine.py:_select_items`). Nothing here re-orders anything
// — the order the fields arrive in is the answer.
import { useState } from "react";
import Button from "@components/ui/Button";

const LIST_AS_LINES = new Set(["responsibilities"]);

function faCount(n) {
  return n.toLocaleString("fa-IR");
}

function FieldSection({ field, expanded }) {
  // A `preview` of 0 on a list column means the backend did not send one; showing the
  // column whole is the safe reading of that, since it is what the page did before.
  const limit = field.preview > 0 ? field.preview : field.items.length;
  const shown = expanded ? field.items : field.items.slice(0, limit);
  const asChips = shown.length > 0 && !LIST_AS_LINES.has(field.key);

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
          {field.label}
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
        {/* The rule fills whatever the heading leaves, so a long label and a short one
            still end at the same place — which is what makes the stack read as a list
            of sections rather than as a column of loose paragraphs. */}
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
        {/* Keyed by position: a «|»-joined cell may well repeat a value, and the
            list is fixed for as long as it is on screen. */}
        {asChips && (
          <div className="flex flex-wrap gap-2">
            {shown.map((item, i) => (
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
        {!asChips && shown.length > 0 && (
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

export default function JobDetails({ details, title }) {
  // One switch for the whole record rather than one per column: «مشاهده کامل اطلاعات»
  // is a decision about how much of this answer the reader wants, and a page of
  // twenty of them would be the row of closed `<details>` boxes this component was
  // built to get rid of. Collapsed to begin with — the point is that the answer and
  // the few columns it was written from fit on a screen.
  const [expanded, setExpanded] = useState(false);
  if (!details?.length) return null;
  const named = details.length > 1; // interdisciplinary: say which job is which

  // Offered only when the short view is actually holding something back. A military
  // record with seven duties and six tools has nothing behind the button, and a button
  // that does nothing is worse than none.
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
          {/* `ms-auto` and not `mr-auto`: the page is RTL, so the logical property is
              what puts this at the far end of the row instead of beside the title. */}
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
          {/* One field per row, in the order the backend sorted them. No grid: the
              columns differ in length by an order of magnitude and nothing may be
              made to share a row with something it will not fill. */}
          <div className="divide-y divide-slate-100">
            {job.fields.map((field) => (
              <FieldSection key={field.key} field={field} expanded={expanded} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
