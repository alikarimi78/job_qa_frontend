import { Outlet } from "react-router-dom";
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import { useCurrentUserQuery } from "@services/authApi";
import { errorMessage } from "@utils/errors";

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
