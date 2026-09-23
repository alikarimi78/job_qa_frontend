/** Collapses a field's item list to its preview length and lets the user expand it to show everything. */
import useToggle from "@hooks/useToggle";

export default function useExpandableItems(field) {
  const [isExpanded, toggleExpanded] = useToggle(false);
  const previewLength = field.preview > 0 ? field.preview : field.items.length;
  const visibleItems = isExpanded ? field.items : field.items.slice(0, previewLength);

  return {
    isExpanded,
    toggleExpanded,
    visibleItems,
    hiddenCount: field.items.length - visibleItems.length,
    canCollapse: field.items.length > previewLength,
  };
}
