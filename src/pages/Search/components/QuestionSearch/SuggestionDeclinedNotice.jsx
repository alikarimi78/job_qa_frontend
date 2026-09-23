/** Grey note shown after the user declined to add the composed job. */
import { XCircleIcon } from "@components/icons";

export default function SuggestionDeclinedNotice() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span aria-hidden="true" className="text-slate-400 shrink-0">
        <XCircleIcon />
      </span>
      <p className="text-xs text-slate-500 leading-6 m-0">
        این پیشنهاد رد شد و ثبت نگردید. در صورت نیاز می‌توانید با طرح پرسشی جدید، پیشنهاد
        دیگری دریافت نمایید.
      </p>
    </div>
  );
}
