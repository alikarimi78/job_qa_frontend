import { useSearchParams } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import { icon } from "@components/ui/icon";
import QuestionSearch from "@components/search/QuestionSearch";
import AdvancedSearch from "@components/search/AdvancedSearch";
import SavedSearches from "@components/search/SavedSearches";

const MODES = [
  ["simple", "تحلیل عمومی", icon(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </>
  )],
  ["advanced", "تحلیل پیشرفته", icon(
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  )],
  ["saved", "ستاره‌دارها", icon(
    <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
  )],
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const asked = params.get("mode");
  const mode = asked === "advanced" || asked === "saved" ? asked : "simple";

  const choose = (next) =>
    setParams(next === "simple" ? {} : { mode: next }, { replace: true });

  return (
    <>
      <div className="flex justify-center">
        <SegmentedSwitch options={MODES} value={mode} onChange={choose} label="نوع تحلیل" />
      </div>

      {mode === "advanced" && <AdvancedSearch />}
      {mode === "saved" && <SavedSearches />}
      {mode === "simple" && <QuestionSearch />}
    </>
  );
}
