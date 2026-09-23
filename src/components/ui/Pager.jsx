/** Page navigation under a paged list: "page X of Y", previous/next buttons and numbered page buttons with gaps; hidden when everything fits on one page. */
import { faNumber } from "@utils/numbers";
import { pageSlots } from "@utils/pagination";
import Button from "./Button";

function PageButton({ pageNumber, isCurrent, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`صفحه ${faNumber(pageNumber)}`}
      className={`h-8 min-w-8 px-2 rounded-lg border text-xs font-medium fa-nums cursor-pointer
                  transition-all duration-200 disabled:cursor-not-allowed
                  ${
                    isCurrent
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-white/80 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 disabled:opacity-50"
                  }`}
    >
      {faNumber(pageNumber)}
    </button>
  );
}

export default function Pager({ page, pageSize, total, busy = false, onPage }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const goTo = (targetPage) => onPage(Math.min(Math.max(targetPage, 1), pageCount));

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mt-4 pt-4 border-t border-slate-200">
      <p className="m-0 text-sm text-slate-600 fa-nums">
        صفحه <strong className="font-bold text-slate-800">{faNumber(page)}</strong> از{" "}
        <strong className="font-bold text-slate-800">{faNumber(pageCount)}</strong>
        <span className="text-xs text-slate-400"> — {faNumber(total)} رکورد</span>
      </p>

      <nav aria-label="صفحه‌بندی" className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(page - 1)}
          disabled={busy || page <= 1}
        >
          قبلی
        </Button>
        {pageSlots(page, pageCount).map((slot) =>
          typeof slot === "string" ? (
            <span key={slot} aria-hidden="true" className="w-6 text-center text-sm text-slate-400">
              …
            </span>
          ) : (
            <PageButton
              key={slot}
              pageNumber={slot}
              isCurrent={slot === page}
              disabled={busy}
              onClick={() => goTo(slot)}
            />
          )
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(page + 1)}
          disabled={busy || page >= pageCount}
        >
          بعدی
        </Button>
      </nav>
    </div>
  );
}
