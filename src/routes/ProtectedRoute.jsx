/** Route guard: sends signed-out visitors to the login page (remembering where they were going) and signed-in users whose role is not in `roles` to the unauthorized page. */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasRole } from "@constants/roles";
import { useAppSelector } from "@store/hooks";
import { selectRole, selectToken } from "@store/slices/authSlice";
import { PATHS } from "./paths";

export default function ProtectedRoute({ roles, children }) {
  const token = useAppSelector(selectToken);
  const role = useAppSelector(selectRole);
  const location = useLocation();

  if (!token) return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  if (!hasRole(role, roles)) return <Navigate to={PATHS.unauthorized} replace />;
  return children ?? <Outlet />;
}
