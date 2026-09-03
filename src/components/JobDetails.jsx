import { useState } from "react";
import Button from "@components/ui/Button";

const LIST_AS_LINES = new Set(["responsibilities"]);

function faCount(n) {
  return n.toLocaleString("fa-IR");
}

function FieldSection({ field, expanded }) {
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
              <FieldSection key={field.key} field={field} expanded={expanded} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
