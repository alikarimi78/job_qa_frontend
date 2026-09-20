import { relabelDetail } from "@constant/fieldLabels";

// What `POST /reports/search` is given: the answer the reader is looking at, with the client's own
// field names, since the report is printed from what was posted back rather than re-run. The search
// page and a starred analysis both print through this, so the two PDFs cannot drift apart.
export function reportBody(question, result) {
  return {
    question,
    mode: result.mode,
    answer: result.answer,
    job: result.job ?? null,
    jobs: result.jobs ?? null,
    details: (result.details ?? []).map(relabelDetail),
    related_jobs: result.related_jobs ?? null,
  };
}

// What the file is called: the job the answer was about, or the jobs a combination joined.
export const reportSubject = (result) =>
  result.job ?? result.jobs?.join(" و ") ?? result.details?.[0]?.job_title;

export default reportBody;
