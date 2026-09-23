/** Wrapper of the admin sections (management and settings): loads the signed-in account once and hands it to the nested pages through the outlet context. */
import { Outlet } from "react-router-dom";
import Card from "@components/ui/Card";
import ErrorAlert from "@components/ui/ErrorAlert";
import Loader from "@components/ui/Loader";
import { useCurrentUserQuery } from "@services/authApi";

export default function AdminLayout() {
  const { data: currentUser, isLoading, error } = useCurrentUserQuery();

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Card>
        <ErrorAlert error={error} />
      </Card>
    );
  }

  return <Outlet context={currentUser} />;
}
