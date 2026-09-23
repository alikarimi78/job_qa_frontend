/** Which tab of the suggestions page is showing, kept in the URL as `?tab=mine` (the "new" tab is the default). */
import useSearchParamState from "@hooks/useSearchParamState";
import { SUGGESTION_TABS } from "../constants";

const ALLOWED_TABS = Object.values(SUGGESTION_TABS);

export default function useSuggestionsTab() {
  return useSearchParamState("tab", ALLOWED_TABS, SUGGESTION_TABS.new);
}
