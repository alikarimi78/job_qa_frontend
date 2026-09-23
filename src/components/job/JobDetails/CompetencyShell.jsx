/** The "job competencies" box that lays out skills, knowledge and abilities side by side. Shared by the read-only view and the editor. */
import { AwardIcon } from "@components/icons";
import IconBadge from "@components/ui/IconBadge";
import { competencyTheme } from "./competencyTheme";

const TITLE = "شایستگی‌های شغلی";
const HINT = "مهارت‌ها، دانش و توانایی‌های لازم برای این شغل";
const COLUMNS_BY_COUNT = { 1: "", 2: "@2xl:grid-cols-2", 3: "@2xl:grid-cols-3" };

export default function CompetencyShell({ size, children }) {
  const theme = competencyTheme();

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5 overflow-hidden">
      <header className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-l ${theme.headerGradient} to-white`}>
        <IconBadge theme={theme} icon={AwardIcon} />
        <div className="min-w-0 flex-1">
          <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">{TITLE}</h4>
          <p className="text-xs text-slate-500 m-0 leading-5">{HINT}</p>
        </div>
      </header>

      <div className={`@container ${theme.bodyBackground} p-3 sm:p-4`}>
        <div className={`grid grid-cols-1 gap-3 ${COLUMNS_BY_COUNT[size]}`}>{children}</div>
      </div>
    </section>
  );
}
