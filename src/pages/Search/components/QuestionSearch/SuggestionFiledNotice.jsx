/** Green confirmation shown after the composed job was filed, with a link to follow it under "my suggestions". */
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@components/icons";
import { PATHS } from "@routes/paths";

export default function SuggestionFiledNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <span
        aria-hidden="true"
        className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0"
      >
        <CheckCircleIcon className="w-5 h-5" />
      </span>
      <p className="text-sm text-emerald-900 leading-7 m-0">
        پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است. وضعیت آن از بخش{" "}
        <Link to={PATHS.mySuggestions} className="font-semibold underline">
          پیشنهادهای من
        </Link>{" "}
        قابل پیگیری است.
      </p>
    </div>
  );
}
