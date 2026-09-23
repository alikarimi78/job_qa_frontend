/** The job-analysis page: a tab switch between asking a question, the advanced profile search, and the starred analyses. */
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import AdvancedSearch from "./components/AdvancedSearch/AdvancedSearch";
import QuestionSearch from "./components/QuestionSearch/QuestionSearch";
import SavedSearches from "./components/SavedSearches/SavedSearches";
import { SEARCH_TAB_OPTIONS, SEARCH_TABS } from "./constants";
import useSearchTab from "./hooks/useSearchTab";

export default function SearchPage() {
  const [activeTab, selectTab] = useSearchTab();

  return (
    <>
      <div className="flex justify-center">
        <SegmentedSwitch
          options={SEARCH_TAB_OPTIONS}
          value={activeTab}
          onChange={selectTab}
          label="نوع تحلیل"
        />
      </div>

      {activeTab === SEARCH_TABS.advanced && <AdvancedSearch />}
      {activeTab === SEARCH_TABS.saved && <SavedSearches />}
      {activeTab === SEARCH_TABS.simple && <QuestionSearch />}
    </>
  );
}
