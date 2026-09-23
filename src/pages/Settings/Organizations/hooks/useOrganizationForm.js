/** Form of the organization dialog: fills it from the organization (or blank) each time it opens, and submits trimmed values plus the logo when it was changed. */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BLANK_ORGANIZATION } from "../constants";
import useLogoPicker from "./useLogoPicker";

const formValuesOf = (organization) =>
  Object.fromEntries(
    Object.keys(BLANK_ORGANIZATION).map((key) => [key, organization?.[key] ?? ""])
  );

const trimmedValues = (values) =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]));

export default function useOrganizationForm({ open, organization, initialLogo, onSubmit, onClose }) {
  const methods = useForm({ defaultValues: BLANK_ORGANIZATION });
  const logoPicker = useLogoPicker(initialLogo);
  const { reset: resetLogo } = logoPicker;

  useEffect(() => {
    if (!open) return;
    methods.reset(formValuesOf(organization));
    resetLogo();
  }, [open, organization]);

  const submit = methods.handleSubmit((values) => {
    const body = trimmedValues(values);
    if (logoPicker.logo !== null) body.logo = logoPicker.logo;
    onSubmit(body, onClose);
  });

  return { methods, submit, logoPicker };
}
