/** Button content that swaps to a spinner and a "working" text while a request is running. */
import Spinner from "./Spinner";

export default function BusyLabel({ isBusy, busyText, children }) {
  if (!isBusy) return children;
  return (
    <>
      <Spinner />
      {busyText}
    </>
  );
}
