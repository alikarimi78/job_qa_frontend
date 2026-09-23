/** The personal-analysis page: suggest a new job or follow your earlier suggestions. Both tabs stay mounted so switching keeps a half-filled form. */
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import MySuggestions from "./components/MySuggestions";
import NewSuggestion from "./components/NewSuggestion";
import { SUGGESTION_TAB_OPTIONS, SUGGESTION_TABS } from "./constants";
import useSuggestionsTab from "./hooks/useSuggestionsTab";

export default function SuggestionsPage() {
  const [activeTab, selectTab] = useSuggestionsTab();

  return (
    <>
      <div className="flex justify-center">
        <SegmentedSwitch
          options={SUGGESTION_TAB_OPTIONS}
          value={activeTab}
          onChange={selectTab}
          label="بخش پیشنهادها"
        />
      </div>

      <div className={activeTab === SUGGESTION_TABS.new ? "" : "hidden"}>
        <NewSuggestion />
      </div>
      <div className={activeTab === SUGGESTION_TABS.mine ? "" : "hidden"}>
        <MySuggestions />
      </div>
    </>
  );
}
