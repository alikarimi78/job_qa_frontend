import { FormProvider, useForm } from "react-hook-form";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import SubmitBar from "@components/ui/SubmitBar";

// The two shapes every provisioning form in the app takes — a name, or a name and a
// password. They used to be declared inside the single management page; now that the
// page is five, they live here so the five cannot drift.
//
// Both end with a SubmitBar rather than a button beside the last field: the fields sit
// in a grid that reflows on a narrow screen, and a submit trailing the last one lands
// somewhere different at every width. Under the rule it is always in the same place.

export function CredentialsForm({ label, busy, onSubmit, hint }) {
  const methods = useForm({ defaultValues: { username: "", password: "" } });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((values) => onSubmit(values, () => methods.reset()))}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <Input
            name="username"
            label="نام کاربری"
            placeholder="نام کاربری"
            registerProps={{
              required: "نام کاربری لازم است",
              minLength: { value: 3, message: "حداقل ۳ نویسه" },
            }}
          />
          <Input
            name="password"
            type="password"
            label="رمز عبور"
            placeholder="حداقل ۸ نویسه"
            registerProps={{
              required: "رمز عبور لازم است",
              minLength: { value: 8, message: "حداقل ۸ نویسه" },
            }}
          />
        </div>
        <SubmitBar label={label} busy={busy} hint={hint} />
      </form>
    </FormProvider>
  );
}

export function NameForm({ label, fieldLabel, placeholder, busy, onSubmit, hint }) {
  const methods = useForm({ defaultValues: { name: "" } });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(({ name }) => onSubmit(name, () => methods.reset()))}>
        <Input
          name="name"
          label={fieldLabel}
          placeholder={placeholder}
          registerProps={{
            required: "نام لازم است",
            minLength: { value: 2, message: "حداقل ۲ نویسه" },
          }}
        />
        <SubmitBar label={label} busy={busy} hint={hint} />
      </form>
    </FormProvider>
  );
}

/**
 * The two-step delete every container gets. The page does not try to predict whether a
 * unit or organization is empty — it asks, and shows the 409 the server answers with,
 * which names what is still inside.
 */
export function DeleteConfirm({ item, noun, asking, busy, onAsk, onCancel, onConfirm }) {
  if (!asking) {
    return (
      <Button
        variant="danger-outline"
        size="sm"
        buttonProps={{ disabled: busy, onClick: onAsk }}
      >
        حذف
      </Button>
    );
  }
  return (
    <span className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-500">
        {noun} «{item.name}» حذف شود؟
      </span>
      <Button variant="danger" size="sm" buttonProps={{ disabled: busy, onClick: onConfirm }}>
        حذف کن
      </Button>
      <Button variant="ghost" size="sm" buttonProps={{ disabled: busy, onClick: onCancel }}>
        انصراف
      </Button>
    </span>
  );
}
