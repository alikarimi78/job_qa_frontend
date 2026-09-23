/** Every URL the app navigates to, in one place, and the page each role lands on after signing in. */
import { ADMIN_ROLES } from "@constants/roles";

export const PATHS = {
  root: "/",
  login: "/login",
  unauthorized: "/unauthorized",
  search: "/search",
  suggestions: "/suggestions",
  mySuggestions: "/suggestions?tab=mine",
  manage: "/manage",
  dashboard: "/manage/dashboard",
  manageJobs: "/manage/jobs",
  suggestionReviews: "/manage/jobs/reviews",
  settings: "/settings",
  organizations: "/settings/organizations",
  accounts: "/settings/accounts",
};

export const landingPathFor = (role) =>
  ADMIN_ROLES.includes(role) ? PATHS.dashboard : PATHS.search;
