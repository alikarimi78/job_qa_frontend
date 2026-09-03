import { errorMessage } from "./errors";
import { showMessage } from "./toast";

// Every mutation on the management pages reports itself the same way: the server's own
// message on failure — it is already Persian and already says which admin is sitting in
// the seat or what is still inside the organization — and one line on success.
//
// The lists refresh themselves; each mutation invalidates the tags they are cached
// under, so nothing here refetches by hand.
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
