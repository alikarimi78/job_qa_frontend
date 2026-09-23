/** Select of the organizations, preceded by an "all" choice and optionally a "public only" choice; filters admin lists and dashboard cards. Calls `onChange` with the chosen value. */
import Select from "@components/ui/Select";
import { SCOPE_ALL, SCOPE_PUBLIC } from "@constants/organizationScope";

export default function OrganizationSelect({
  value,
  onChange,
  organizations,
  allLabel = "همه",
  publicLabel,
  className = "min-w-44",
}) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)} className={className}>
      <option value={SCOPE_ALL}>{allLabel}</option>
      {publicLabel && <option value={SCOPE_PUBLIC}>{publicLabel}</option>}
      {organizations.map((organization) => (
        <option key={organization.id} value={organization.id}>
          {organization.name}
        </option>
      ))}
    </Select>
  );
}
