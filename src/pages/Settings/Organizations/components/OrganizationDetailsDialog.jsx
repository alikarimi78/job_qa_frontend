/** Read-only dialog with everything about one organization: contact details, logo, admin, and how many accounts and organization-only jobs it has. */
import DetailsDialog from "@components/dialogs/DetailsDialog";
import { faDigits, faNumber } from "@utils/numbers";
import AdminBadge from "./AdminBadge";

function LogoValue({ organization, logo }) {
  if (!organization.has_logo) return "—";
  if (!logo) return "دارد";
  return (
    <img
      src={logo}
      alt={`لوگوی ${organization.name}`}
      className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-200"
    />
  );
}

function detailRows(organization, logo, admin, accountCount) {
  if (!organization) return [];
  return [
    { label: "نام سازمان", value: organization.name },
    { label: "شناسه سازمان", value: organization.code ? faDigits(organization.code) : "—" },
    { label: "آدرس سازمان", value: organization.address || "—" },
    { label: "شماره تماس", value: organization.phone ? faDigits(organization.phone) : "—" },
    {
      label: "پست الکترونیکی",
      value: organization.email ? <span dir="ltr">{organization.email}</span> : "—",
    },
    { label: "لوگوی سازمان", value: <LogoValue organization={organization} logo={logo} /> },
    { label: "ادمین سازمان", value: <AdminBadge admin={admin} /> },
    { label: "تعداد کاربر", value: faNumber(accountCount) },
    { label: "شغل اختصاصی", value: faNumber(organization.job_count) },
  ];
}

export default function OrganizationDetailsDialog({ open, organization, logo, admin, accountCount, onClose }) {
  return (
    <DetailsDialog
      open={open}
      title="مشاهده سازمان"
      onClose={onClose}
      rows={detailRows(organization, logo, admin, accountCount)}
    />
  );
}
