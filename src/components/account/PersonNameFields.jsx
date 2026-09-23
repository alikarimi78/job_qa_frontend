/** First-name and last-name inputs (both required) for any react-hook-form form that edits a person. */
import Input from "@components/ui/Input";
import RequiredLabel from "@components/ui/RequiredLabel";
import { PERSON_NAME_MAX_LENGTH } from "@constants/formRules";

export default function PersonNameFields() {
  return (
    <>
      <Input
        name="first_name"
        label={<RequiredLabel>نام</RequiredLabel>}
        rules={{ required: "نام لازم است", maxLength: PERSON_NAME_MAX_LENGTH }}
      />
      <Input
        name="last_name"
        label={<RequiredLabel>نام خانوادگی</RequiredLabel>}
        rules={{ required: "نام خانوادگی لازم است", maxLength: PERSON_NAME_MAX_LENGTH }}
      />
    </>
  );
}
