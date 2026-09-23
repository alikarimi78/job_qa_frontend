/** Logic of the organizations page: the name filter, each organization's admin and account count, the logo of the selected one, and creating, editing, deleting organizations and giving one an admin. */
import { useState } from "react";
import {
  useAccountsQuery,
  useCreateOrgAdminMutation,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useOrganizationLogoQuery,
  useOrganizationsQuery,
  useUpdateOrganizationMutation,
} from "@services/accountsApi";
import { ROLES } from "@constants/roles";
import useDialogState from "@hooks/useDialogState";
import { runAction } from "@utils/runAction";
import { foldText, matchesQuery } from "@utils/text";
import { ORGANIZATION_DIALOGS } from "../constants";

function useSelectedOrganizationLogo(organization, isShowingLogo) {
  const hasLogo = Boolean(isShowingLogo && organization?.has_logo);
  const { data } = useOrganizationLogoQuery(organization?.id, { skip: !hasLogo });
  return hasLogo ? data?.logo ?? null : null;
}

export default function useOrganizations() {
  const [searchTerm, setSearchTerm] = useState("");
  const dialogs = useDialogState();
  const selectedOrganization = dialogs.target;

  const { data: organizations = [] } = useOrganizationsQuery();
  const { data: accounts = [] } = useAccountsQuery();
  const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation();
  const [updateOrganization, { isLoading: isSaving }] = useUpdateOrganizationMutation();
  const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationMutation();
  const [createOrgAdmin, { isLoading: isAddingAdmin }] = useCreateOrgAdminMutation();

  const selectedLogo = useSelectedOrganizationLogo(
    selectedOrganization,
    dialogs.isOpen(ORGANIZATION_DIALOGS.edit) || dialogs.isOpen(ORGANIZATION_DIALOGS.view)
  );

  const foldedQuery = foldText(searchTerm);
  const visibleOrganizations = organizations.filter((organization) =>
    matchesQuery(organization.name, foldedQuery)
  );

  const adminOf = (organizationId) =>
    accounts.find(
      (account) => account.role === ROLES.orgAdmin && account.organization_id === organizationId
    );
  const accountCountOf = (organizationId) =>
    accounts.filter((account) => account.organization_id === organizationId).length;

  return {
    searchTerm,
    changeSearchTerm: (event) => setSearchTerm(event.target.value),
    isFiltering: Boolean(foldedQuery),
    visibleOrganizations,
    adminOf,
    accountCountOf,
    dialogs,
    selectedOrganization,
    selectedLogo,
    isCreating,
    isSaving,
    isDeleting,
    isAddingAdmin,
    create: (body, onSuccess) =>
      runAction(() => createOrganization(body), `سازمان «${body.name}» ایجاد شد.`, onSuccess),
    update: (body, onSuccess) =>
      runAction(
        () => updateOrganization({ id: selectedOrganization.id, ...body }),
        `مشخصات سازمان «${body.name}» ثبت شد.`,
        onSuccess
      ),
    remove: () =>
      runAction(
        () => deleteOrganization(selectedOrganization.id),
        `سازمان «${selectedOrganization.name}» حذف شد.`,
        dialogs.close
      ),
    addAdmin: (body, onSuccess) =>
      runAction(
        () => createOrgAdmin({ ...body, organization_id: selectedOrganization.id }),
        `ادمین سازمان «${selectedOrganization.name}» ایجاد شد.`,
        onSuccess
      ),
  };
}
