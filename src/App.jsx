import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Search from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Suggest from "./pages/Suggest.jsx";
import MySuggestions from "./pages/MySuggestions.jsx";
import Admin from "./pages/Admin.jsx";

function Protected({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="brand">سامانه پرسش‌وپاسخ مشاغل</NavLink>
        <nav>
          <NavLink to="/">جستجو</NavLink>
          {user && <NavLink to="/suggest">پیشنهاد شغل</NavLink>}
          {user && <NavLink to="/my-suggestions">پیشنهادهای من</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">مدیریت</NavLink>}
          {!user && <NavLink to="/login">ورود</NavLink>}
          {!user && <NavLink to="/register">ثبت‌نام</NavLink>}
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
          <Route path="/" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/suggest" element={<Protected><Suggest /></Protected>} />
          <Route path="/my-suggestions" element={<Protected><MySuggestions /></Protected>} />
          <Route path="/admin" element={<Protected adminOnly><Admin /></Protected>} />
        </Routes>
      </main>
    </>
  );
}
