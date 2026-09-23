/** Grey panel about the embedding rebuild: whether it is running or how the last run ended, and (for a super admin) a button to start one. */
import BusyLabel from "@components/ui/BusyLabel";
import Button from "@components/ui/Button";

function statusText(rebuild) {
  if (rebuild.isRunning) return "در حال اجرا؛ تحلیل همچنان با نسخه پیشین پاسخ می‌دهد.";
  if (rebuild.status?.last_result) return `آخرین اجرا: ${rebuild.status.last_result}`;
  return "تا زمانی که بازسازی انجام نشود، رکورد جدید در نتایج تحلیل نمایش داده نمی‌شود.";
}

export default function RebuildPanel({ rebuild }) {
  const isBusy = rebuild.isRunning || rebuild.isStarting;

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
      <div>
        <strong className="text-sm text-slate-800">بازسازی امبدینگ‌ها</strong>
        <p className="text-xs text-slate-500 mt-0.5 leading-6">{statusText(rebuild)}</p>
      </div>
      {rebuild.canStart && (
        <Button variant="secondary" onClick={rebuild.start} disabled={isBusy}>
          <BusyLabel isBusy={isBusy} busyText="در حال اجرا...">
            بازسازی
          </BusyLabel>
        </Button>
      )}
    </div>
  );
}
