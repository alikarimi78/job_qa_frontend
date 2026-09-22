import { ADMIN_ROLES } from "./roles";

export function landingPath(role) {
  return ADMIN_ROLES.includes(role) ? "/manage/dashboard" : "/search";
}
