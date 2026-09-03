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
import ManageLayout from "@pages/manage/ManageLayout";
import Dashboard from "@pages/manage/Dashboard";
import Organizations from "@pages/manage/Organizations";
import Accounts from "@pages/manage/Accounts";
import Jobs from "@pages/manage/Jobs";

function Protected({ children, roles }) {
  const token = useAppSelector((state) => state.auth.token);
  const role = useAppSelector((state) => state.auth.role);
  const location = useLocation();

  // Carry the attempted page so login can return the user to it: a session that expired
  // mid-errand comes back to where it was, instead of to wherever a fresh login lands.
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  // A convenience only: the API refuses the same calls regardless of what renders
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

// «/» is not a page any more, it is where a session opens: the dashboard for anyone who
// has one, the search for everyone else. Keeping it a redirect rather than pointing the
// root at one of the two means a reload of «/» lands where a fresh login does.
function Landing() {
  const role = useAppSelector((state) => state.auth.role);
  return <Navigate to={landingPath(role)} replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Every page but the login sits inside the shell */}
        <Route
          element={
            <Protected>
              <MainLayout />
            </Protected>
          }
        >
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          {/* Advanced search is no longer a destination of its own — it is the second
              mode of «جستجوی شغل», reached by the switch on that page. The old route is
              kept as a redirect that preselects it, so a bookmark still opens the thing
              it was pointing at. */}
          <Route path="/analyze" element={<Navigate to="/search?mode=advanced" replace />} />
          {/* «پیشنهادها» is one page with two halves — filing a record and following the
              ones already filed. They were two routes, so both old paths are kept as
              redirects onto the half they used to be. */}
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/suggest" element={<Navigate to="/suggestions" replace />} />
          <Route
            path="/my-suggestions"
            element={<Navigate to="/suggestions?tab=mine" replace />}
          />
          {/* One section per panel rather than one page stacking all of them. The
              layout resolves the caller once; each child is gated on the same roles
              the matching endpoints are, so a route nobody can use is never reachable
              even though the API is what actually refuses it. */}
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
              element={
                <Protected roles={["super_admin"]}>
                  <Organizations />
                </Protected>
              }
            />
            {/* «کاربران» was its own page until account creation moved into one
                dialog on /manage/accounts. The redirect is for a bookmark, and for
                the sidebar of a tab that was open across the change. */}
            <Route path="users" element={<Navigate to="/manage/accounts" replace />} />
            <Route path="accounts" element={<Accounts />} />
            {/* The corpus itself. Super-admin only for the same reason /admin is: it
                edits the one dataset every organization searches, which is not an
                organization-level decision. */}
            <Route
              path="jobs"
              element={
                <Protected roles={["super_admin"]}>
                  <Jobs />
                </Protected>
              }
            />
          </Route>
          <Route
            path="/admin"
            element={
              <Protected roles={["super_admin"]}>
                <Admin />
              </Protected>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Outside the layout so the login page gets toasts too */}
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 99999999 }}
        toastOptions={{ style: { zIndex: 99999999 } }}
      />
    </>
  );
}
