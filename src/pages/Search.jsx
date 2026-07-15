import { useState } from "react";
import api, { errorMessage } from "../api.js";

export default function Search() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const { data } = await api.post("/search", { question });
      setResult(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

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
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
            <span>
              {result.mode === "single" && <span className="badge accent">{result.job}</span>}
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
        </div>
      )}
    </>
  );
}
