/** Badges for an account's role (coloured by rank) and its status (active or blocked). */
import Badge from "@components/ui/Badge";
import { roleLabel } from "@constants/roles";
import { ROLE_BADGE_TONES } from "../constants";

export function RoleBadge({ role }) {
  return <Badge tone={ROLE_BADGE_TONES[role] ?? "neutral"}>{roleLabel(role)}</Badge>;
}

export function StatusBadge({ isActive }) {
  return isActive ? <Badge tone="success">فعال</Badge> : <Badge tone="danger">مسدود</Badge>;
}
