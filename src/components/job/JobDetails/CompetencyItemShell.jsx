/** Frame of one competency (skills, knowledge or abilities) inside the competency block. Shared by the read-only view and the editor. */
import { fieldLabel } from "@constants/fieldLabels";
import FieldIconBadge from "../FieldIconBadge";
import { competencyTheme } from "./competencyTheme";
import { fieldBorderClass } from "./fieldBorder";
import RelevantPill from "./RelevantPill";

export default function CompetencyItemShell({ fieldKey, label, primary, count, aside, invalid, children }) {
  const theme = competencyTheme();
  const border = fieldBorderClass({
    isInvalid: invalid,
    isPrimary: primary,
    theme,
    plainBorder: "border-slate-200/70",
  });

  return (
    <div
      className={`@container flex flex-col gap-3 min-w-0 rounded-xl border bg-white p-3.5 shadow-sm shadow-slate-900/5 ${border}`}
    >
      <div className="flex items-start gap-2.5">
        <FieldIconBadge fieldKey={fieldKey} theme={theme} size="md" />
        <div className="min-w-0 flex-1">
          <h5 className="text-[13px] font-bold text-slate-800 m-0 leading-6">
            {fieldLabel(fieldKey, label)}
          </h5>
          {count && <p className="text-[11px] text-slate-500 m-0 leading-5">{count}</p>}
        </div>
        {aside}
      </div>
      {primary && (
        <div>
          <RelevantPill theme={theme} />
        </div>
      )}
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}
