/** Pill marking a field as the one the user's question was about. */
import { SparkleIcon } from "@components/icons";

export default function RelevantPill({ theme }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 ${theme.pill}`}
    >
      <SparkleIcon className="w-3 h-3 shrink-0" />
      مرتبط با پرسش شما
    </span>
  );
}
