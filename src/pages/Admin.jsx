import { useEffect, useRef, useState } from "react";
import api, { errorMessage } from "../api.js";
import JobForm from "../components/JobForm.jsx";

export default function Admin() {
  const [pending, setPending] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rebuild, setRebuild] = useState({ running: false, last_result: null });
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);
  const pollRef = useRef(null);

  async function loadPending() {
    try {
      const { data } = await api.get("/admin/suggestions", { params: { job_status: "pending" } });
      setPending(data);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function loadRebuildStatus() {
    try {
      const { data } = await api.get("/admin/rebuild/status");
      setRebuild(data);
      if (!data.running && pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch { /* ignore polling errors */ }
  }

  useEffect(() => {
    loadPending();
    loadRebuildStatus();
    return () => pollRef.current && clearInterval(pollRef.current);
  }, []);

  async function review(id, action) {
    setError("");
    try {
      await api.post(`/admin/suggestions/${id}/${action}`);
      if (action === "approve") {
        setNotice("پیشنهاد تأیید شد. برای اعمال در جستجو، بازسازی امبدینگ لازم است.");
      }
      loadPending();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function startRebuild() {
    setError(""); setNotice("");
    try {
      await api.post("/admin/rebuild");
      setRebuild({ running: true, last_result: null });
      pollRef.current = setInterval(loadRebuildStatus, 3000);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function addDirect(form, reset) {
    setBusy(true); setError("");
    try {
      await api.post("/admin/jobs", form);
      setNotice("شغل اضافه شد. برای اعمال در جستجو، بازسازی امبدینگ لازم است.");
      reset();
      setShowAdd(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 style={{ margin: 0 }}>پنل مدیریت</h1>
          <span className="badge warning">{pending.length} پیشنهاد در انتظار</span>
        </div>

        {error && <div className="error">{error}</div>}
        {notice && <div className="notice">{notice}</div>}

        <div className="row" style={{ justifyContent: "space-between", background: "var(--bg)", borderRadius: 8, padding: "12px 16px", margin: "16px 0" }}>
          <div>
            <strong style={{ fontSize: 14 }}>بازسازی امبدینگ‌ها</strong>
            <div className="meta">
              {rebuild.running ? "در حال اجرا..." : rebuild.last_result ? `آخرین اجرا: ${rebuild.last_result}` : "—"}
            </div>
          </div>
          <button onClick={startRebuild} disabled={rebuild.running}>
            {rebuild.running ? "در حال اجرا..." : "بازسازی"}
          </button>
        </div>

        {pending.length === 0 && <p className="hint">پیشنهاد در انتظاری وجود ندارد.</p>}
        {pending.map((it) => (
          <div key={it.id}>
            <div className="list-item">
              <div>
                <strong style={{ fontSize: 14 }}>{it.job_title}</strong>
                <div className="meta">پیشنهاد #{it.id}</div>
              </div>
              <div className="row">
                <button className="success" onClick={() => review(it.id, "approve")}>تأیید</button>
                <button className="danger" onClick={() => review(it.id, "reject")}>رد</button>
                <button onClick={() => setExpanded(expanded === it.id ? null : it.id)}>
                  {expanded === it.id ? "بستن" : "جزئیات"}
                </button>
              </div>
            </div>
            {expanded === it.id && (
              <div style={{ background: "var(--bg)", borderRadius: 8, padding: "12px 16px", fontSize: 13, marginBottom: 8 }}>
                <p><strong>نام‌های دیگر:</strong> {it.aliases}</p>
                <p><strong>ابزارها:</strong> {it.tools}</p>
                <p><strong>مهارت‌ها:</strong> {it.skills}</p>
                <p><strong>شرح:</strong> {it.description}</p>
                <p><strong>وظایف:</strong> {it.responsibilities}</p>
                <p><strong>محیط کاری:</strong> {it.work_context}</p>
                <p><strong>مسیر بعدی:</strong> {it.career_path_next}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: 16 }}>افزودن مستقیم شغل</h1>
          <button onClick={() => setShowAdd(!showAdd)}>{showAdd ? "بستن" : "باز کردن فرم"}</button>
        </div>
        {showAdd && (
          <div style={{ marginTop: 16 }}>
            <JobForm onSubmit={addDirect} submitLabel="افزودن" busy={busy} />
          </div>
        )}
      </div>
    </>
  );
}
