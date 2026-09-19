import { useCurrentUserQuery } from "@services/authApi";
import { useOrganizationsQuery } from "@services/accountsApi";

// Which owners a suggestion may name, mirroring the backend's `assert_can_suggest_job`: the
// public corpus is always open, a super_admin may name any organization, and every other
// account only the one it sits in. An account in no organization gets no owners at all, so
// JobForm draws no choice and the suggestion goes public. `defaultOwner` is the choice made
// until the reader makes one: the organization they sit in, so the suggestion reaches their
// own admin's queue, or null — the public corpus — for a super_admin and an account in none.
export function suggestionOwners(me, organizations = []) {
  if (me?.role === "super_admin") {
    return { owners: organizations, allowPublic: true, defaultOwner: null };
  }
  const own = me?.organization ?? null;
  return { owners: own ? [own] : [], allowPublic: true, defaultOwner: own?.id ?? null };
}

export function useSuggestionOwners() {
  const { data: me, isLoading: meLoading } = useCurrentUserQuery();
  // `GET /orgs` answers a super_admin with every organization; anyone else needs none, their
  // own arriving on `/auth/me`, and a plain user would only be refused.
  const { data: organizations = [], isLoading: orgsLoading } = useOrganizationsQuery(undefined, {
    skip: me?.role !== "super_admin",
  });
  // Until both have arrived the choice would offer the public corpus alone, and a super_admin
  // filing in that moment could not pick an organization at all.
  return { ...suggestionOwners(me, organizations), loading: meLoading || orgsLoading };
}

export default useSuggestionOwners;
