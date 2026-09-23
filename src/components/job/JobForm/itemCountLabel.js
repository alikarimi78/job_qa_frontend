/** Caption under an editable field's title: how many items it holds, or that it is still empty. */
import { faNumber } from "@utils/numbers";

export const itemCountLabel = (list) =>
  list.value.length ? `${faNumber(list.value.length)} مورد` : "هنوز موردی افزوده نشده است";
