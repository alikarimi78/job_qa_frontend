/** Reads a search answer and works out everything the result card needs to decide what to show: its heading, the title above the job boxes, whether it can be reported, and whether a new job is offered as a suggestion. */
import {
  COMBINATION_MODE,
  COMPOSED_MODES,
  DEFAULT_RESULT_HEADING,
  NO_REPORT_MODES,
  RESULT_HEADINGS,
  STORED_JOB_MODES,
} from "../constants";

function detailsTitleFor(result, isComposed) {
  const subject = result.details?.[0]?.job_title ?? result.job;
  if (result.details?.length > 1) return "اطلاعات این مشاغل";
  if (isComposed) return `مشخصات تدوین‌شده «${subject}»`;
  if (subject) return `اطلاعات «${subject}»`;
  return "اطلاعات این شغل";
}

export function describeSearchResult(result) {
  const { mode } = result;
  const isComposed = COMPOSED_MODES.has(mode);
  const isCombination = mode === COMBINATION_MODE;
  const draftJob = result.job_draft ?? null;
  const draftDetail = isComposed ? result.details?.[0] : result.draft_detail;
  const heading = RESULT_HEADINGS[mode] ?? DEFAULT_RESULT_HEADING;
  const canReport = !NO_REPORT_MODES.has(mode);

  return {
    isComposed,
    isCombination,
    draftJob,
    draftDetail,
    hasDraftOffer: Boolean(draftJob && draftDetail),
    nearestJob: result.nearest ?? null,
    heading: {
      ...heading,
      title: heading.title ?? (isCombination ? result.jobs?.join(" + ") : result.job),
    },
    detailsTitle: detailsTitleFor(result, isComposed),
    canReport,
    answerLabel: canReport ? "تحلیل هوشمند" : "پاسخ دستیار",
    isStoredJob: STORED_JOB_MODES.has(mode),
    ownerOrganizationId: result.organization_id ?? null,
  };
}
