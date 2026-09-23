/** Old addresses that may still be bookmarked, each mapped to where that page lives now. */
import { PATHS } from "./paths";

export const LEGACY_REDIRECTS = [
  { from: "/analyze", to: `${PATHS.search}?mode=advanced` },
  { from: "/suggest", to: PATHS.suggestions },
  { from: "/my-suggestions", to: PATHS.mySuggestions },
  { from: "/admin", to: PATHS.suggestionReviews },
  { from: "/manage/organizations", to: PATHS.organizations },
  { from: "/manage/users", to: PATHS.accounts },
  { from: "/manage/accounts", to: PATHS.accounts },
  { from: "/settings/reviews", to: PATHS.suggestionReviews },
];
