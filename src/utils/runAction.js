/** Runs an RTK Query mutation and reports the outcome as a toast, so a page handler needs only the request and its success message. */
import { errorMessage } from "./errors";
import { showMessage } from "./toast";

export async function runAction(request, successMessage, onSuccess) {
  try {
    await request().unwrap();
    showMessage.success(successMessage);
    onSuccess?.();
    return true;
  } catch (error) {
    showMessage.error(errorMessage(error));
    return false;
  }
}
