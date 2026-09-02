import Button from "./Button";
import { faNumber } from "@utils/jalali";

// The strip under a table that does not fit on one page. The management tables hold
// tens of rows and print whole; the corpus holds 1118, so this is the first list in the
// app that needs one.
//
// Four buttons rather than a numbered strip: fifty-six page numbers is a row nobody
// reads, and finding one particular record is what the search box above the table is
// for — this is for browsing, where «the next page» is the only thing ever wanted.
//
// In DOM order they are first, previous, next, last, which under `dir="rtl"` draws them
// right to left in exactly that order — «قبلی» on the side the page is read from.
//
// It renders nothing at all when everything fits: a pager saying «صفحه ۱ از ۱» is a
// control that cannot be used.
export default function Pager({ page, pageSize, total, busy = false, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const go = (target) => onPage(Math.min(Math.max(target, 1), pages));
  const first = page <= 1;
  const last = page >= pages;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mt-4 pt-4 border-t border-slate-200">
      <span className="text-xs text-slate-400 fa-nums">
        صفحه {faNumber(page)} از {faNumber(pages)} — {faNumber(total)} رکورد
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          buttonProps={{ onClick: () => go(1), disabled: busy || first }}
        >
          ابتدا
        </Button>
        <Button
          variant="outline"
          size="sm"
          buttonProps={{ onClick: () => go(page - 1), disabled: busy || first }}
        >
          قبلی
        </Button>
        <Button
          variant="outline"
          size="sm"
          buttonProps={{ onClick: () => go(page + 1), disabled: busy || last }}
        >
          بعدی
        </Button>
        <Button
          variant="outline"
          size="sm"
          buttonProps={{ onClick: () => go(pages), disabled: busy || last }}
        >
          انتها
        </Button>
      </div>
    </div>
  );
}
