/** "Organization-only jobs per organization" card (global stats); hidden when no organization has its own jobs. */
import { BuildingIcon } from "@components/icons";
import Card from "@components/ui/Card";
import { ACCENT_THEMES } from "@constants/accentThemes";
import useOrganizationJobRows from "../../hooks/useOrganizationJobRows";
import CategoryBars from "../charts/CategoryBars";
import { CHART_COLORS } from "../charts/chartTheme";
import { cardHeading } from "../cardHeading";

export default function OrganizationJobsSection() {
  const rows = useOrganizationJobRows();
  if (!rows.length) return null;

  return (
    <Card
      title="مشاغل اختصاصی به تفکیک سازمان"
      hint="رکوردهای تاییدشده‌ای که تنها در نتایج تحلیل همان سازمان دیده می‌شوند"
      {...cardHeading(ACCENT_THEMES.sky, BuildingIcon)}
    >
      <CategoryBars rows={rows} valueLabel="شغل" color={CHART_COLORS.sky} />
    </Card>
  );
}
