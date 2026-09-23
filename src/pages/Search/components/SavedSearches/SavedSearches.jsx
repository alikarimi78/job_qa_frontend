/** The starred tab of the analysis page: the list of starred analyses or one of them opened, and the confirmation before removing one. */
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import useSavedSearches from "../../hooks/useSavedSearches";
import SavedSearchList from "./SavedSearchList";
import SavedSearchView from "./SavedSearchView";

export default function SavedSearches() {
  const saved = useSavedSearches();

  return (
    <>
      {saved.openId != null ? (
        <SavedSearchView id={saved.openId} onBack={saved.close} onRemove={saved.askToRemove} />
      ) : (
        <SavedSearchList saved={saved} />
      )}

      <ConfirmDialog
        open={saved.pendingRemoval !== null}
        title="حذف از تحلیل‌های ستاره‌دار"
        message={`آیا «${saved.pendingRemoval?.question ?? ""}» از فهرست ستاره‌دارها حذف شود؟ نتیجه ذخیره‌شده آن پاک می‌شود و برای دیدن دوباره باید تحلیل را از نو انجام دهید.`}
        busy={saved.isRemoving}
        onClose={saved.cancelRemoval}
        onConfirm={saved.confirmRemoval}
      />
    </>
  );
}
