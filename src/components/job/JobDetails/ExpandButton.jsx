/** "Show all (N)" / "Show summary" button in a field's header; `compact` shortens the text in narrow boxes. */
import ToggleChevron from "@components/ui/ToggleChevron";
import { faNumber } from "@utils/numbers";

export default function ExpandButton({ isExpanded, total, theme, onToggle, compact = false }) {
  const fullText = isExpanded ? "نمایش خلاصه" : `مشاهده کامل (${faNumber(total)})`;
  const shortText = isExpanded ? "خلاصه" : `همه (${faNumber(total)})`;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      title={fullText}
      className={`inline-flex items-center gap-1 shrink-0 h-8 rounded-full border bg-white px-3
                  text-xs font-medium cursor-pointer transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${theme.toggleButton}`}
    >
      {compact ? (
        <>
          <span className="@xs:hidden">{shortText}</span>
          <span className="hidden @xs:inline">{fullText}</span>
        </>
      ) : (
        fullText
      )}
      <ToggleChevron isOpen={isExpanded} />
    </button>
  );
}
