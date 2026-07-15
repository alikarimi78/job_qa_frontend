import { useState } from "react";
import api, { errorMessage } from "../api.js";
import JobForm from "../components/JobForm.jsx";

export default function Suggest() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(form, reset) {
    setBusy(true); setError(""); setDone(false);
    try {
      await api.post("/jobs/suggestions", form);
      setDone(true);
      reset();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h1>پیشنهاد شغل جدید</h1>
      <p className="hint">همه فیلدها الزامی‌اند؛ پیشنهاد پس از تأیید ادمین به دیتاست اضافه می‌شود</p>
      {error && <div className="error">{error}</div>}
      {done && <div className="notice">پیشنهاد ثبت شد و در انتظار بررسی ادمین است.</div>}
      <JobForm onSubmit={submit} submitLabel="ثبت پیشنهاد" busy={busy} />
    </div>
  );
}
