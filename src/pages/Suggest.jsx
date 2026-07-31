import { useState } from "react";
import api, { errorMessage } from "../api.js";
import JobForm from "../components/JobForm.jsx";
import { readDraft, clearDraft } from "../draft.js";

export default function Suggest() {
  // Read once at mount: a draft accepted on the search page arrives here through
  // the stash, so re-renders never resurrect one a submit has already consumed.
  const [draft, setDraft] = useState(readDraft);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(form, reset) {
    setBusy(true); setError(""); setDone(false);
    try {
      await api.post("/jobs/suggestions", form);
      clearDraft();
      setDone(true);
      reset();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function startBlank() {
    clearDraft();
    setDraft(null);
  }

  return (
    <div className="card">
      <h1>پیشنهاد شغل جدید</h1>
      <p className="hint">همه فیلدها الزامی‌اند؛ پیشنهاد پس از تأیید ادمین به دیتاست اضافه می‌شود</p>

      {draft && !done && (
        <div className="notice">
          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <span>
              این فرم با مشخصات شغل پیشنهادی «{draft.job_title}» پر شده است؛
              پیش از ارسال آن را بررسی و در صورت نیاز ویرایش کنید.
            </span>
            <button type="button" onClick={startBlank}>فرم خالی</button>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {done && <div className="notice">پیشنهاد ثبت شد و در انتظار بررسی ادمین است.</div>}

      {/* Keyed so switching to a blank form actually resets the inputs */}
      <JobForm
        key={draft ? "draft" : "blank"}
        initial={draft}
        onSubmit={submit}
        submitLabel="ثبت پیشنهاد"
        busy={busy}
      />
    </div>
  );
}
