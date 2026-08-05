import { Outlet } from "react-router-dom";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Loader from "@components/ui/Loader";
import { ROLE_LABELS } from "@routes/roles";
import { useCurrentUserQuery } from "@services/authApi";
import { errorMessage } from "@utils/errors";

// The shell the management sections sit in. `/auth/me` is asked for once here rather
// than by each of the five pages: it is what every one of them scopes itself with, and
// it is the one call that decides whether the section can be shown at all.
//
// The pages read it back through the outlet context, so none of them re-derives the
// caller's organization or unit from the account list.
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

  return (
    <>
      <Card size="small">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-slate-800">{me.username}</span>
          <Badge tone="accent">{ROLE_LABELS[me.role] ?? me.role}</Badge>
          {me.organization && <Badge tone="neutral">{me.organization.name}</Badge>}
          {me.unit && <Badge tone="neutral">{me.unit.name}</Badge>}
        </div>
      </Card>

      <Outlet context={me} />
    </>
  );
}
