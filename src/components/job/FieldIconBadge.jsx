/** Icon badge for a job field, in that field's accent colour. */
import IconBadge from "@components/ui/IconBadge";
import { fieldIcon } from "./fieldIcons";
import { fieldTheme } from "./fieldTheme";

export default function FieldIconBadge({ fieldKey, theme = fieldTheme(fieldKey), size }) {
  return <IconBadge theme={theme} icon={fieldIcon(fieldKey)} size={size} />;
}
