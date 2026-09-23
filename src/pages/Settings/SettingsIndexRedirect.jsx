/** Opening /settings itself goes straight to the first settings tab the role may see. */
import { Navigate, useOutletContext } from "react-router-dom";
import { settingsTabsFor } from "./constants";

export default function SettingsIndexRedirect() {
  const currentUser = useOutletContext();
  return <Navigate to={settingsTabsFor(currentUser.role)[0].path} replace />;
}
