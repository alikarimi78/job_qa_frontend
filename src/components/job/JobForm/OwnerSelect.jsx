/** Pill-shaped select beside the job title choosing who sees the job: everyone (public) or one organization. */
import { useController } from "react-hook-form";
import { ChevronDownIcon } from "@components/icons";
import { PUBLIC_OWNER } from "@constants/organizationScope";

const PUBLIC_STYLE = "bg-slate-100 text-slate-600 border-slate-200";
const ORGANIZATION_STYLE = "bg-blue-50 text-blue-700 border-blue-200";

export default function OwnerSelect({ owners, allowPublic }) {
  const { field } = useController({ name: "organization_id" });
  const colors = field.value === PUBLIC_OWNER ? PUBLIC_STYLE : ORGANIZATION_STYLE;

  return (
    <span className="relative inline-flex shrink-0">
      <select
        value={field.value}
        onChange={field.onChange}
        aria-label="دامنه شغل"
        title="شغل عمومی در نتایج تحلیل تمامی سازمان‌ها دیده می‌شود؛ شغل اختصاصی تنها برای کاربران همان سازمان"
        className={`appearance-none rounded-full border ps-3 pe-7 py-0.5 text-xs font-medium leading-6
                    cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${colors}`}
      >
        {allowPublic && <option value={PUBLIC_OWNER}>عمومی — همه سازمان‌ها</option>}
        {owners.map((organization) => (
          <option key={organization.id} value={String(organization.id)}>
            اختصاصی — {organization.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center opacity-70">
        <ChevronDownIcon className="w-3 h-3" strokeWidth={2.5} />
      </span>
    </span>
  );
}
