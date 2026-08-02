import Button from "@components/ui/Button";
import LoadingIcon from "@components/ui/icons/auth/loading.svg?react";
import LoginIcon from "@components/ui/icons/auth/login.svg?react";
import Input from "@components/ui/Input";
import {
  useLazyCurrentUserDataQuery,
  useLazyGetMenuItemsQuery,
  useLoginMutation,
} from "@services/authSlice";
import { IPayloadLogin } from "@services/types/auth";
import { useAppDispatch } from "@store/hooks";
import {
  setAuthToken,
  setPermissions,
  setRoleUser,
  setUserInfo,
} from "@store/slices/authSlice";

import { showMessage } from "@utils/toast";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function Login() {
  const methods = useForm<IPayloadLogin>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginMutation();
  const [getCurrentUserData] = useLazyCurrentUserDataQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [getMenuItems] = useLazyGetMenuItemsQuery();
  const registerHandler = async (data: IPayloadLogin) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    loginUser(formData)
      .unwrap()
      .then((responseLogin) => {
        dispatch(
          setAuthToken({
            accessToken: responseLogin.access_token,
            refreshToken: responseLogin?.refresh_token,
          })
        );

        getCurrentUserData({
          access_token: responseLogin.access_token,
        })
          .unwrap()
          .then((userData) => {
            getMenuItems()
              .unwrap()
              .then((ress) => {
                dispatch(setPermissions(ress.data));
                dispatch(setRoleUser(userData.data?.role));
                dispatch(
                  setUserInfo({
                    gender: userData.data?.Gender,
                    firstname: userData.data?.firstname,
                    lastname: userData.data?.lastname,
                    id: userData.data?.id,
                    company_id: userData.data?.company_id,
                  })
                );
                setIsLoading(false);

                navigate(`/`);
                showMessage.success("خوش آمدید به سامانه سنجش و پایش");
              });
          });
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(registerHandler)}
        className="bg-white/95 backdrop-blur-sm py-6 md:py-8 px-6 w-full md:w-1/3 md:px-4 flex flex-col gap-6 border border-white/20 shadow-xl rounded-2xl"
      >
        <div className="text-center pb-2 md:pb-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">ورود کاربران</h3>
          <p className="text-sm text-gray-500 mt-1">سامانه مدیریت آزمون‌ها</p>
        </div>
        <div className="flex flex-col gap-3 md:gap-6">
          <Input
            name="username"
            placeholder="کدملی را وارد نمایید"
            label="کد ملی"
            className="w-full"
            // registerProps={{
            //   validate: (value: string) => {
            //     return validateNationalCode(
            //       p2eDigits(value || " "),
            //       "کد ملی نامعتبر است."
            //     );
            //   },
            // }}
          />

          <Input
            name="password"
            type="password"
            placeholder="کلمه عبور را وارد نمایید"
            label="کلمه عبور"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="md:pt-4">
          <Button
            variant="primary"
            className="w-full h-10  md:h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            buttonProps={{
              type: "submit",
              disabled: isLoading,
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingIcon />
                در حال ورود...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                ورود به سیستم
                <LoginIcon />
              </div>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
