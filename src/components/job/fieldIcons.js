/** The icon that stands for each job field in its box header, with a list icon for any field not named here. */
import {
  BookIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  ListIcon,
  TagIcon,
  ToolboxIcon,
  TrendingUpIcon,
  WorkplaceIcon,
  WrenchIcon,
  ZapIcon,
} from "@components/icons";

const FIELD_ICONS = {
  job_title: BriefcaseIcon,
  responsibilities: ClipboardCheckIcon,
  description: FileTextIcon,
  tools: ToolboxIcon,
  work_context: WorkplaceIcon,
  career_path_next: TrendingUpIcon,
  aliases: TagIcon,
  skills: WrenchIcon,
  knowledge: BookIcon,
  abilities: ZapIcon,
};

export const fieldIcon = (key) => FIELD_ICONS[key] ?? ListIcon;
