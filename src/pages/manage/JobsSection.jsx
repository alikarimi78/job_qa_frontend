import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";

const glyph = (path) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

const Briefcase = glyph(
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
  </>
);

const Shield = glyph(
  <>
    <path d="M12 3l7 3v6c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </>
);

// The corpus and the queue that feeds it, the two halves of «مدیریت مشاغل»: what a search can already
// reach, and what is waiting to be admitted to it. Both are open to an org_admin, each scoped to their
// own organization by the server.
const TABS = [
  { path: "", label: "لیست مشاغل", icon: Briefcase },
  { path: "reviews", label: "بررسی پیشنهادها", icon: Shield },
];

export default function JobsSection() {
  const me = useOutletContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = pathname.startsWith("/manage/jobs/reviews") ? "reviews" : "";

  return (
    <>
      <div className="flex justify-center">
        <SegmentedSwitch
          options={TABS.map((tab) => [tab.path, tab.label, tab.icon])}
          value={current}
          onChange={(path) => navigate(`/manage/jobs/${path}`)}
          label="بخش‌های مدیریت مشاغل"
        />
      </div>

      <Outlet context={me} />
    </>
  );
}
