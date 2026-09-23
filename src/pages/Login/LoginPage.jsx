/** Sign-in page: the form panel beside a showcase of what the system does. */
import useDocumentTitle from "@hooks/useDocumentTitle";
import LoginPanel from "./components/LoginPanel";
import LoginShowcase from "./components/LoginShowcase";
import useLogin from "./hooks/useLogin";

export default function LoginPage() {
  const login = useLogin();
  useDocumentTitle("ورود");

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:grid lg:grid-cols-[minmax(340px,30%)_1fr]">
      <LoginPanel login={login} />
      <LoginShowcase />
    </div>
  );
}
