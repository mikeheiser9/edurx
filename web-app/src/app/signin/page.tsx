"use client";
import CommonUI from "@/components/commonUI";
import InputField from "@/components/input";
import { setToken, setUserDetail } from "@/redux/ducks/user.duck";
import {
  generateVerificationCode,
  login,
  verifyConfirmationCode,
} from "@/service/auth.service";
import { validateField } from "@/util/constant";
import { Form, Formik, FormikHelpers, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useState } from "react";
// import { userLoginField } from "@/util/interface/user.interface";
import EyeIcon from "@/assets/icons/eye.svg";
import EyeSlashIcon from "@/assets/icons/eye-slash.svg";
import Image from "next/image";
import Link from "next/link";
import { ResendCodeTemplate, VerifyEmail } from "../signup/commonBlocks";

export default function SignIn() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerificationPending, setIsVerificationPending] =
    useState<boolean>(false);
  const [commonMessage, setCommonMessage] = useState<string | null>(null);
  const { stringPrefixJoiValidation, email } = validateField;

  interface loginInterface extends userLoginField {
    otp: string;
  }

  const intialFormikValues: loginInterface = {
    email: "",
    password: "",
    otp: "",
  };

  const otpValidation = Yup.object({
    otp: Yup.string()
      .required()
      .matches(
        new RegExp("^[a-zA-Z0-9]{6}$"),
        "Please enter a valid verification code"
      ),
  });

  const validateSchema: Yup.AnyObject = Yup.object({
    email,
    password: stringPrefixJoiValidation.required(),
  });

  const onSubmit = async (
    values: loginInterface,
    actions: FormikHelpers<loginInterface>
  ) => {
    try {
      actions.setSubmitting(true);
      if (isVerificationPending) {
        const res = await verifyConfirmationCode({
          email: values.email,
          code: values.otp,
        });
        if (res?.status === 200 && res?.data?.response_type === "success") {
          setCommonMessage("Your account has been verified");
          setIsVerificationPending(false);
          setTimeout(() => {
            setCommonMessage(null);
          }, 2000);
        } else {
          actions.setFieldError("otp", res?.data?.message);
        }
      } else {
        const payload: userLoginField = {
          email: values.email,
          password: values.password,
        };
        const response = await login(payload);
        actions.setSubmitting(false);
        if (
          response.status === 200 &&
          response.data.response_type == "success"
        ) {
          dispatch(setToken(response.data.data.token));
          dispatch(setUserDetail(response.data.data.details));
        } else if (
          response.status === 400 &&
          response.data.message == "incorrect password...!"
        ) {
          actions.setFieldError(
            "password",
            "Incorrect password, please try again"
          );
        } else if (
          response.status === 400 &&
          response.data.message == "confirm your email"
        ) {
          // handle verification pending
          setCommonMessage("Verify your email");
          setTimeout(() => {
            setIsVerificationPending(true);
          }, 2000);
        } else {
          setCommonMessage(response?.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      actions.setSubmitting(false);
      setTimeout(() => {
        setCommonMessage(null);
      }, 3000);
    }
  };

  const onResendCode = async (
    values: loginInterface,
    actions: FormikHelpers<loginInterface>
  ) => {
    actions.setSubmitting(true);
    await generateVerificationCode({
      email: values.email,
    })
      .then((res) => {
        if (res.status === 200) {
          setCommonMessage("Verification code sent");
          setTimeout(() => {
            setCommonMessage(null);
          }, 2000);
        }
      })
      .catch((err) => console.log("err", err))
      .finally(() => actions.setSubmitting(false));
  };

  return (
    <div className="flex justify-center gap-4 flex-auto items-center h-full min-h-screen">
      <CommonUI
        fields={
          <Formik
            initialValues={intialFormikValues}
            validationSchema={
              isVerificationPending ? otpValidation : validateSchema
            }
            onSubmit={onSubmit}
          >
            {({ isSubmitting, values, ...actions }) => (
              <Form autoComplete="off">
                <div className="flex flex-col justify-center gap-4 m-4 mx-10">
                  {isVerificationPending ? (
                    <>
                      <VerifyEmail />
                      <ResendCodeTemplate
                        onClick={() => onResendCode(values, actions)}
                      />
                    </>
                  ) : (
                    <>
                      <InputField
                        name="email"
                        placeholder="Email address"
                        type="text"
                        autoComplete="on"
                      />
                      <InputField
                        name="password"
                        placeholder="Password"
                        autoComplete="on"
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
                    </>
                  )}
                  <button
                    className="bg-eduBlack text-white font-light text-[16px] rounded p-2 mt-8 m-auto w-1/2 hover:bg-yellow-500"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign in
                  </button>
                  {!isVerificationPending && (
                    <span className="text-white/50 text-xs flex justify-center">
                      Don't have account? &nbsp;
                      <Link className="text-white" href="signup">
                        Sign up
                      </Link>
                    </span>
                  )}
                  {commonMessage && (
                    <span className="capitalize text-white/50 text-sm text-center animate-fade-in-down">
                      {commonMessage}
                    </span>
                  )}
                </div>
                <ErrorMessage
                  name="isUnauthorized"
                  className="text-eduBlack text-sm opacity-50 text-center m-2 animate-fade-in-down"
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
