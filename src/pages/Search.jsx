import { useSearchParams } from "react-router-dom";
import ModeSwitch from "@components/search/ModeSwitch";
import QuestionSearch from "@components/search/QuestionSearch";
import AdvancedSearch from "@components/search/AdvancedSearch";

// «جستجوی شغل» is one section with two modes now. They were two sidebar items and two
// routes; the customer asked for one entry, with the advanced mode a button beside the
// plain one — it is the same question asked either as a sentence or as a list of what
// the person can do, so it is a setting of this page rather than a place of its own.
//
// The mode lives in the query string, not in state: `/search?mode=advanced` is what the
// old `/analyze` bookmark now redirects to, and it is a link someone can send.
export default function Search() {
  const [params, setParams] = useSearchParams();
  const mode = params.get("mode") === "advanced" ? "advanced" : "simple";

  // `replace`, so switching back and forth does not fill the back button with modes.
  const choose = (next) =>
    setParams(next === "advanced" ? { mode: "advanced" } : {}, { replace: true });

  return (
    <>
      <div className="flex justify-center">
        <ModeSwitch value={mode} onChange={choose} />
      </div>

      {/* Mounted one at a time on purpose: each owns its own result, and a mode switch
          is a fresh start rather than a tab hiding the other's answer. */}
      {mode === "advanced" ? <AdvancedSearch /> : <QuestionSearch />}
    </>
  );
}
