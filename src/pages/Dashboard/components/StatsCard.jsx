/** Dashboard card that loads the stats for its own organization filter and renders `children(stats)` once they arrive (dimmed while refreshing, an error box on failure). */
import OrganizationSelect from "@components/OrganizationSelect";
import Card from "@components/ui/Card";
import ErrorAlert from "@components/ui/ErrorAlert";
import Loader from "@components/ui/Loader";
import useOrganizationStats from "../hooks/useOrganizationStats";

function StatsBody({ stats, error, isFetching, children }) {
  if (error) return <ErrorAlert error={error} />;
  if (!stats) return <Loader />;
  return (
    <div className={isFetching ? "opacity-60 transition-opacity duration-150" : undefined}>
      {children(stats)}
    </div>
  );
}

export default function StatsCard({ organizations, actions, children, ...cardProps }) {
  const { stats, error, isFetching, organizationFilter, setOrganizationFilter } =
    useOrganizationStats();

  const organizationSelect = organizations && (
    <OrganizationSelect
      value={organizationFilter}
      onChange={setOrganizationFilter}
      organizations={organizations}
      allLabel="همه سازمان‌ها"
    />
  );

  return (
    <Card
      {...cardProps}
      actions={
        (actions || organizationSelect) && (
          <>
            {actions}
            {organizationSelect}
          </>
        )
      }
    >
      <StatsBody stats={stats} error={error} isFetching={isFetching}>
        {children}
      </StatsBody>
    </Card>
  );
}
