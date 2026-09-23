/** The composed job opened in the job editor, so the user can correct it before filing it as a suggestion. */
import Button from "@components/ui/Button";
import JobForm from "@components/job/JobForm/JobForm";

export default function DraftEditor({ draft }) {
  return (
    <section>
      <JobForm
        initial={draft.editorInitial}
        primary={draft.primaryFieldKeys}
        onSubmit={draft.fileSuggestion}
        submitLabel="ثبت پیشنهاد"
        busy={draft.isFiling}
        owners={draft.owners}
        actions={
          <Button variant="outline" size="lg" onClick={draft.cancelEditing} disabled={draft.isFiling}>
            انصراف
          </Button>
        }
      />
    </section>
  );
}
