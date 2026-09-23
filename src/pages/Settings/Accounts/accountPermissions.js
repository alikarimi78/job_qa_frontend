/** The backend's account rules repeated on the client, so the page never offers a button that would be refused: who may manage whom, who may move an account between organizations, and which roles each role may create. */
import { ROLES } from "@constants/roles";

export const CREATABLE_ROLES = {
  [ROLES.superAdmin]: [ROLES.superAdmin, ROLES.orgAdmin, ROLES.user],
  [ROLES.orgAdmin]: [ROLES.user],
};

const ROLES_WITHIN_ORGANIZATION = new Set([ROLES.orgAdmin, ROLES.user]);

export const roleNeedsOrganization = (role) => ROLES_WITHIN_ORGANIZATION.has(role);

export const creatableRolesFor = (role) => CREATABLE_ROLES[role] ?? [];

export function canManageAccount(currentUser, account) {
  if (!currentUser || currentUser.id === account.id) return false;
  if (currentUser.role === ROLES.superAdmin) return true;
  return (
    currentUser.role === ROLES.orgAdmin &&
    account.role === ROLES.user &&
    account.organization_id === currentUser.organization_id
  );
}

export const canMoveOrganization = (currentUser, account) =>
  canManageAccount(currentUser, account) &&
  currentUser.role === ROLES.superAdmin &&
  account.organization_id != null;
