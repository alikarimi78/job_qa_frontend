/** The organization admin's username in green, or an amber "no admin" badge. */
import Badge from "@components/ui/Badge";

export default function AdminBadge({ admin }) {
  return admin ? (
    <Badge tone="success">{admin.username}</Badge>
  ) : (
    <Badge tone="warning">ادمین ندارد</Badge>
  );
}
