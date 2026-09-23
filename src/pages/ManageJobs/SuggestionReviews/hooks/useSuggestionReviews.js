/** Logic of the review queue: pending suggestions (filterable by scope for a super admin), expanding one to read it, approving, rejecting or correcting it, and starting or following an embedding rebuild. */
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ROLES } from "@constants/roles";
import useRebuildStatus from "@hooks/useRebuildStatus";
import { useOrganizationsQuery } from "@services/accountsApi";
import {
  useApproveSuggestionMutation,
  useRebuildMutation,
  useRejectSuggestionMutation,
  useSuggestionsQuery,
  useUpdateSuggestionMutation,
} from "@services/adminApi";
import { errorMessage } from "@utils/errors";
import { indexById, organizationName, scopeFilterParams } from "@utils/organizations";
import { showMessage } from "@utils/toast";

const NO_SCOPE_FILTER = { organizationId: undefined, publicOnly: false };

function scopeBadgeOf(suggestion, organizationsById) {
  if (suggestion.organization_id == null) return { label: "عمومی", tone: "neutral" };
  return {
    label: `اختصاصی — ${organizationName(organizationsById, suggestion.organization_id)}`,
    tone: "accent",
  };
}

export default function useSuggestionReviews() {
  const currentUser = useOutletContext();
  const isSuperAdmin = currentUser.role === ROLES.superAdmin;
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [scopeFilter, setScopeFilter] = useState("");

  const { data: organizations = [] } = useOrganizationsQuery();
  const organizationsById = indexById(organizations);
  const { data: pendingSuggestions = [], isLoading } = useSuggestionsQuery(
    isSuperAdmin ? scopeFilterParams(scopeFilter) : NO_SCOPE_FILTER
  );
  const [approveSuggestion] = useApproveSuggestionMutation();
  const [rejectSuggestion] = useRejectSuggestionMutation();
  const [updateSuggestion, { isLoading: isSaving }] = useUpdateSuggestionMutation();
  const [startRebuild, { isLoading: isStartingRebuild }] = useRebuildMutation();
  const { rebuildStatus, isRebuilding } = useRebuildStatus();

  const forgetIfShowing = (id) => {
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) setEditingId(null);
  };

  const decide = async (suggestion, request, successMessage) => {
    try {
      await request(suggestion.id).unwrap();
      forgetIfShowing(suggestion.id);
      showMessage.success(successMessage);
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  const approve = (suggestion) =>
    decide(
      suggestion,
      approveSuggestion,
      `«${suggestion.job_title}» تایید شد؛ بازسازی امبدینگ‌ها آغاز شد و وضعیت آن در همین صفحه نمایش داده می‌شود.`
    );

  const reject = (suggestion) =>
    decide(suggestion, rejectSuggestion, `«${suggestion.job_title}» رد شد.`);

  const saveEdit = async (body) => {
    const id = editingId;
    try {
      await updateSuggestion({ id, ...body }).unwrap();
      setEditingId(null);
      setExpandedId(id);
      showMessage.success("تغییرات ذخیره شد؛ پیشنهاد همچنان در انتظار تصمیم شماست.");
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  const rebuildNow = async () => {
    try {
      await startRebuild().unwrap();
      showMessage.info("بازسازی آغاز شد؛ تحلیل در این مدت با نسخه پیشین پاسخ می‌دهد.");
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  return {
    isSuperAdmin,
    organizations,
    scopeFilter,
    setScopeFilter,
    isLoading,
    suggestions: pendingSuggestions.map((suggestion) => ({
      ...suggestion,
      scope: scopeBadgeOf(suggestion, organizationsById),
      isExpanded: expandedId === suggestion.id,
    })),
    toggleExpanded: (id) => setExpandedId((currentId) => (currentId === id ? null : id)),
    approve,
    reject,
    editingSuggestion:
      editingId === null ? null : pendingSuggestions.find((suggestion) => suggestion.id === editingId),
    startEditing: (id) => setEditingId(id),
    stopEditing: () => setEditingId(null),
    saveEdit,
    isSaving,
    rebuild: {
      status: rebuildStatus,
      isRunning: isRebuilding,
      isStarting: isStartingRebuild,
      canStart: isSuperAdmin,
      start: rebuildNow,
    },
  };
}
