import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "@store/hooks";
import { ADMIN_ROLES } from "@routes/roles";
import MainLayout from "@components/layout/MainLayout";
import Search from "@pages/Search";
import Analyze from "@pages/Analyze";
import Login from "@pages/Login";
import Suggest from "@pages/Suggest";
import MySuggestions from "@pages/MySuggestions";
import Admin from "@pages/Admin";
import ManageLayout from "@pages/manage/ManageLayout";
import Dashboard from "@pages/manage/Dashboard";
import Organizations from "@pages/manage/Organizations";
import Units from "@pages/manage/Units";
import Accounts from "@pages/manage/Accounts";

function Protected({ children, roles }) {
  const token = useAppSelector((state) => state.auth.token);
  const role = useAppSelector((state) => state.auth.role);
  const location = useLocation();

  // Carry the attempted page so login can return the user to it — a job draft
  // accepted while logged out is waiting on the other side of that redirect.
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  // A convenience only: the API refuses the same calls regardless of what renders
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
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
          <Route path="/" element={<Search />} />
          {/* The other half of searching: a profile in, a ranking out. Open to every
              signed-in account, exactly as «/» is — the corpus is one shared dataset. */}
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/suggest" element={<Suggest />} />
          <Route path="/my-suggestions" element={<MySuggestions />} />
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
            <Route
              path="units"
              element={
                <Protected roles={["super_admin", "org_admin"]}>
                  <Units />
                </Protected>
              }
            />
            {/* «کاربران» was its own page until account creation moved into one
                dialog on /manage/accounts. The redirect is for a bookmark, and for
                the sidebar of a tab that was open across the change. */}
            <Route path="users" element={<Navigate to="/manage/accounts" replace />} />
            <Route path="accounts" element={<Accounts />} />
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
