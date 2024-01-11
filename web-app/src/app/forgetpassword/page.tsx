"use client";
import React, { use, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import {
  BackArrowIcon,
  ForgetPasswordField,
  VerifyEmail,
  ChangePassword,
} from "./component/commonBlocks";
import { responseCodes, validateField } from "@/util/constant";
import {
  generateVerificationCodeForForget,
  userAlreadyExists,
  verifyConfirmationCodeForForget,
} from "@/service/auth.service";
import { useDispatch } from "react-redux";
import {
  removeToken,
  removeUserDetail,
  setToken,
  setUserDetail,
} from "@/redux/ducks/user.duck";
import { updatePasswordById } from "@/service/user.service";

interface ShowPasswordState {
  password: boolean;
  confirmPassword: boolean;
}

const page = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const [commonErrorMessage, setCommonErrorMessage] = useState<string | null>(
    null
  );
  const [userDetailsData, setUserDetailsData] = useState<
    userForgetPassword | userDetailsType | null
  >(null);
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    password: false,
    confirmPassword: false,
  });

  const initialValues: userForgetPassword = {
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  };

  const { stringPrefixJoiValidation, password } = validateField;
  const validationSchema: Yup.AnyObject = [
    Yup.object({
      email: Yup.string()
        .email()
        .required("Email is required")
        .matches(
          /^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})$/,
          "Please enter a valid email address"
        ),
    }),
    Yup.object({
      otp: stringPrefixJoiValidation.required().max(6),
    }),
    Yup.object({
      password: password.required(),
      confirm_password: password
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Password must match"),
    }),
  ];

  const stepWiseRenderer = (): React.JSX.Element | null => {
    switch (currentStep) {
      case 0:
        return <ForgetPasswordField />;
      case 1:
        return <VerifyEmail />;
      case 2:
        return <ChangePassword onShowPassword={onShowHidePassword} showPassword={showPassword} />;
      default:
        return null;
    }
  };

  const getHeadTitle = (): string => {
    return currentStep === 0
      ? "Enter Email"
      : currentStep === 1
      ? "Verify Email"
      : currentStep === 2
      ? "Change Password"
      : "Forget Password";
  };

  const onShowHidePassword = (type: keyof ShowPasswordState) =>
    setShowPassword((preState) => {
      return {
        ...preState,
        [type]: !showPassword[type],
      };
    });

  const onSubmit = async (
    values: userForgetPassword,
    actions: FormikHelpers<userForgetPassword>
  ) => {
    if (currentStep === 0) {
      // check if user already registered
      await handleEmailExists(values.email, actions);
    } else if (currentStep === 1) {
      await handleCodeVerification(values, actions);
    } else if (currentStep === 2) {
      await handleChangePassword(values, actions);
    } else {
      actions.setTouched({});
      actions.setSubmitting(false);
      setCurrentStep((prevStep: number) => prevStep + 1);
    }
  };

  const handleEmailExists = async (
    email: string,
    actions: FormikHelpers<userForgetPassword>
  ) => {
    try {
      const response = await userAlreadyExists(email);

      if (response) {
        if (response.data?.data) {
          const userData = response.data?.data;
          if (!userData.isExist) {
            {
              setCommonErrorMessage("User Not exist with This Email Address!!");
              setTimeout(() => {
                setCommonErrorMessage(null);
              }, 2000);
            }
          } else {
            if (!userData.user.verified_account) {
              setCommonErrorMessage(
                "Registered Account with this Email is Not Verified!!"
              );
              setTimeout(() => {
                setCommonErrorMessage(null);
              }, 2000);
            } else {
              actions.setSubmitting(false);
              actions.setTouched({});
              await handleCodeGeneration(email);
              setCommonErrorMessage(null);
            }
          }
        }
      }
    } catch (e) {
      setCommonErrorMessage("Something went wrong!!");
    }
  };

  const handleCodeGeneration = async (email: string) => {
    try {
      const sendOtpRes = await generateVerificationCodeForForget({
        email,
      });
      if (sendOtpRes.status === responseCodes.SUCCESS)
        setCurrentStep((prevStep: number) => prevStep + 1);
    } catch (error) {
      setCommonErrorMessage("Something went wrong!!");
    }
  };

  const handleCodeVerification = async (
    values: userForgetPassword,
    actions: FormikHelpers<userForgetPassword>
  ) => {
    const payload: {
      email: string;
      code: string;
    } = {
      email: values.email,
      code: values.otp,
    };
    await verifyConfirmationCodeForForget(payload)
      .then((res) => {
        if (res.status === responseCodes.SUCCESS) {
          setCurrentStep((prevStep: number) => prevStep + 1);
          setUserDetailsData(res.data.data.details);
        } else {
          setTimeout(() => {
            setCommonErrorMessage(null);
          }, 2000);
        }
      })
      .catch((err) => console.log("err", err))
      .finally(() => actions.setSubmitting(false));
  };

  const handleChangePassword = async (
    values: userForgetPassword,
    actions: FormikHelpers<userForgetPassword>
  ) => {
    try {
      if (userDetailsData) {
        const userId = (userDetailsData as userDetailsType)._id as string;
        const changePasswordRes = await updatePasswordById(userId, {
          password: values.password,
          otp: values.otp,
        });
        actions.setSubmitting(false);
        if (changePasswordRes) {
          if (
            changePasswordRes.data.response_type === "success" &&
            changePasswordRes.data.data.token
          ) {
            dispatch(setToken(changePasswordRes.data.data?.token));
            dispatch(setUserDetail(changePasswordRes.data.data?.details));
            router.push("/forum");
          } else {
            throw "Something went wrong";
          }
        }
      }
    } catch (error) {
      setCurrentStep(5);
      dispatch(removeToken());
      dispatch(removeUserDetail());
      setCommonErrorMessage("something went wrong");
      setTimeout(() => {
        setCommonErrorMessage(null);
      }, 2000);
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-center p-4 bg-eduDarkGray">
        <button
          onClick={() => router.push("/signin")}
          className={`text-2xl px-2 self-center`}
        >
          <BackArrowIcon />
        </button>
        <label className="text-[16px] text-eduBlack flex-1 text-center font-body self-center">
          Forget Password
        </label>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema[currentStep]}
      >
        {({ isSubmitting, values, ...actions }) => (
          <div className="flex flex-col items-center p-4 bg-white">
            <h1 className="text-3xl font-headers font-semibold">
              {getHeadTitle()}
            </h1>
            <Form>
              <div className="flex flex-col gap-4 text-eduBlack m-8">
                {stepWiseRenderer()}
              </div>
              <div className="m-2 flex justify-center">
                <button
                  className={`bg-eduLightGray border-eduBlack text-eduBlack font-[600] border-[2px] text-[16px] rounded-lg p-2 m-auto w-1/2 hover:bg-yellow-500  ease-in duration-300 !cursor-pointer ${
                    (isSubmitting || !actions.isValid) &&
                    "!opacity-[40%] hover:!bg-white hover:!cursor-not-allowed"
                  }`}
                  type="submit"
                  disabled={isSubmitting || !actions.isValid}
                >
                  {currentStep === 2 ? "Change" : "Next"}
                </button>
              </div>

              <span
                hidden={!commonErrorMessage}
                className="text-red-500 flex place-content-center text-sm opacity-50 m-2 animate-fade-in-down"
              >
                {commonErrorMessage}
              </span>
            </Form>
          </div>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default page;
