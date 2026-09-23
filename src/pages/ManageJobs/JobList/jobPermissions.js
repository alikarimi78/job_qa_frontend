/** Mirrors the backend rule for editing a stored job: a super admin may edit any job, an organization admin only their organization's own jobs. */
import { ROLES } from "@constants/roles";

export function canEditJob(currentUser, job) {
  if (currentUser.role === ROLES.superAdmin) return true;
  return job.organization_id != null && job.organization_id === currentUser.organization_id;
}
