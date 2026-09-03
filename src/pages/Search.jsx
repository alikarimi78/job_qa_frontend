import { useSearchParams } from "react-router-dom";
import ModeSwitch from "@components/search/ModeSwitch";
import QuestionSearch from "@components/search/QuestionSearch";
import AdvancedSearch from "@components/search/AdvancedSearch";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const mode = params.get("mode") === "advanced" ? "advanced" : "simple";

  const choose = (next) =>
    setParams(next === "advanced" ? { mode: "advanced" } : {}, { replace: true });

  return (
    <>
      <div className="flex justify-center">
        <ModeSwitch value={mode} onChange={choose} />
      </div>

      {mode === "advanced" ? <AdvancedSearch /> : <QuestionSearch />}
    </>
  );
}
