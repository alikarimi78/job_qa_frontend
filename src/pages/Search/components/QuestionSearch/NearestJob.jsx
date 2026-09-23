/** Names the closest job the database does have, with a button that opens its full details. */
import { CompassIcon } from "@components/icons";
import JobDetails from "@components/job/JobDetails/JobDetails";
import ToggleChevron from "@components/ui/ToggleChevron";

export default function NearestJob({ job, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-l from-slate-50 to-white p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span
          aria-hidden="true"
          className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"
        >
          <CompassIcon className="w-5 h-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500 m-0 leading-5">نزدیک‌ترین شغل موجود در پایگاه داده</p>
          <p className="text-sm font-bold text-slate-800 m-0 leading-7">{job.job_title}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          title={`نمایش اطلاعات «${job.job_title}»`}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-slate-200
                     bg-white text-xs font-medium text-slate-700 cursor-pointer
                     transition-colors duration-200
                     hover:bg-slate-800 hover:text-white hover:border-slate-800
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {isOpen ? "بستن اطلاعات" : "مشاهده اطلاعات"}
          <ToggleChevron isOpen={isOpen} />
        </button>
      </div>

      {isOpen && (
        <JobDetails details={[job]} title={`اطلاعات «${job.job_title}»`} className="mt-5" />
      )}
    </div>
  );
}
