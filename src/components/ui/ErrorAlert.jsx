/** Red box that shows a request's error as a translated Persian message. */
import { errorMessage } from "@utils/errors";

export default function ErrorAlert({ error }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
      {errorMessage(error)}
    </div>
  );
}
