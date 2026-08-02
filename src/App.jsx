import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "@store/hooks";
import { ADMIN_ROLES } from "@routes/roles";
import MainLayout from "@components/layout/MainLayout";
import Search from "@pages/Search";
import Login from "@pages/Login";
import Suggest from "@pages/Suggest";
import MySuggestions from "@pages/MySuggestions";
import Admin from "@pages/Admin";
import Manage from "@pages/Manage";

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
          <Route path="/suggest" element={<Suggest />} />
          <Route path="/my-suggestions" element={<MySuggestions />} />
          <Route
            path="/manage"
            element={
              <Protected roles={ADMIN_ROLES}>
                <Manage />
              </Protected>
            }
          />
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
