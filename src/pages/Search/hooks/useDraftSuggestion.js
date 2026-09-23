/** Life of a job the search composed but the database lacks: accept it (after choosing public or an organization), decline it, or edit it first — including swapping an alias into its title — and file it as a suggestion. */
import { useState } from "react";
import { PUBLIC_OWNER } from "@constants/organizationScope";
import useSuggestionOwners from "@hooks/useSuggestionOwners";
import { useSuggestJobMutation } from "@services/jobsApi";
import { cellFromItems, itemsFromCell } from "@utils/itemCells";
import { swapAliasWithTitle } from "@utils/jobRecord";
import { errorMessage } from "@utils/errors";
import { showMessage } from "@utils/toast";

const FILED_MESSAGE = "پیشنهاد شما ثبت شد و در انتظار بررسی مدیر سامانه است.";

function ownerChoicesFor(owners) {
  return [
    {
      value: PUBLIC_OWNER,
      title: "عمومی — همه سازمان‌ها",
      hint: "این شغل در نتایج تحلیل کاربران تمامی سازمان‌ها دیده می‌شود.",
      isPublic: true,
    },
    ...owners.map((organization) => ({
      value: String(organization.id),
      title: `اختصاصی — ${organization.name}`,
      hint: "این شغل تنها در نتایج تحلیل کاربران همین سازمان دیده می‌شود.",
      isPublic: false,
    })),
  ];
}

export default function useDraftSuggestion({ draftJob, draftDetail, hasDraftOffer }) {
  const [isDeclined, setIsDeclined] = useState(false);
  const [isFiled, setIsFiled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChoosingOwner, setIsChoosingOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [editedDraft, setEditedDraft] = useState(null);
  const { owners, defaultOwner, loading: areOwnersLoading } = useSuggestionOwners();
  const [suggestJob, { isLoading: isFiling }] = useSuggestJobMutation();

  const chosenOwner = selectedOwner ?? (defaultOwner == null ? PUBLIC_OWNER : String(defaultOwner));
  const chosenOrganizationId = chosenOwner === PUBLIC_OWNER ? null : Number(chosenOwner);
  const isOpen = hasDraftOffer && !isFiled && !isDeclined;

  const fileSuggestion = async (body) => {
    try {
      await suggestJob(body).unwrap();
      setIsFiled(true);
      setIsEditing(false);
      setIsChoosingOwner(false);
      showMessage.success(FILED_MESSAGE);
    } catch (error) {
      showMessage.error(errorMessage(error));
    }
  };

  const fileWithChosenOwner = () => {
    const body = { ...draftJob };
    if (owners.length) body.organization_id = chosenOrganizationId;
    fileSuggestion(body);
  };

  const pickAlias = (alias) => {
    const aliases = swapAliasWithTitle(itemsFromCell(draftJob.aliases ?? ""), alias, draftJob.job_title);
    setEditedDraft({ ...draftJob, job_title: alias, aliases: cellFromItems(aliases) });
    setIsEditing(true);
  };

  const startEditing = () => {
    setEditedDraft(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedDraft(null);
  };

  return {
    isOpen,
    isFiled,
    isDeclined,
    isEditing,
    isFiling,
    areOwnersLoading,
    owners,
    decline: () => setIsDeclined(true),
    startEditing,
    cancelEditing,
    pickAlias: isOpen ? pickAlias : undefined,
    fileSuggestion,
    editorInitial: { ...(editedDraft ?? draftJob), organization_id: chosenOrganizationId },
    primaryFieldKeys: (draftDetail?.fields ?? [])
      .filter((field) => field.primary)
      .map((field) => field.key),
    ownerChoice: {
      isOpen: hasDraftOffer && isChoosingOwner,
      choices: ownerChoicesFor(owners),
      chosenOwner,
      choose: setSelectedOwner,
      open: () => setIsChoosingOwner(true),
      close: () => {
        if (!isFiling) setIsChoosingOwner(false);
      },
      confirm: fileWithChosenOwner,
      jobTitle: draftJob?.job_title ?? "",
    },
  };
}
