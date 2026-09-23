/** Read-only dialog with an account's details: name, username, role, organization, status, creator and dates. */
import DetailsDialog from "@components/dialogs/DetailsDialog";
import { faDateTime } from "@utils/jalali";
import { RoleBadge, StatusBadge } from "./AccountBadges";

const personLabel = (person) => {
  if (!person) return "—";
  return person.full_name ? `${person.full_name} (${person.username})` : person.username;
};

function detailRows(account, organizationLabel) {
  if (!account) return [];
  return [
    { label: "نام و نام خانوادگی", value: account.full_name || "—" },
    { label: "نام کاربری", value: account.username },
    { label: "نقش", value: <RoleBadge role={account.role} /> },
    { label: "جایگاه", value: organizationLabel },
    { label: "وضعیت", value: <StatusBadge isActive={account.is_active} /> },
    { label: "ایجادکننده", value: personLabel(account.creator) },
    { label: "تاریخ ایجاد", value: faDateTime(account.created_at) },
    { label: "آخرین ویرایش", value: faDateTime(account.updated_at) },
    {
      label: "آخرین ورود",
      value: account.last_login ? faDateTime(account.last_login) : "تاکنون وارد نشده است",
    },
  ];
}

export default function AccountDetailsDialog({ open, account, organizationLabel, onClose }) {
  return (
    <DetailsDialog
      open={open}
      title="مشاهده کاربر"
      onClose={onClose}
      rows={detailRows(account, organizationLabel)}
    />
  );
}
