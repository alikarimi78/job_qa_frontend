import { useSearchParams } from "react-router-dom";
import ModeSwitch from "@components/search/ModeSwitch";
import QuestionSearch from "@components/search/QuestionSearch";
import AdvancedSearch from "@components/search/AdvancedSearch";
import SavedSearches from "@components/search/SavedSearches";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const asked = params.get("mode");
  const mode = asked === "advanced" || asked === "saved" ? asked : "simple";

  const choose = (next) =>
    setParams(next === "simple" ? {} : { mode: next }, { replace: true });

  return (
    <>
      <div className="flex justify-center">
        <ModeSwitch value={mode} onChange={choose} />
      </div>

      {mode === "advanced" && <AdvancedSearch />}
      {mode === "saved" && <SavedSearches />}
      {mode === "simple" && <QuestionSearch />}
    </>
  );
}
