/** Editor for a whole job record, laid out like the read-only job boxes; used to suggest a job, correct a suggestion under review and edit a stored job. Without `formId` it renders its own submit bar. */
import { FormProvider } from "react-hook-form";
import SubmitBar from "@components/ui/SubmitBar";
import CompetencyShell from "../JobDetails/CompetencyShell";
import { groupCompetencies } from "../JobDetails/groupCompetencies";
import CompetencyFieldEditor from "./CompetencyFieldEditor";
import DescriptionEditor from "./DescriptionEditor";
import JobTitleEditor from "./JobTitleEditor";
import ListFieldEditor from "./ListFieldEditor";
import { orderFormFields } from "./jobFormValues";
import useJobForm from "./useJobForm";

function FieldEditorBlock({ block, onPromoteAlias }) {
  if (block.group) {
    return (
      <CompetencyShell size={block.group.length}>
        {block.group.map((field) => (
          <CompetencyFieldEditor key={field.key} fieldKey={field.key} primary={field.primary} />
        ))}
      </CompetencyShell>
    );
  }
  if (block.field.key === "description") {
    return <DescriptionEditor primary={block.field.primary} />;
  }
  return (
    <ListFieldEditor
      fieldKey={block.field.key}
      primary={block.field.primary}
      onPromote={onPromoteAlias}
    />
  );
}

export default function JobForm({
  onSubmit,
  submitLabel,
  busy,
  initial,
  actions,
  formId,
  owners = [],
  allowPublic = true,
  defaultOwner = null,
  primary = [],
}) {
  const { methods, submit, promoteAliasToTitle } = useJobForm({
    initial,
    owners,
    allowPublic,
    defaultOwner,
    onSubmit,
  });

  return (
    <FormProvider {...methods}>
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4">
        <JobTitleEditor owners={owners} allowPublic={allowPublic} />

        <p className="text-xs text-slate-500 leading-6 -mt-2 mb-0">
          برای ویرایش، روی هر مورد کلیک نمایید؛ مورد جدید را با «افزودن» در هر بخش اضافه نمایید.
        </p>

        {groupCompetencies(orderFormFields(primary)).map((block) => (
          <FieldEditorBlock
            key={block.group ? "competencies" : block.field.key}
            block={block}
            onPromoteAlias={promoteAliasToTitle}
          />
        ))}

        {!formId && <SubmitBar label={submitLabel} busy={busy} actions={actions} />}
      </form>
    </FormProvider>
  );
}
