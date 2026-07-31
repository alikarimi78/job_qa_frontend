// The matched record's own columns, rendered as one box per field beside the
// generated answer. The prose answer stays what it always was; these boxes are the
// data it was written from, so someone who asked about tools can still open the
// duties box without asking a second question.
//
// Which boxes matter is the backend's call, not this component's: `primary` marks
// the columns the answer used — what the question's intent asked for — and those
// open, while the rest of the profile stays one click away.

// Duties are written as sentences; every other list column holds short labels that
// scan better as chips. Prose columns (شرح شغل، محیط کاری) arrive with no items at
// all and render as a paragraph.
const LIST_AS_LINES = new Set(["responsibilities"]);

function faCount(n) {
  return n.toLocaleString("fa-IR");
}

function FieldBox({ field }) {
  const asChips = field.items.length > 0 && !LIST_AS_LINES.has(field.key);
  // Chips are short enough to sit two or three to a row; sentences and paragraphs
  // get the full width instead of a 260px column.
  const className = `field-box${field.primary ? " primary" : ""}${asChips ? "" : " wide"}`;

  return (
    <details className={className} open={field.primary}>
      <summary>
        <span className="field-label">{field.label}</span>
        {field.items.length > 0 && (
          <span className="meta">{faCount(field.items.length)} مورد</span>
        )}
      </summary>
      <div className="field-body">
        {/* Keyed by position: a «|»-joined cell may well repeat a value, and the
            list is fixed for as long as it is on screen. */}
        {asChips && (
          <div className="chips">
            {field.items.map((item, i) => (
              <span key={i} className="chip">{item}</span>
            ))}
          </div>
        )}
        {!asChips && field.items.length > 0 && (
          <ul className="field-list">
            {field.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        )}
        {field.items.length === 0 && <p className="field-text">{field.value}</p>}
      </div>
    </details>
  );
}

export default function JobDetails({ details, title }) {
  if (!details?.length) return null;
  const named = details.length > 1;      // interdisciplinary: say which job is which

  return (
    <div className="details-block">
      {title && <p className="meta details-title">{title}</p>}
      {details.map((job) => (
        <div key={job.job_title}>
          {named && <p className="detail-heading">{job.job_title}</p>}
          <div className="field-boxes">
            {job.fields.map((field) => <FieldBox key={field.key} field={field} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
