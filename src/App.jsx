/** Root component: the app's routes plus the toast container that every page's notifications appear in. */
import { Toaster } from "react-hot-toast";
import AppRoutes from "@routes/AppRoutes";

const TOAST_Z_INDEX = 99999999;

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: TOAST_Z_INDEX }}
        toastOptions={{ style: { zIndex: TOAST_Z_INDEX } }}
      />
    </>
  );
}
