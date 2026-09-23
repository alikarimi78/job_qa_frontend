/** Form state of the job editor: default values from the record, swapping an alias into the title, and submitting a request body (then resetting to a blank form on success). */
import { useForm } from "react-hook-form";
import { swapAliasWithTitle } from "@utils/jobRecord";
import { buildFormValues, buildRequestBody } from "./jobFormValues";

const EDIT_OPTIONS = { shouldDirty: true, shouldValidate: true };

export default function useJobForm({ initial, owners, allowPublic, defaultOwner, onSubmit }) {
  const methods = useForm({
    defaultValues: buildFormValues(initial, owners, allowPublic, defaultOwner),
  });

  const promoteAliasToTitle = (alias) => {
    const currentTitle = methods.getValues("job_title").trim();
    const aliases = methods.getValues("aliases") ?? [];
    methods.setValue("job_title", alias, EDIT_OPTIONS);
    methods.setValue("aliases", swapAliasWithTitle(aliases, alias, currentTitle), EDIT_OPTIONS);
  };

  const resetToBlank = () => methods.reset(buildFormValues(null, owners, allowPublic, defaultOwner));

  const submit = methods.handleSubmit((values) =>
    onSubmit(buildRequestBody(values, owners.length > 0), resetToBlank)
  );

  return { methods, submit, promoteAliasToTitle };
}
