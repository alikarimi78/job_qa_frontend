import { useCurrentUserQuery } from "@services/authApi";
import { useOrganizationsQuery } from "@services/accountsApi";

// Which owners a suggestion may name, mirroring the backend's `assert_can_suggest_job`: the
// public corpus is always open, a super_admin may name any organization, and every other
// account only the one it sits in. An account in no organization gets no owners at all, so
// JobForm draws no choice and the suggestion goes public.
export function suggestionOwners(me, organizations = []) {
  if (me?.role === "super_admin") return { owners: organizations, allowPublic: true };
  return { owners: me?.organization ? [me.organization] : [], allowPublic: true };
}

export function useSuggestionOwners() {
  const { data: me } = useCurrentUserQuery();
  // `GET /orgs` answers a super_admin with every organization; anyone else needs none, their
  // own arriving on `/auth/me`, and a plain user would only be refused.
  const { data: organizations = [] } = useOrganizationsQuery(undefined, {
    skip: me?.role !== "super_admin",
  });
  return suggestionOwners(me, organizations);
}

export default useSuggestionOwners;
