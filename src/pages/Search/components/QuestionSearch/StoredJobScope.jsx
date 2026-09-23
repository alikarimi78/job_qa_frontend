/** Under the title of a job found in the database: whether it is public or belongs to one organization, and who therefore sees it. */
import { BuildingIcon, GlobeIcon } from "@components/icons";

const SCOPE_ICON_CLASS = "w-3.5 h-3.5 shrink-0";

export default function StoredJobScope({ organizationId, organizationName }) {
  const isPublic = organizationId == null;

  return (
    <div className="flex items-center gap-x-2 gap-y-1 flex-wrap mt-1.5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5
                    text-xs font-medium leading-5 ${
                      isPublic
                        ? "bg-slate-50 border-slate-200 text-slate-600"
                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }`}
      >
        {isPublic ? (
          <GlobeIcon className={SCOPE_ICON_CLASS} />
        ) : (
          <BuildingIcon className={SCOPE_ICON_CLASS} />
        )}
        {isPublic ? "شغل عمومی" : `شغل سازمانی - ${organizationName}`}
      </span>
      <span className="text-xs text-slate-500 leading-6">
        {isPublic
          ? "این شغل در نتایج تحلیل تمامی سازمان‌ها دیده می‌شود."
          : "این شغل تنها در نتایج تحلیل کاربران همین سازمان دیده می‌شود."}
      </span>
    </div>
  );
}
