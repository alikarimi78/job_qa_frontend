/** The competency block (skills, knowledge, abilities) is drawn in the colour of its first member. */
import { COMPETENCY_KEYS } from "@constants/jobFields";
import { fieldTheme } from "../fieldTheme";

export const competencyTheme = () => fieldTheme(COMPETENCY_KEYS[0]);
