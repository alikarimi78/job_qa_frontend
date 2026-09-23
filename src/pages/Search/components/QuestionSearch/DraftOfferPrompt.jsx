/** Asks whether the composed job (missing from the database) should be added, with accept, decline and edit buttons. */
import { DatabasePlusIcon } from "@components/icons";
import Button from "@components/ui/Button";

export default function DraftOfferPrompt({ draft }) {
  const isWaiting = draft.isFiling || draft.areOwnersLoading;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-l from-indigo-50/80 via-white to-white p-4 md:p-5 flex items-center gap-4 flex-wrap">
      <span
        aria-hidden="true"
        className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                   shadow-md shadow-indigo-600/25 flex items-center justify-center shrink-0"
      >
        <DatabasePlusIcon className="w-5 h-5" />
      </span>
      <p className="flex-1 min-w-[14rem] text-sm text-slate-700 leading-7 m-0">
        با توجه به اینکه شغل تحلیل‌شده در پایگاه داده سامانه نیست، آیا تمایل به اضافه کردن آن به
        پایگاه داده را دارید؟
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="success" size="md" onClick={draft.ownerChoice.open} disabled={isWaiting}>
          پذیرش
        </Button>
        <Button variant="danger-outline" size="md" onClick={draft.decline} disabled={draft.isFiling}>
          رد
        </Button>
        <Button variant="outline" size="md" onClick={draft.startEditing} disabled={isWaiting}>
          ویرایش
        </Button>
      </div>
    </div>
  );
}
