import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../auth.jsx";
import { stashDraft } from "../draft.js";
import JobDetails from "../components/JobDetails.jsx";

export default function Search() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [declined, setDeclined] = useState(false);
  // Counts searches so the detail boxes remount on each one: a box the user folded
  // open last time must not stay that way against a new answer's intent.
  const [runId, setRunId] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true); setError(""); setResult(null); setDeclined(false);
    try {
      const { data } = await api.post("/search", { question });
      setResult(data);
      setRunId((n) => n + 1);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Stash before navigating: an anonymous user is sent through /login on the way
  // to the form, and the accepted proposal has to survive that detour.
  function accept() {
    stashDraft(result.job_draft);
    if (user) navigate("/suggest");
    else navigate("/login", { state: { from: { pathname: "/suggest" } } });
  }

  const offered = result?.mode === "job_generated" && result.job_draft;
  // related_jobs leads with the matched record itself; showing it twice reads as a bug
  const nearby = result?.related_jobs?.filter((t) => t !== result.job) ?? [];
  // A proposal's boxes describe a record that does not exist yet — say so, or they
  // read as a job the database already holds.
  const detailsTitle = offered
    ? "مشخصات شغل پیشنهادی (هنوز ثبت نشده است)"
    : result?.details?.length > 1
      ? "اطلاعات این مشاغل در پایگاه داده"
      : "اطلاعات این شغل در پایگاه داده";

  return (
    <>
      <div className="card" style={{ textAlign: "center" }}>
        <h1>درباره هر شغلی بپرسید</h1>
        <p className="hint">وظایف، مهارت‌ها، ابزارها، محیط کاری و مسیر ارتقای بیش از ۱۰۰۰ شغل</p>
        <form onSubmit={submit} className="row" style={{ maxWidth: 560, margin: "0 auto" }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="مثلاً: وظایف افسر توپخانه چیست؟"
          />
          <button className="primary" disabled={loading}>
            {loading ? "..." : "جستجو"}
          </button>
        </form>
        <p className="hint" style={{ margin: "12px 0 0" }}>
          می‌توانید شغل دلخواهتان را هم توصیف کنید؛ اگر در دیتاست نباشد، شغلی متناسب با آن پیشنهاد می‌شود.
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
            <span>
              {result.mode === "single" && <span className="badge accent">{result.job}</span>}
              {result.mode === "job_match" && <span className="badge success">{result.job}</span>}
              {result.mode === "job_generated" && (
                <span className="badge warning">شغل پیشنهادی — هنوز ثبت نشده</span>
              )}
              {result.mode === "interdisciplinary" && (
                <span className="badge accent">{result.jobs?.join(" + ")}</span>
              )}
              {result.mode === "out_of_domain" && <span className="badge danger">خارج از دامنه</span>}
            </span>
            {result.score != null && (
              <span className="meta">تطابق: {result.score.toFixed(2)}</span>
            )}
          </div>

          <p className="answer">{result.answer}</p>

          <JobDetails key={runId} details={result.details} title={detailsTitle} />

          {result.mode === "job_match" && nearby.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <span className="meta">مشاغل مرتبط: </span>
              {nearby.map((title) => (
                <span key={title} className="badge accent" style={{ marginInlineEnd: 6 }}>
                  {title}
                </span>
              ))}
            </div>
          )}

          {offered && !declined && (
            <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
              <button className="primary" onClick={accept}>بله، ثبتش می‌کنم</button>
              <button onClick={() => setDeclined(true)}>نه، ممنون</button>
              {!user && <span className="meta">برای ثبت باید وارد حساب خود شوید</span>}
            </div>
          )}

          {offered && declined && (
            <p className="meta" style={{ marginTop: 16 }}>
              این پیشنهاد ثبت نشد. با پرسش تازه می‌توانید پیشنهاد دیگری بگیرید.
            </p>
          )}
        </div>
      )}
    </>
  );
}
