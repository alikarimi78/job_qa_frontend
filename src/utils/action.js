import { errorMessage } from "./errors";
import { showMessage } from "./toast";

export async function runAction(run, message, reset) {
  try {
    await run().unwrap();
    showMessage.success(message);
    reset?.();
    return true;
  } catch (err) {
    showMessage.error(errorMessage(err));
    return false;
  }
}

export default runAction;
