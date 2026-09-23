/** Job management section: a tab switch between the job list and the suggestion reviews, with the chosen tab's page below. */
import { Outlet, useOutletContext } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import useRouteTabs from "@hooks/useRouteTabs";
import { MANAGE_JOBS_BASE_PATH, MANAGE_JOBS_TABS } from "./constants";

const TAB_OPTIONS = MANAGE_JOBS_TABS.map((tab) => ({
  value: tab.path,
  label: tab.label,
  icon: tab.icon,
}));

export default function ManageJobsLayout() {
  const currentUser = useOutletContext();
  const { activeTab, selectTab } = useRouteTabs(MANAGE_JOBS_BASE_PATH, MANAGE_JOBS_TABS);

  return (
    <>
      <div className="flex justify-center">
        <SegmentedSwitch
          options={TAB_OPTIONS}
          value={activeTab}
          onChange={selectTab}
          label="بخش‌های مدیریت مشاغل"
        />
      </div>

      <Outlet context={currentUser} />
    </>
  );
}
