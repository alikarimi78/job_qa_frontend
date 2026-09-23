/** The dialogs of the accounts page and the badge colour of each role. */
import { ROLES } from "@constants/roles";

export const ACCOUNT_DIALOGS = {
  view: "view",
  edit: "edit",
  resetPassword: "resetPassword",
  changeOwnPassword: "changeOwnPassword",
  block: "block",
  delete: "delete",
};

export const ROLE_BADGE_TONES = {
  [ROLES.superAdmin]: "danger",
  [ROLES.orgAdmin]: "warning",
  [ROLES.user]: "neutral",
};
