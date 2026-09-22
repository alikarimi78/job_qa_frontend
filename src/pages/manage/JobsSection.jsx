import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import { icon } from "@components/ui/icon";


const Briefcase = icon(
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18" />
  </>
);

const Shield = icon(
  <>
    <path d="M12 3l7 3v6c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </>
);

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
