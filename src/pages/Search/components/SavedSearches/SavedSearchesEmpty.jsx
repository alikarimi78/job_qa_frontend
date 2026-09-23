/** Shown in the starred tab before anything has been starred, explaining how to star an analysis. */
import { StarIcon } from "@components/icons";

export default function SavedSearchesEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span
        aria-hidden="true"
        className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center"
      >
        <StarIcon className="w-5 h-5" />
      </span>
      <p className="text-sm text-slate-600 m-0 leading-7 max-w-md">
        هنوز تحلیلی را ستاره‌دار نکرده‌اید. پس از هر تحلیل، با دکمه «ستاره‌دار کردن» آن را
        همین‌جا نگه دارید تا بعداً بدون تحلیل دوباره در دسترس باشد.
      </p>
    </div>
  );
}
