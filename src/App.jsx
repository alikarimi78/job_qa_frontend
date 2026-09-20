import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "@store/hooks";
import { ADMIN_ROLES } from "@routes/roles";
import { landingPath } from "@routes/landing";
import MainLayout from "@components/layout/MainLayout";
import Search from "@pages/Search";
import Login from "@pages/Login";
import Suggestions from "@pages/Suggestions";
import Admin from "@pages/Admin";
import JobsSection from "@pages/manage/JobsSection";
import ManageLayout from "@pages/manage/ManageLayout";
import Dashboard from "@pages/manage/Dashboard";
import Organizations from "@pages/manage/Organizations";
import Accounts from "@pages/manage/Accounts";
import Jobs from "@pages/manage/Jobs";
import Settings, { SettingsIndex } from "@pages/Settings";

function Protected({ children, roles }) {
  const token = useAppSelector((state) => state.auth.token);
  const role = useAppSelector((state) => state.auth.role);
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function Landing() {
  const role = useAppSelector((state) => state.auth.role);
  return <Navigate to={landingPath(role)} replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <Protected>
              <MainLayout />
            </Protected>
          }
        >
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/analyze" element={<Navigate to="/search?mode=advanced" replace />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/suggest" element={<Navigate to="/suggestions" replace />} />
          <Route
            path="/my-suggestions"
            element={<Navigate to="/suggestions?tab=mine" replace />}
          />
          <Route
            path="/manage"
            element={
              <Protected roles={ADMIN_ROLES}>
                <ManageLayout />
              </Protected>
            }
          >
            <Route index element={<Navigate to="/manage/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="organizations"
              element={<Navigate to="/settings/organizations" replace />}
            />
            <Route path="users" element={<Navigate to="/settings/accounts" replace />} />
            <Route path="accounts" element={<Navigate to="/settings/accounts" replace />} />
            <Route path="jobs" element={<JobsSection />}>
              <Route index element={<Jobs />} />
              <Route path="reviews" element={<Admin />} />
            </Route>
          </Route>
          <Route
            path="/settings"
            element={
              <Protected roles={ADMIN_ROLES}>
                <ManageLayout />
              </Protected>
            }
          >
            <Route element={<Settings />}>
              <Route index element={<SettingsIndex />} />
              <Route
                path="organizations"
                element={
                  <Protected roles={["super_admin"]}>
                    <Organizations />
                  </Protected>
                }
              />
              <Route path="accounts" element={<Accounts />} />
              <Route path="reviews" element={<Navigate to="/manage/jobs/reviews" replace />} />
            </Route>
          </Route>
          <Route path="/admin" element={<Navigate to="/manage/jobs/reviews" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 99999999 }}
        toastOptions={{ style: { zIndex: 99999999 } }}
      />
    </>
  );
}
