/** "Monthly growth" card: new accounts (and, in the global view, new organizations) per month, with 6/12-month range buttons. */
import { TrendingUpIcon } from "@components/icons";
import Button from "@components/ui/Button";
import { PRIMARY_THEME } from "@constants/accentThemes";
import { faNumber } from "@utils/numbers";
import { MONTH_RANGE_OPTIONS } from "../../constants";
import { useGrowthSeries } from "../../hooks/useChartSeries";
import MonthlyBars from "../charts/MonthlyBars";
import StatsCard from "../StatsCard";
import { cardHeading } from "../cardHeading";

function GrowthChart({ stats, months }) {
  const series = useGrowthSeries(stats, months);
  return <MonthlyBars months={months} series={series} />;
}

function MonthRangeButtons({ monthRange, onChange }) {
  return MONTH_RANGE_OPTIONS.map((count) => (
    <Button
      key={count}
      variant={monthRange === count ? "primary" : "outline"}
      size="sm"
      onClick={() => onChange(count)}
    >
      {faNumber(count)} ماه
    </Button>
  ));
}

export default function MonthlyGrowthSection({ organizations, months, monthRange, onMonthRangeChange }) {
  return (
    <StatsCard
      title="رشد ماهانه"
      hint="تعداد رکوردهای جدید در هر ماه"
      organizations={organizations}
      {...cardHeading(PRIMARY_THEME, TrendingUpIcon)}
      actions={<MonthRangeButtons monthRange={monthRange} onChange={onMonthRangeChange} />}
    >
      {(stats) => <GrowthChart stats={stats} months={months} />}
    </StatsCard>
  );
}
