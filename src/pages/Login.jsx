import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Set when the user was redirected here mid-action (e.g. accepting a job draft)
  const next = location.state?.from?.pathname || "/";

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { username, password });
      login({ token: data.access_token, role: data.role, username });
      navigate(next, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>ورود</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>نام کاربری</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label style={{ marginTop: 12 }}>رمز عبور</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary" style={{ marginTop: 16, width: "100%" }}>ورود</button>
      </form>
      <p className="meta" style={{ marginTop: 12 }}>
        حساب‌ها را مدیر واحد شما می‌سازد؛ ثبت‌نام آزاد وجود ندارد.
      </p>
    </div>
  );
}
