/** Logic of the accounts page: the organization and username filters, the dialog that is open and for which account, and every account action (block, unblock, reset or change password, rename, move, delete). */
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ROLES } from "@constants/roles";
import useDialogState from "@hooks/useDialogState";
import {
  useAccountsQuery,
  useBlockAccountMutation,
  useDeleteAccountMutation,
  useMoveAccountOrganizationMutation,
  useOrganizationsQuery,
  useRenameAccountMutation,
  useResetPasswordMutation,
  useUnblockAccountMutation,
} from "@services/accountsApi";
import { useChangeOwnNameMutation, useChangeOwnPasswordMutation } from "@services/authApi";
import { indexById, organizationName } from "@utils/organizations";
import { runAction } from "@utils/runAction";
import { foldText, matchesQuery } from "@utils/text";
import { canMoveOrganization } from "../accountPermissions";
import { ACCOUNT_DIALOGS } from "../constants";
import useAccountEditForm from "./useAccountEditForm";
import useNewAccountForm from "./useNewAccountForm";

const isNameChanged = (account, { first_name, last_name }) =>
  first_name !== (account.first_name ?? "") || last_name !== (account.last_name ?? "");

export default function useAccounts() {
  const currentUser = useOutletContext();
  const isSuperAdmin = currentUser.role === ROLES.superAdmin;
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dialogs = useDialogState();
  const selectedAccount = dialogs.target;

  const { data: accounts = [] } = useAccountsQuery();
  const { data: organizations = [] } = useOrganizationsQuery();
  const organizationsById = indexById(organizations);

  const [blockAccount, blockState] = useBlockAccountMutation();
  const [unblockAccount, unblockState] = useUnblockAccountMutation();
  const [resetPassword, resetPasswordState] = useResetPasswordMutation();
  const [deleteAccount, deleteState] = useDeleteAccountMutation();
  const [moveAccountOrganization, moveState] = useMoveAccountOrganizationMutation();
  const [changeOwnPassword, changeOwnPasswordState] = useChangeOwnPasswordMutation();
  const [renameAccount, renameState] = useRenameAccountMutation();
  const [changeOwnName, changeOwnNameState] = useChangeOwnNameMutation();
  const isBusy = [
    blockState,
    unblockState,
    resetPasswordState,
    deleteState,
    moveState,
    changeOwnPasswordState,
    renameState,
    changeOwnNameState,
  ].some((state) => state.isLoading);

  const editForm = useAccountEditForm(organizations);
  const newAccount = useNewAccountForm({ currentUser, accounts, organizations });

  const filterOrganizationId = organizationFilter === "" ? null : Number(organizationFilter);
  const foldedQuery = foldText(searchTerm);
  const visibleAccounts = accounts.filter(
    (account) =>
      (filterOrganizationId == null || account.organization_id === filterOrganizationId) &&
      matchesQuery(account.username, foldedQuery)
  );

  const organizationLabelOf = (account) =>
    account.organization_id == null ? "—" : organizationName(organizationsById, account.organization_id);

  const openDialog = (kind, account) => {
    if (kind === ACCOUNT_DIALOGS.edit) editForm.prepare(account);
    dialogs.open(kind, account);
  };

  const rename = (account, name) =>
    account.id === currentUser.id
      ? changeOwnName(name)
      : renameAccount({ id: account.id, ...name });

  const saveAccount = async (name) => {
    const account = selectedAccount;
    if (isNameChanged(account, name)) {
      const isRenamed = await runAction(() => rename(account, name), `نام «${account.username}» ثبت شد.`);
      if (!isRenamed) return;
    }

    const destinationId = editForm.movedOrganizationId(
      account,
      canMoveOrganization(currentUser, account)
    );
    if (destinationId != null) {
      const isMoved = await runAction(
        () => moveAccountOrganization({ id: account.id, organizationId: destinationId }),
        `«${account.username}» به سازمان «${organizationName(organizationsById, destinationId)}» منتقل شد.`
      );
      if (!isMoved) return;
    }
    dialogs.close();
  };

  return {
    currentUser,
    isSuperAdmin,
    organizations,
    organizationFilter,
    setOrganizationFilter,
    searchTerm,
    changeSearchTerm: (event) => setSearchTerm(event.target.value),
    isFiltering: Boolean(foldedQuery),
    visibleAccounts,
    organizationLabelOf,
    isBusy,
    dialogs,
    selectedAccount,
    openDialog,
    editForm,
    newAccount,
    saveAccount,
    block: () =>
      runAction(
        () => blockAccount(selectedAccount.id),
        `کاربر «${selectedAccount.username}» مسدود شد.`,
        dialogs.close
      ),
    unblock: (account) =>
      runAction(() => unblockAccount(account.id), `کاربر «${account.username}» رفع مسدودی شد.`),
    resetPassword: (password, onSuccess) =>
      runAction(
        () => resetPassword({ id: selectedAccount.id, password }),
        `رمز «${selectedAccount.username}» تغییر کرد.`,
        onSuccess
      ),
    changeOwnPassword: (values, onSuccess) =>
      runAction(() => changeOwnPassword(values), "رمز شما تغییر کرد.", onSuccess),
    remove: () =>
      runAction(
        () => deleteAccount(selectedAccount.id),
        `کاربر «${selectedAccount.username}» حذف شد.`,
        dialogs.close
      ),
  };
}
