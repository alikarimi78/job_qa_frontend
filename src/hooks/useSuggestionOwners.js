/** Lists the organizations a job suggestion may be filed under: every organization for a super admin, otherwise only the user's own, which is also the default. */
import { useCurrentUserQuery } from "@services/authApi";
import { useOrganizationsQuery } from "@services/accountsApi";
import { ROLES } from "@constants/roles";

function suggestionOwners(currentUser, organizations = []) {
  if (currentUser?.role === ROLES.superAdmin) {
    return { owners: organizations, defaultOwner: null };
  }
  const ownOrganization = currentUser?.organization ?? null;
  return {
    owners: ownOrganization ? [ownOrganization] : [],
    defaultOwner: ownOrganization?.id ?? null,
  };
}

export default function useSuggestionOwners() {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery();
  const { data: organizations = [], isLoading: areOrganizationsLoading } = useOrganizationsQuery(
    undefined,
    { skip: currentUser?.role !== ROLES.superAdmin }
  );
  return {
    ...suggestionOwners(currentUser, organizations),
    loading: isUserLoading || areOrganizationsLoading,
  };
}
