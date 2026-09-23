/** The "add account" dialog: which roles the admin may create, the chosen role and organization (an organization admin creates users in their own organization only, and an organization accepts one admin), and creating the account through the matching endpoint. */
import { useMemo, useState } from "react";
import { ROLES, roleLabel } from "@constants/roles";
import {
  useCreateOrgAdminMutation,
  useCreateSuperAdminMutation,
  useCreateUserMutation,
} from "@services/accountsApi";
import { runAction } from "@utils/runAction";
import { creatableRolesFor, roleNeedsOrganization } from "../accountPermissions";

function organizationsWithoutAdmin(accounts, organizations) {
  const organizationsWithAdmin = new Set(
    accounts
      .filter((account) => account.role === ROLES.orgAdmin)
      .map((account) => account.organization_id)
  );
  return organizations.filter((organization) => !organizationsWithAdmin.has(organization.id));
}

export default function useNewAccountForm({ currentUser, accounts, organizations }) {
  const isSuperAdmin = currentUser.role === ROLES.superAdmin;
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  const [createSuperAdmin, { isLoading: isCreatingSuperAdmin }] = useCreateSuperAdminMutation();
  const [createOrgAdmin, { isLoading: isCreatingOrgAdmin }] = useCreateOrgAdminMutation();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

  const creatableRoles = creatableRolesFor(currentUser.role);
  const needsOrganization = roleNeedsOrganization(role);
  const usesOwnOrganization = needsOrganization && !isSuperAdmin;

  const organizationChoices = useMemo(() => {
    if (!needsOrganization) return [];
    return role === ROLES.orgAdmin ? organizationsWithoutAdmin(accounts, organizations) : organizations;
  }, [needsOrganization, role, accounts, organizations]);

  const open = () => {
    setRole(creatableRoles.length === 1 ? creatableRoles[0] : "");
    setOrganizationId("");
    setIsOpen(true);
  };

  const changeRole = (event) => {
    setRole(event.target.value);
    setOrganizationId("");
  };

  const submit = (credentials, onSuccess) => {
    const chosenOrganizationId = Number(organizationId);
    const requests = {
      [ROLES.superAdmin]: () => createSuperAdmin(credentials),
      [ROLES.orgAdmin]: () =>
        createOrgAdmin({ ...credentials, organization_id: chosenOrganizationId }),
      [ROLES.user]: () =>
        createUser(
          usesOwnOrganization
            ? credentials
            : { ...credentials, organization_id: chosenOrganizationId }
        ),
    };
    return runAction(
      requests[role],
      `کاربر «${credentials.username}» با نقش ${roleLabel(role)} ایجاد شد.`,
      onSuccess
    );
  };

  return {
    canCreate: creatableRoles.length > 0,
    isOpen,
    open,
    close: () => setIsOpen(false),
    creatableRoles,
    role,
    changeRole,
    organizationId,
    changeOrganization: (event) => setOrganizationId(event.target.value),
    needsOrganization,
    usesOwnOrganization,
    organizationChoices,
    ownOrganizationName: currentUser.organization?.name ?? "سازمان شما",
    canSubmit: Boolean(role) && (!needsOrganization || usesOwnOrganization || organizationId !== ""),
    isCreating: isCreatingSuperAdmin || isCreatingOrgAdmin || isCreatingUser,
    submit,
  };
}
