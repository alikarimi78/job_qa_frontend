/** Card props that give a dashboard card its coloured heading band and large icon badge. */
import IconBadge from "@components/ui/IconBadge";

export const cardHeading = (theme, Icon) => ({
  icon: <IconBadge theme={theme} icon={Icon} size="panel" />,
  tint: theme.headerGradient,
});
