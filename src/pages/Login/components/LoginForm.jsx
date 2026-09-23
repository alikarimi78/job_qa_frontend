/** Username and password fields with the sign-in button and the note that accounts are created by the organization's admin. */
import { FormProvider } from "react-hook-form";
import { LogInIcon } from "@components/icons";
import BusyLabel from "@components/ui/BusyLabel";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import PasswordVisibilityButton from "./PasswordVisibilityButton";

export default function LoginForm({ login }) {
  return (
    <FormProvider {...login.methods}>
      <form onSubmit={login.submit} className="flex flex-col gap-5">
        <Input
          name="username"
          label="نام کاربری"
          placeholder="نام کاربری را وارد نمایید"
          className="w-full"
          inputProps={{ autoComplete: "username", autoFocus: true }}
          rules={{ required: "نام کاربری را وارد نمایید" }}
        />
        <Input
          name="password"
          type={login.isPasswordVisible ? "text" : "password"}
          label="کلمه عبور"
          placeholder="کلمه عبور را وارد نمایید"
          className="w-full"
          inputProps={{ autoComplete: "current-password" }}
          rules={{ required: "کلمه عبور را وارد نمایید" }}
          suffix={
            <PasswordVisibilityButton
              isVisible={login.isPasswordVisible}
              onToggle={login.togglePasswordVisible}
            />
          }
        />

        <Button
          variant="primary"
          size="xl"
          className="w-full mt-1"
          type="submit"
          disabled={login.isSubmitting}
        >
          <BusyLabel isBusy={login.isSubmitting} busyText="در حال ورود...">
            <>
              ورود به سامانه
              <LogInIcon />
            </>
          </BusyLabel>
        </Button>

        <p className="text-xs text-slate-400 leading-6 m-0">
          ایجاد حساب کاربری بر عهده مدیر سازمان شماست؛ امکان ثبت‌نام آزاد وجود ندارد.
        </p>
      </form>
    </FormProvider>
  );
}
