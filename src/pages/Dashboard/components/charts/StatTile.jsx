/** Dashboard number tile: icon badge, label, a large Persian number and an optional hint; `tone` recolours it for warnings or muted values. */
import IconBadge from "@components/ui/IconBadge";
import { ACCENT_THEMES } from "@constants/accentThemes";
import { faNumber } from "@utils/numbers";

const TONE_THEMES = { warning: ACCENT_THEMES.orange, muted: ACCENT_THEMES.slate };
const TONE_TEXT = { warning: "text-amber-600", muted: "text-slate-500" };

export default function StatTile({ label, value, hint, tone, icon, theme }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3.5">
      <IconBadge theme={TONE_THEMES[tone] ?? theme} icon={icon} size="tile" />
      <div className="min-w-0 flex flex-col">
        <span className="text-xs text-slate-500 leading-6">{label}</span>
        <span className={`text-2xl font-bold leading-9 ${TONE_TEXT[tone] ?? "text-slate-900"}`}>
          {faNumber(value)}
        </span>
        {hint && <span className="text-[11px] text-slate-400 leading-5">{hint}</span>}
      </div>
    </div>
  );
}
