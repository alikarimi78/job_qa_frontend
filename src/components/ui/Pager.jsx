import Button from "./Button";
import { faNumber } from "@utils/jalali";

const SLOTS = 7;

function pageSlots(page, pages) {
  if (pages <= SLOTS) return Array.from({ length: pages }, (_, i) => i + 1);
  const run = SLOTS - 2;
  if (page <= run - 1) return [...Array.from({ length: run }, (_, i) => i + 1), "end-gap", pages];
  if (page >= pages - run + 2)
    return [1, "start-gap", ...Array.from({ length: run }, (_, i) => pages - run + 1 + i)];
  return [1, "start-gap", page - 1, page, page + 1, "end-gap", pages];
}

export default function Pager({ page, pageSize, total, busy = false, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const go = (target) => onPage(Math.min(Math.max(target, 1), pages));

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mt-4 pt-4 border-t border-slate-200">
      <p className="m-0 text-sm text-slate-600 fa-nums">
        صفحه <strong className="font-bold text-slate-800">{faNumber(page)}</strong> از{" "}
        <strong className="font-bold text-slate-800">{faNumber(pages)}</strong>
        <span className="text-xs text-slate-400"> — {faNumber(total)} رکورد</span>
      </p>

      <nav aria-label="صفحه‌بندی" className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          buttonProps={{ onClick: () => go(page - 1), disabled: busy || page <= 1 }}
        >
          قبلی
        </Button>
        {pageSlots(page, pages).map((slot) =>
          typeof slot === "string" ? (
            <span key={slot} aria-hidden="true" className="w-6 text-center text-sm text-slate-400">
              …
            </span>
          ) : (
            <button
              key={slot}
              type="button"
              onClick={() => go(slot)}
              disabled={busy}
              aria-current={slot === page ? "page" : undefined}
              aria-label={`صفحه ${faNumber(slot)}`}
              className={`h-8 min-w-8 px-2 rounded-lg border text-xs font-medium fa-nums cursor-pointer
                          transition-all duration-200 disabled:cursor-not-allowed
                          ${
                            slot === page
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "bg-white/80 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 disabled:opacity-50"
                          }`}
            >
              {faNumber(slot)}
            </button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          buttonProps={{ onClick: () => go(page + 1), disabled: busy || page >= pages }}
        >
          بعدی
        </Button>
      </nav>
    </div>
  );
}
