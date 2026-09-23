/** "Job suggestions per month" card, counted by the date each suggestion was filed. */
import { LightbulbIcon } from "@components/icons";
import { ACCENT_THEMES } from "@constants/accentThemes";
import { useSuggestionSeries } from "../../hooks/useChartSeries";
import MonthlyBars from "../charts/MonthlyBars";
import StatsCard from "../StatsCard";
import { cardHeading } from "../cardHeading";

const CHART_HEIGHT = 220;

function SuggestionsChart({ stats, months }) {
  const series = useSuggestionSeries(stats, months);
  return <MonthlyBars months={months} series={series} height={CHART_HEIGHT} />;
}

export default function MonthlySuggestionsSection({ organizations, months }) {
  return (
    <StatsCard
      title="پیشنهادهای شغلی در هر ماه"
      hint="بر پایه تاریخ ثبت پیشنهاد"
      organizations={organizations}
      {...cardHeading(ACCENT_THEMES.emerald, LightbulbIcon)}
    >
      {(stats) => <SuggestionsChart stats={stats} months={months} />}
    </StatsCard>
  );
}
