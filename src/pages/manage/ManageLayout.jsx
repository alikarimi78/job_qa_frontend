import { Outlet } from "react-router-dom";
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import { useCurrentUserQuery } from "@services/authApi";
import { errorMessage } from "@utils/errors";

// The shell the management sections sit in. `/auth/me` is asked for once here rather
// than by each of the pages: it is what every one of them scopes itself with, and it
// is the one call that decides whether the section can be shown at all.
//
// The pages read it back through the outlet context, so none of them re-derives the
// caller's organization or unit from the account list.
//
// It used to draw a strip of badges naming the caller above every page. Each page now
// opens with its own `ui/PageToolbar`, and the header's dropdown already answers who
// you are and which organization and unit you are in — two headers stacked above one
// table was one more than the section needed.
export default function ManageLayout() {
  const { data: me, isLoading, error } = useCurrentUserQuery();

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Card>
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMessage(error)}
        </div>
      </Card>
    );
  }

  return <Outlet context={me} />;
}
