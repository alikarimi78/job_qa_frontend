/** Read-only view of one competency inside the competency block, with a collapsible item list. */
import CompetencyItemShell from "./CompetencyItemShell";
import { competencyTheme } from "./competencyTheme";
import ExpandButton from "./ExpandButton";
import FieldItems from "./FieldItems";
import { itemCountText } from "./itemCountText";
import useExpandableItems from "./useExpandableItems";

export default function CompetencyCard({ field }) {
  const theme = competencyTheme();
  const { isExpanded, toggleExpanded, visibleItems, hiddenCount, canCollapse } =
    useExpandableItems(field);

  return (
    <CompetencyItemShell
      fieldKey={field.key}
      label={field.label}
      primary={field.primary}
      count={itemCountText(field, visibleItems)}
      aside={
        canCollapse && (
          <ExpandButton
            isExpanded={isExpanded}
            total={field.items.length}
            theme={theme}
            onToggle={toggleExpanded}
            compact
          />
        )
      }
    >
      <FieldItems
        field={field}
        theme={theme}
        visibleItems={visibleItems}
        hiddenCount={hiddenCount}
        onExpand={toggleExpanded}
      />
    </CompetencyItemShell>
  );
}
