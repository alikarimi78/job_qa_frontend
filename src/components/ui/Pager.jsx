import Button from "./Button";
import { faNumber } from "@utils/jalali";

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
