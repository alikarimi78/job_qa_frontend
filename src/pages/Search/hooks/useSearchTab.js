/** Which tab of the analysis page is showing (question, advanced or starred), kept in the URL as `?mode=`. */
import useSearchParamState from "@hooks/useSearchParamState";
import { SEARCH_TABS } from "../constants";

const ALLOWED_TABS = Object.values(SEARCH_TABS);

export default function useSearchTab() {
  return useSearchParamState("mode", ALLOWED_TABS, SEARCH_TABS.simple);
}
