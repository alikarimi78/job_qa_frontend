/** Which accent colour each job field is drawn in: identity fields emerald, competencies violet, context sky, career path orange, the rest slate. */
import { ACCENT_THEMES } from "@constants/accentThemes";

const FIELD_ACCENTS = {
  job_title: "emerald",
  responsibilities: "emerald",
  description: "emerald",
  skills: "violet",
  knowledge: "violet",
  abilities: "violet",
  tools: "sky",
  work_context: "sky",
  career_path_next: "orange",
  aliases: "slate",
};

export const fieldTheme = (key) => ACCENT_THEMES[FIELD_ACCENTS[key]] ?? ACCENT_THEMES.slate;
