import { useCurrentUserQuery } from "@services/authApi";
import { useOrganizationsQuery } from "@services/accountsApi";

function suggestionOwners(me, organizations = []) {
  if (me?.role === "super_admin") {
    return { owners: organizations, defaultOwner: null };
  }
  const own = me?.organization ?? null;
  return { owners: own ? [own] : [], defaultOwner: own?.id ?? null };
}

export default function useSuggestionOwners() {
  const { data: me, isLoading: meLoading } = useCurrentUserQuery();
  const { data: organizations = [], isLoading: orgsLoading } = useOrganizationsQuery(undefined, {
    skip: me?.role !== "super_admin",
  });
  return { ...suggestionOwners(me, organizations), loading: meLoading || orgsLoading };
}
