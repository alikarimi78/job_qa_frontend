/** Settings section: a tab switch (organizations, accounts) showing only the tabs the role may open, with the chosen tab's page below. */
import { Outlet, useOutletContext } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import useRouteTabs from "@hooks/useRouteTabs";
import { SETTINGS_BASE_PATH, settingsTabsFor } from "./constants";

export default function SettingsLayout() {
  const currentUser = useOutletContext();
  const tabs = settingsTabsFor(currentUser.role);
  const { activeTab, selectTab } = useRouteTabs(SETTINGS_BASE_PATH, tabs);

  return (
    <>
      {tabs.length > 1 && (
        <div className="flex justify-center">
          <SegmentedSwitch
            options={tabs.map((tab) => ({ value: tab.path, label: tab.label, icon: tab.icon }))}
            value={activeTab}
            onChange={selectTab}
            label="بخش‌های تنظیمات"
          />
        </div>
      )}

      <Outlet context={currentUser} />
    </>
  );
}
