import { relabelDetail } from "@constant/fieldLabels";
import { safeFileName } from "./download";

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

const reportSubject = (result) =>
  result.job ?? result.jobs?.join(" و ") ?? result.details?.[0]?.job_title;

export const reportFileName = (result) =>
  `${safeFileName(`گزارش ${reportSubject(result) ?? ""}`, "گزارش تحلیل شغل")}.pdf`;
