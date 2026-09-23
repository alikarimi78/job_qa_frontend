/** The two tabs of job management: the job list and the review queue of suggestions. */
import { BriefcaseIcon, ShieldCheckIcon } from "@components/icons";
import { PATHS } from "@routes/paths";

export const MANAGE_JOBS_BASE_PATH = PATHS.manageJobs;

export const MANAGE_JOBS_TABS = [
  { path: "", label: "لیست مشاغل", icon: BriefcaseIcon },
  { path: "reviews", label: "بررسی پیشنهادها", icon: ShieldCheckIcon },
];
