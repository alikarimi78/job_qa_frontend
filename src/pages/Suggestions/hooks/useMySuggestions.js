/** The user's own job suggestions, each with its review status and whether it is public or for the user's organization. */
import { SUGGESTION_STATUS } from "@constants/suggestionStatus";
import { useCurrentUserQuery } from "@services/authApi";
import { useMySuggestionsQuery } from "@services/jobsApi";

function scopeOf(suggestion, currentUser) {
  if (suggestion.organization_id == null) return { label: "عمومی", tone: "neutral" };
  const isOwnOrganization = currentUser?.organization?.id === suggestion.organization_id;
  return {
    label: isOwnOrganization ? `اختصاصی — ${currentUser.organization.name}` : "اختصاصی",
    tone: "accent",
  };
}

const statusOf = (suggestion) =>
  SUGGESTION_STATUS[suggestion.status] ?? { label: suggestion.status, tone: "neutral" };

export default function useMySuggestions() {
  const { data: suggestions = [], isLoading, error } = useMySuggestionsQuery();
  const { data: currentUser } = useCurrentUserQuery();

  return {
    suggestions: suggestions.map((suggestion) => ({
      ...suggestion,
      scope: scopeOf(suggestion, currentUser),
      statusBadge: statusOf(suggestion),
    })),
    isLoading,
    error,
    isEmpty: !isLoading && !error && suggestions.length === 0,
  };
}
