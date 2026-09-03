import { useSearchParams } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import NewSuggestion from "@components/suggestions/NewSuggestion";
import MySuggestions from "@components/suggestions/MySuggestions";


const Plus = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const List = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const TABS = [
  ["new", "پیشنهاد شغل جدید", Plus],
  ["mine", "پیشنهادهای من", List],
];

export default function Suggestions() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "mine" ? "mine" : "new";

  const choose = (next) =>
    setParams(next === "mine" ? { tab: "mine" } : {}, { replace: true });

  return (
    <>
      <div className="flex justify-center">
        <SegmentedSwitch options={TABS} value={tab} onChange={choose} label="بخش پیشنهادها" />
      </div>

      <div className={tab === "new" ? "" : "hidden"}>
        <NewSuggestion />
      </div>
      <div className={tab === "mine" ? "" : "hidden"}>
        <MySuggestions />
      </div>
    </>
  );
}
