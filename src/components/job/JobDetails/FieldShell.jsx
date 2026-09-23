/** Frame of a single field box: tinted header with the field's icon, title, count and optional side control, then the body. Shared by the read-only view and the editor. */
import { fieldLabel } from "@constants/fieldLabels";
import FieldIconBadge from "../FieldIconBadge";
import { fieldTheme } from "../fieldTheme";
import { fieldBorderClass } from "./fieldBorder";
import RelevantPill from "./RelevantPill";

export default function FieldShell({ fieldKey, label, primary, count, aside, invalid, children }) {
  const theme = fieldTheme(fieldKey);
  const border = fieldBorderClass({
    isInvalid: invalid,
    isPrimary: primary,
    theme,
    plainBorder: "border-slate-200/80",
  });

  return (
    <section
      className={`rounded-2xl border bg-white shadow-sm shadow-slate-900/5 overflow-hidden ${border}`}
    >
      <header className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-l ${theme.headerGradient} to-white`}>
        <FieldIconBadge fieldKey={fieldKey} theme={theme} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
            <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">
              {fieldLabel(fieldKey, label)}
            </h4>
            {primary && <RelevantPill theme={theme} />}
          </div>
          {count && <p className="text-xs text-slate-500 m-0 leading-5">{count}</p>}
        </div>
        {aside}
      </header>

      <div className="px-4 pt-2 pb-4 text-sm text-slate-700">{children}</div>
    </section>
  );
}
