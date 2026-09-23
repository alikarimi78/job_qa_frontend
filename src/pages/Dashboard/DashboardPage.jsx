/** Admin dashboard: overview tiles, monthly growth, account breakdowns, the state of the job database and monthly suggestions — each card filterable by organization for a super admin. */
import PageToolbar from "@components/ui/PageToolbar";
import AccountsSection from "./components/sections/AccountsSection";
import JobDatabaseSection from "./components/sections/JobDatabaseSection";
import MonthlyGrowthSection from "./components/sections/MonthlyGrowthSection";
import MonthlySuggestionsSection from "./components/sections/MonthlySuggestionsSection";
import OrganizationJobsSection from "./components/sections/OrganizationJobsSection";
import OverviewSection from "./components/sections/OverviewSection";
import useDashboard from "./hooks/useDashboard";

export default function DashboardPage() {
  const { isSuperAdmin, filterOrganizations, monthRange, setMonthRange, months } = useDashboard();

  return (
    <>
      <PageToolbar title="پیشخوان مدیریت" />

      <OverviewSection organizations={filterOrganizations} isSuperAdmin={isSuperAdmin} />
      <MonthlyGrowthSection
        organizations={filterOrganizations}
        months={months}
        monthRange={monthRange}
        onMonthRangeChange={setMonthRange}
      />
      <AccountsSection organizations={filterOrganizations} isSuperAdmin={isSuperAdmin} />
      <JobDatabaseSection organizations={filterOrganizations} isSuperAdmin={isSuperAdmin} />
      <OrganizationJobsSection />
      <MonthlySuggestionsSection organizations={filterOrganizations} months={months} />
    </>
  );
}
