/** Form of the "edit account" dialog: first and last name, and the destination organization, prepared from the account each time the dialog is opened. */
import { useState } from "react";
import { useForm } from "react-hook-form";

const BLANK_NAME = { first_name: "", last_name: "" };

export default function useAccountEditForm(organizations) {
  const methods = useForm({ defaultValues: BLANK_NAME });
  const [destinationId, setDestinationId] = useState("");

  const prepare = (account) => {
    setDestinationId(String(account.organization_id ?? organizations[0]?.id ?? ""));
    methods.reset({
      first_name: account.first_name ?? "",
      last_name: account.last_name ?? "",
    });
  };

  const movedOrganizationId = (account, canMove) => {
    const destination = Number(destinationId);
    const isMoved = canMove && String(destination) !== String(account.organization_id ?? "");
    return isMoved ? destination : null;
  };

  return {
    methods,
    destinationId,
    changeDestination: (event) => setDestinationId(event.target.value),
    prepare,
    movedOrganizationId,
  };
}
