import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Search from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import Suggest from "./pages/Suggest.jsx";
import MySuggestions from "./pages/MySuggestions.jsx";
import Admin from "./pages/Admin.jsx";
import Manage from "./pages/Manage.jsx";

const ADMIN_ROLES = ["super_admin", "org_admin", "unit_admin"];

function Protected({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();
  // Carry the attempted page so login can return the user to it — a job draft
  // accepted while logged out is waiting on the other side of that redirect.
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  // A convenience only: the API refuses the same calls regardless of what renders
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="brand">سامانه تحلیل مشاغل</NavLink>
        <nav>
          <NavLink to="/">جستجو</NavLink>
          {user && <NavLink to="/suggest">پیشنهاد شغل</NavLink>}
          {user && <NavLink to="/my-suggestions">پیشنهادهای من</NavLink>}
          {ADMIN_ROLES.includes(user?.role) && <NavLink to="/manage">مدیریت حساب‌ها</NavLink>}
          {user?.role === "super_admin" && <NavLink to="/admin">بررسی پیشنهادها</NavLink>}
          {!user && <NavLink to="/login">ورود</NavLink>}
          {user && (
            <span className="row">
              <span className="meta">{user.username}</span>
              <button onClick={logout}>خروج</button>
            </span>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Protected><Search /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/suggest" element={<Protected><Suggest /></Protected>} />
          <Route path="/my-suggestions" element={<Protected><MySuggestions /></Protected>} />
          <Route path="/manage" element={<Protected roles={ADMIN_ROLES}><Manage /></Protected>} />
          <Route path="/admin" element={<Protected roles={["super_admin"]}><Admin /></Protected>} />
        </Routes>
      </main>
    </>
  );
}
