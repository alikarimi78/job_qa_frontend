/** Buttons of an organization row: add an admin (when it has none), edit, view and delete. */
import { EyeIcon, PencilIcon, TrashIcon, UserPlusIcon } from "@components/icons";
import IconButton from "@components/ui/IconButton";
import RowActions from "@components/ui/RowActions";
import { ORGANIZATION_DIALOGS } from "../constants";

export default function OrganizationRowActions({ organization, hasAdmin, onOpen }) {
  const open = (dialog) => () => onOpen(dialog, organization);

  return (
    <RowActions>
      {!hasAdmin && (
        <IconButton
          tone="neutral"
          title={`تعریف ادمین برای ${organization.name}`}
          onClick={open(ORGANIZATION_DIALOGS.addAdmin)}
        >
          <UserPlusIcon />
        </IconButton>
      )}
      <IconButton
        tone="edit"
        title={`ویرایش سازمان ${organization.name}`}
        onClick={open(ORGANIZATION_DIALOGS.edit)}
      >
        <PencilIcon />
      </IconButton>
      <IconButton
        tone="view"
        title={`مشاهده سازمان ${organization.name}`}
        onClick={open(ORGANIZATION_DIALOGS.view)}
      >
        <EyeIcon />
      </IconButton>
      <IconButton
        tone="danger"
        title={`حذف سازمان ${organization.name}`}
        onClick={open(ORGANIZATION_DIALOGS.delete)}
      >
        <TrashIcon />
      </IconButton>
    </RowActions>
  );
}
