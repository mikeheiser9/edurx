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
import { Form, Formik, FormikHelpers, ErrorMessage, FormikErrors } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useState } from "react";
import {
  AccountCreationSucceed,
  ResendCodeTemplate,
  VerifyEmail,
} from "../signup/commonBlocks";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerificationPending, setIsVerificationPending] =
    useState<boolean>(false);
  const [
    accountCreationSucceedScreenOpen,
    setAccountCreationSucceedScreenOpen,
  ] = useState(false);
  const [commonMessage, setCommonMessage] = useState<string | null>(null);
  const { stringPrefixJoiValidation, email } = validateField;

  interface loginInterface extends userLoginField {
    otp: string;
  }

  const initialFormikValues: loginInterface = {
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
          setIsVerificationPending(false);
          setAccountCreationSucceedScreenOpen(true);
          setTimeout(() => {
            dispatch(setToken(res.data.data.token));
            dispatch(setUserDetail(res.data.data.details));
          }, 1000 * 3);
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

  const shouldDisable = (isSubmitting:boolean, errors: FormikErrors<loginInterface>) => {
    return (
      (isSubmitting ||
      typeof errors.email != "undefined" ||
      typeof errors.password != "undefined" ||
      (isVerificationPending && typeof errors.otp != "undefined"))
    );
  };

  return (
    <div className="flex justify-center gap-4 flex-auto items-center h-full min-h-screen bg-eduDarkBlue/60">
      <CommonUI
        fields={
          <Formik
            initialValues={initialFormikValues}
            validationSchema={
              isVerificationPending ? otpValidation : validateSchema
            }
            onSubmit={onSubmit}
          >
            {({ isSubmitting, values, ...actions }) => (
              <Form autoComplete="off">
                <div className="flex flex-col justify-center gap-4 m-2 mx-10">
                  {isVerificationPending && (
                    <>
                      <VerifyEmail />
                    </>
                  )}
                  {accountCreationSucceedScreenOpen && (
                    <AccountCreationSucceed />
                  )}
                  {!isVerificationPending &&
                    !accountCreationSucceedScreenOpen && (
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
                            <FontAwesomeIcon
                              onClick={() => setShowPassword(!showPassword)}
                              className="eduBlack mt-[8px] cursor-pointer"
                              icon={showPassword ? faEye : faEyeSlash}
                            />
                          }
                        />
                      </>
                    )}
                  {!accountCreationSucceedScreenOpen && (
                    <button
                      className={`bg-eduLightGray border-eduBlack text-eduBlack font-[600] border-[2px] text-[16px] rounded-lg p-2 m-auto w-1/2 hover:bg-yellow-500  ease-in duration-300 cursor-pointer ${
                        shouldDisable(isSubmitting,actions.errors) &&
                        "opacity-[40%] !cursor-not-allowed hover:!bg-white"
                      }`}
                      type="submit"
                      disabled={shouldDisable(isSubmitting, actions.errors)}
                    >
                      {!isVerificationPending ? "Sign in" : "Next"}
                    </button>
                  )}
                  {isVerificationPending && (
                    <ResendCodeTemplate
                      onClick={() => onResendCode(values, actions)}
                    />
                  )}
                  {!isVerificationPending &&
                    !accountCreationSucceedScreenOpen && (
                      <>
                      <div className="text-center text-sm font-[500] opacity-40">
                        <span
                          className="underline font-[700] cursor-pointer"
                          onClick={() => {
                            router.push("/forgetpassword");
                          }}
                        >
                          Forget Password?
                          </span>
                      </div>
                      <div className="text-center text-sm font-[500] opacity-40 p-3">
                        Don't have account? &nbsp;
                        <span
                          className="underline font-[700] cursor-pointer"
                          onClick={() => {
                            router.push("/signup");
                          }}
                        >
                          Create one
                        </span>
                      </div>
                      </>
                    )}
                  {commonMessage && (
                    <span className="capitalize font-medium text-red-500 text-sm text-center animate-fade-in-down">
                      {commonMessage}
                    </span>
                  )}
                </div>
                <ErrorMessage
                  name="isUnauthorized"
                  className="text-red-500 text-sm opacity-50 text-center m-2 animate-fade-in-down"
                  component="div"
                />
              </Form>
            )}
          </Formik>
        }
        title={
          isVerificationPending
            ? "Enter Verification Code"
            : !accountCreationSucceedScreenOpen
            ? "Sign in"
            : "Creating Account"
        }
        type="Edu-Rx"
        accountCreationSucceedScreenOpen={accountCreationSucceedScreenOpen}
        isVerificationPending={isVerificationPending}
        setIsVerificationPending={setIsVerificationPending}
      />
    </div>
  );
}
