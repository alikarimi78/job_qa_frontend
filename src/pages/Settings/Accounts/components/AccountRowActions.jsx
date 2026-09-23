/** Buttons of an account row, offered only when allowed: block/unblock, reset password, change your own password, edit, view, delete. */
import {
  EyeIcon,
  KeyIcon,
  LockIcon,
  PencilIcon,
  TrashIcon,
  UnlockIcon,
} from "@components/icons";
import IconButton from "@components/ui/IconButton";
import RowActions from "@components/ui/RowActions";
import { ACCOUNT_DIALOGS } from "../constants";

export default function AccountRowActions({ account, canManage, isSelf, isBusy, onOpen, onUnblock }) {
  const open = (dialog) => () => onOpen(dialog, account);
  const toggleBlock = account.is_active ? open(ACCOUNT_DIALOGS.block) : () => onUnblock(account);

  return (
    <RowActions>
      {canManage && (
        <IconButton
          tone="neutral"
          title={account.is_active ? `مسدودکردن ${account.username}` : `رفع مسدودی ${account.username}`}
          disabled={isBusy}
          onClick={toggleBlock}
        >
          {account.is_active ? <LockIcon /> : <UnlockIcon />}
        </IconButton>
      )}
      {canManage && (
        <IconButton
          tone="warning"
          title={`تغییر رمز ${account.username}`}
          disabled={isBusy}
          onClick={open(ACCOUNT_DIALOGS.resetPassword)}
        >
          <KeyIcon />
        </IconButton>
      )}
      {isSelf && (
        <IconButton
          tone="warning"
          title="تغییر رمز عبور خود"
          disabled={isBusy}
          onClick={open(ACCOUNT_DIALOGS.changeOwnPassword)}
        >
          <KeyIcon />
        </IconButton>
      )}
      {(canManage || isSelf) && (
        <IconButton
          tone="edit"
          title={`ویرایش کاربر ${account.username}`}
          disabled={isBusy}
          onClick={open(ACCOUNT_DIALOGS.edit)}
        >
          <PencilIcon />
        </IconButton>
      )}
      <IconButton tone="view" title={`مشاهده کاربر ${account.username}`} onClick={open(ACCOUNT_DIALOGS.view)}>
        <EyeIcon />
      </IconButton>
      {canManage && (
        <IconButton
          tone="danger"
          title={`حذف کاربر ${account.username}`}
          disabled={isBusy}
          onClick={open(ACCOUNT_DIALOGS.delete)}
        >
          <TrashIcon />
        </IconButton>
      )}
    </RowActions>
  );
}
