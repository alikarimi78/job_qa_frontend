/** The site root: sends admins to the dashboard and everyone else to the job analysis page. */
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { selectRole } from "@store/slices/authSlice";
import { landingPathFor } from "./paths";

export default function LandingRedirect() {
  const role = useAppSelector(selectRole);
  return <Navigate to={landingPathFor(role)} replace />;
}
