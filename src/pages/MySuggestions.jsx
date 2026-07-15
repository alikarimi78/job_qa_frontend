import { useEffect, useState } from "react";
import api, { errorMessage } from "../api.js";

const STATUS = {
  pending: ["در انتظار", "warning"],
  approved: ["تأیید شده", "success"],
  rejected: ["رد شده", "danger"],
};

export default function MySuggestions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/jobs/suggestions/mine")
      .then(({ data }) => setItems(data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <div className="card">
      <h1>پیشنهادهای من</h1>
      {error && <div className="error">{error}</div>}
      {items.length === 0 && !error && <p className="hint">هنوز پیشنهادی ثبت نکرده‌اید.</p>}
      {items.map((it) => {
        const [label, cls] = STATUS[it.status] || [it.status, "accent"];
        return (
          <div key={it.id} className="list-item">
            <div>
              <strong style={{ fontSize: 14 }}>{it.job_title}</strong>
              <div className="meta">{it.description?.slice(0, 80)}...</div>
            </div>
            <span className={`badge ${cls}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
