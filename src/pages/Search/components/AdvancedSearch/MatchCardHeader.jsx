/** Header of a ranked job: its rank, title, a "best match" pill for the first, a count summary, and the coverage meter. */
import { SparkleIcon } from "@components/icons";
import Meter from "@components/ui/Meter";
import { faNumber } from "@utils/numbers";

function CountSummary({ foundCount, enteredCount, unknownCount }) {
  if (enteredCount === 0 && unknownCount === 0) return null;
  return (
    <p className="text-xs text-slate-500 m-0 leading-5">
      {enteredCount > 0 &&
        `${faNumber(foundCount)} از ${faNumber(enteredCount)} مورد واردشده در این شغل یافت شد`}
      {enteredCount > 0 && unknownCount > 0 && "؛ "}
      {unknownCount > 0 && `${faNumber(unknownCount)} مورد در واژگان پایگاه داده ثبت نشده است`}
    </p>
  );
}

export default function MatchCardHeader({ match, rank, summary }) {
  const isBest = rank === 0;
  const position = faNumber(rank + 1);

  return (
    <header
      className={`flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-3.5 bg-gradient-to-l ${
        isBest ? "from-indigo-50" : "from-slate-50"
      } to-white`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span
          aria-hidden="true"
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-bold ${
            isBest
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {position}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
            <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">
              <span className="sr-only">رتبه {position}: </span>
              {match.job_title}
            </h4>
            {isBest && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 bg-indigo-700 text-white">
                <SparkleIcon className="w-3 h-3 shrink-0" />
                بهترین تطابق
              </span>
            )}
          </div>
          <CountSummary {...summary} />
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
        <Meter
          label="پوشش موارد شما"
          ratio={match.coverage}
          title="سهم مواردی از پروفایل شما که در این شغل یافت شد"
        />
      </div>
    </header>
  );
}
