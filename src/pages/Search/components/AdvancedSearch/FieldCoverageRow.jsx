/** One profile field inside a ranked job: its name and coverage percentage beside the chips of found, missing and unknown items. */
import FieldIconBadge from "@components/job/FieldIconBadge";
import { fieldLabel } from "@constants/fieldLabels";
import { faPercent } from "@utils/numbers";
import { FoundChip, MissingChip, UnknownChip } from "./CoverageChip";

export default function FieldCoverageRow({ field }) {
  const foundIn = field.found_in ?? {};
  const enteredCount = field.matched.length + field.missing.length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3">
      <div className="flex items-center gap-2.5 sm:w-52 shrink-0">
        <FieldIconBadge fieldKey={field.key} size="sm" />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-slate-700 m-0 leading-5">
            {fieldLabel(field.key, field.label)}
          </p>
          <p className="text-[11px] text-slate-500 m-0 leading-5">
            {enteredCount > 0 ? `پوشش ${faPercent(field.ratio)}` : "خارج از واژگان"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 sm:pt-0.5">
        {field.matched.map((item, index) => (
          <FoundChip key={`found-${index}`} item={item} foundInColumn={foundIn[item]} />
        ))}
        {field.missing.map((item, index) => (
          <MissingChip key={`missing-${index}`} item={item} />
        ))}
        {(field.unknown ?? []).map((item, index) => (
          <UnknownChip key={`unknown-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}
