/** The first few aliases of a job as small chips, followed by "+N" for the rest. */
import { itemsFromCell } from "@utils/itemCells";
import { faNumber } from "@utils/numbers";
import { VISIBLE_ALIAS_COUNT } from "../constants";

export default function AliasChips({ aliasesCell }) {
  const aliases = itemsFromCell(aliasesCell);
  if (!aliases.length) return <span className="text-sm text-slate-400">—</span>;

  const visibleAliases = aliases.slice(0, VISIBLE_ALIAS_COUNT);
  const hiddenCount = aliases.length - visibleAliases.length;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visibleAliases.map((alias) => (
        <span
          key={alias}
          className="bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5 text-xs text-slate-600"
        >
          {alias}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="text-xs text-slate-400 fa-nums">+{faNumber(hiddenCount)}</span>
      )}
    </div>
  );
}
