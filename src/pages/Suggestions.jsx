import { useSearchParams } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import NewSuggestion from "@components/suggestions/NewSuggestion";
import MySuggestions from "@components/suggestions/MySuggestions";

// «پیشنهادها» is one page with two halves: the form that files a record, and the list of
// what has been filed and what became of it. They were two sidebar items and two routes,
// and briefly a parent with two children under it — the customer asked for neither: it is
// one errand, so it is one entry in the navigation and one page, with the halves as a
// switch on the page itself. The same shape `pages/Search.jsx` already has.
//
// The half lives in the query string rather than in state, so `/suggestions?tab=mine` is
// a link someone can send — and it is what the old `/my-suggestions` bookmark redirects to.

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

  // `replace`, so switching back and forth does not fill the back button with tabs.
  const choose = (next) =>
    setParams(next === "mine" ? { tab: "mine" } : {}, { replace: true });

  return (
    <>
      <div className="flex justify-center">
        <SegmentedSwitch options={TABS} value={tab} onChange={choose} label="بخش پیشنهادها" />
      </div>

      {/* Both are mounted and one is hidden — the opposite of `pages/Search.jsx`, and for
          a reason that is this page's own: the form is ten columns of typing, and someone
          who steps over to check the state of an earlier suggestion must not come back to
          an empty record. The list is a cached query either way. */}
      <div className={tab === "new" ? "" : "hidden"}>
        <NewSuggestion />
      </div>
      <div className={tab === "mine" ? "" : "hidden"}>
        <MySuggestions />
      </div>
    </>
  );
}
