/** Orders a job's fields into display blocks: every field on its own, except skills, knowledge and abilities, which are gathered into one competency block where the first of them appeared. */
import { COMPETENCY_KEYS } from "@constants/jobFields";

export function groupCompetencies(fields) {
  const competencyFields = COMPETENCY_KEYS.map((key) => fields.find((field) => field.key === key)).filter(
    Boolean
  );
  const blocks = [];
  let isGroupPlaced = false;
  for (const field of fields) {
    if (!COMPETENCY_KEYS.includes(field.key)) {
      blocks.push({ field });
    } else if (!isGroupPlaced) {
      blocks.push({ group: competencyFields });
      isGroupPlaced = true;
    }
  }
  return blocks;
}
