import { Navigate, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import SegmentedSwitch from "@components/ui/SegmentedSwitch";
import { ADMIN_ROLES, hasRole } from "@routes/roles";
import { icon } from "@components/ui/icon";


const Building = icon(
  <>
    <path d="M3 21h18" />
    <path d="M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16" />
    <path d="M19 21V11a2 2 0 00-2-2h-2" />
    <path d="M9 7h2M9 11h2M9 15h2" />
  </>
);

const Users = icon(
  <>
    <path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87" />
  </>
);

const TABS = [
  { path: "organizations", label: "مدیریت سازمان‌ها", icon: Building, roles: ["super_admin"] },
  { path: "accounts", label: "مدیریت کاربران", icon: Users, roles: ADMIN_ROLES },
];

const tabsFor = (role) => TABS.filter((tab) => hasRole(role, tab.roles));

export function SettingsIndex() {
  const me = useOutletContext();
  return <Navigate to={tabsFor(me.role)[0].path} replace />;
}

export default function Settings() {
  const me = useOutletContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tabs = tabsFor(me.role);
  const current = tabs.find((tab) => pathname.startsWith(`/settings/${tab.path}`))?.path;

  return (
    <>
      {tabs.length > 1 && (
        <div className="flex justify-center">
          <SegmentedSwitch
            options={tabs.map((tab) => [tab.path, tab.label, tab.icon])}
            value={current}
            onChange={(path) => navigate(`/settings/${path}`)}
            label="بخش‌های تنظیمات"
          />
        </div>
      )}

      <Outlet context={me} />
    </>
  );
}
