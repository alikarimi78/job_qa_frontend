import { useState } from "react";
import Badge from "@components/ui/Badge";
import JobDetails from "@components/JobDetails";


function faPercent(ratio) {
  return `${Math.round(ratio * 100).toLocaleString("fa-IR")}٪`;
}

function CoverageBar({ ratio }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
        style={{ width: `${Math.round(ratio * 100)}%` }}
      />
    </div>
  );
}

function FieldRow({ field }) {
  if (!field.matched.length && !field.missing.length) return null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 py-2 border-t border-slate-100 first:border-t-0">
      <span className="text-xs text-slate-500 min-w-32">{field.label}</span>
      {field.matched.map((item, i) => (
        <span
          key={`m${i}`}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800
                     rounded-full px-2.5 py-0.5 text-[13px]"
        >
          {item}
        </span>
      ))}
      {field.missing.map((item, i) => (
        <span
          key={`x${i}`}
          className="bg-slate-50 border border-slate-200 text-slate-400 line-through
                     rounded-full px-2.5 py-0.5 text-[13px]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function MatchCard({ match, rank }) {
  const [open, setOpen] = useState(rank === 0);

  return (
    <div
      className={`rounded-xl border p-4 transition-colors duration-200
                  ${rank === 0 ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center
                        text-xs font-bold
                        ${rank === 0 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}
          >
            {(rank + 1).toLocaleString("fa-IR")}
          </span>
          <h3 className="text-sm font-bold text-slate-800 leading-7">{match.job_title}</h3>
        </div>
        <Badge tone={match.coverage >= 0.5 ? "success" : "neutral"}>
          پوشش {faPercent(match.coverage)}
        </Badge>
      </div>

      <div className="mt-3">
        <CoverageBar ratio={match.coverage} />
      </div>

      <div className="mt-3">
        {match.fields.map((field) => (
          <FieldRow key={field.key} field={field} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        className="mt-3 text-xs text-blue-700 hover:text-blue-800 cursor-pointer"
      >
        {open ? "بستن جزئیات شغل" : "نمایش جزئیات شغل"}
      </button>

      {open && <JobDetails details={[match.detail]} />}
    </div>
  );
}

export default function ProfileMatches({ result }) {
  if (!result) return null;

  return (
    <div className="mt-6">
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
        <p className="text-sm text-slate-800 leading-8 whitespace-pre-wrap m-0">
          {result.answer}
        </p>
      </div>

      {result.matches?.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          {result.matches.map((match, rank) => (
            <MatchCard key={match.job_title} match={match} rank={rank} />
          ))}
        </div>
      )}
    </div>
  );
}
