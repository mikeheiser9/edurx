"use client";
import CommonUI from "@/components/commonUI";
import InputField from "@/components/input";
import { setToken, setUserDetail } from "@/redux/ducks/user.duck";
import { login } from "@/service/auth.service";
import { validateField } from "@/util/interface/constant";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useState } from "react";
import { userLoginField } from "@/util/interface/user.interface";
import EyeIcon from "@/assets/icons/eye.svg";
import EyeSlashIcon from "@/assets/icons/eye-slash.svg";
import Image from "next/image";

export default function SignIn() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { stringPrefixJoiValidation, email } = validateField;

  interface loginInterface extends userLoginField {
    isUnauthorized: boolean;
  }

  const intialFormikValues: loginInterface = {
    email: "",
    password: "",
    isUnauthorized: false,
  };

  const validateSchema: Yup.AnyObject = Yup.object({
    email,
    password: stringPrefixJoiValidation.required(),
  });

  const onSubmit = async (
    values: loginInterface,
    actions: FormikHelpers<loginInterface>
  ) => {
    try {
      const payload: userLoginField = {
        email: values.email,
        password: values.password,
      };
      const response = await login(payload);
      if (response.status === 200 && response.data.response_type == "success") {
        dispatch(setToken(response.data.token));
        dispatch(setUserDetail(response.data.details));
        actions.setSubmitting(false);
      } else if (response.status === 400) {
        actions.setSubmitting(false);
        actions.setFieldError(
          "password",
          "Incorrect password, please try again"
        );
      } else {
        actions.setFieldError(
          "isUnauthorized",
          "Incorrect username or password"
        );
        actions.setSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <CommonUI
        fields={
          <Formik
            initialValues={intialFormikValues}
            validationSchema={validateSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }: { isSubmitting: boolean }) => (
              <Form autoComplete="off">
                <div className="flex flex-col justify-center gap-4 m-[10%]">
                  <InputField
                    name="email"
                    placeholder="Email address"
                    type="text"
                  />
                  <InputField
                    name="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    icon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white"
                        aria-checked={showPassword}
                      >
                        <Image
                          src={showPassword ? EyeSlashIcon : EyeIcon}
                          alt="eye-icon"
                        />
                      </button>
                    }
                  />
                  <button
                    className="bg-primary rounded p-2 mt-8 m-auto w-1/2 text-lg hover:bg-yellow-500"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign in
                  </button>
                </div>
                <ErrorMessage
                  name="isUnauthorized"
                  className="text-white text-sm opacity-50 text-center m-2 animate-fade-in-down"
                  component="div"
                />
              </Form>
            )}
          </Formik>
        }
        title="Sign in"
        type="Edu-Rx"
      />
    </div>
  );
}
