import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Carried over from a protected page the user was redirected away from
  const next = location.state?.from?.pathname || "/";

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", { username, password });
      login({ token: data.access_token, role: data.role, username });
      navigate(next, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>ثبت‌نام</h1>
      <p className="hint">رمز عبور باید حداقل ۸ کاراکتر باشد</p>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>نام کاربری</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label style={{ marginTop: 12 }}>رمز عبور</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary" style={{ marginTop: 16, width: "100%" }}>ثبت‌نام</button>
      </form>
      <p className="meta" style={{ marginTop: 12 }}>
        حساب دارید؟ <Link to="/login" state={location.state}>وارد شوید</Link>
      </p>
    </div>
  );
}
