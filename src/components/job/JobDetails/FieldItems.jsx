/** Body of a field box: prose for text fields, otherwise the item list (or career path), the "show N more" button, and clickable aliases when the caller can swap the job title. */
import { SwapIcon } from "@components/icons";
import { faNumber } from "@utils/numbers";
import CareerPath from "./CareerPath";
import LineBullet from "./LineBullet";
import { ITEM_LIST_CLASS } from "./itemListStyle";

function AliasButton({ alias, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(alias)}
      title={`جایگزینی عنوان شغل با «${alias}»`}
      className="group inline-flex items-start gap-1.5 text-start cursor-pointer rounded-md -mx-1 px-1
                 transition-colors duration-200 hover:bg-slate-100 focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      {alias}
      <span className="mt-2 text-slate-400 group-hover:text-slate-600">
        <SwapIcon className="w-3 h-3 shrink-0" />
      </span>
    </button>
  );
}

function ShowMoreButton({ hiddenCount, theme, onClick }) {
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onClick}
        className={`rounded-full px-3 py-1 text-[12px] leading-6 border border-dashed bg-white/70 cursor-pointer
                    transition-colors duration-200 focus:outline-none focus-visible:ring-2
                    focus-visible:ring-blue-500/40 ${theme.moreButton}`}
      >
        نمایش {faNumber(hiddenCount)} مورد دیگر
      </button>
    </div>
  );
}

export default function FieldItems({
  field,
  theme,
  visibleItems,
  hiddenCount,
  onExpand,
  jobTitle,
  onPickAlias,
}) {
  if (!field.items.length) return <p className="leading-8 m-0 text-slate-700">{field.value}</p>;
  const canPickAlias = field.key === "aliases" && Boolean(onPickAlias);

  return (
    <>
      {field.key === "career_path_next" ? (
        <CareerPath root={jobTitle} steps={visibleItems} theme={theme} />
      ) : (
        <ul className={ITEM_LIST_CLASS}>
          {visibleItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5 leading-7">
              <LineBullet theme={theme} />
              {canPickAlias ? <AliasButton alias={item} onPick={onPickAlias} /> : <span>{item}</span>}
            </li>
          ))}
        </ul>
      )}
      {canPickAlias && (
        <p className="text-[11px] text-slate-500 mt-2.5 mb-0 leading-5">
          برای جایگزینی عنوان شغل با هر یک از نام‌های دیگر، روی آن کلیک نمایید.
        </p>
      )}
      {hiddenCount > 0 && (
        <ShowMoreButton hiddenCount={hiddenCount} theme={theme} onClick={onExpand} />
      )}
    </>
  );
}
