"use client";
import {
  generateVerificationCode,
  signUp,
  universityLookup,
  userAlreadyExists,
  verifyConfirmationCode,
} from "@/service/auth.service";
import { responseCodes, validateField } from "@/util/constant";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  AccountCreationSucceed,
  BackArrowIcon,
  BasicDetails,
  ResendCodeTemplate,
  VerifyEmail,
} from "../commonBlocks";
import { setToken, setUserDetail } from "@/redux/ducks/user.duck";
import { useDispatch } from "react-redux";

export default function () {
  const router = useRouter();
  const { stringPrefixJoiValidation, password } = validateField;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [commonErrorMessage, setCommonErrorMessage] = useState<string | null>(
    null
  );
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    password: false,
    confirmPassword: false,
  });
  const dispatch = useDispatch();
  interface studentSignUpSchema extends commonRegistrationField {
    otp: string;
    isEduVerified: boolean;
    universityName: string;
  }
  interface formikField {
    field: {
      value: string;
    };
  }
  interface ShowPasswordState {
    password: boolean;
    confirmPassword: boolean;
  }

  const intialFormikValues: studentSignUpSchema = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
    otp: "",
    isEduVerified: false,
    universityName: "",
  };

  // stepwise flow 0 common registration / 1 university verification / 2 generate otp / 3 validation of otp / 4 create student account

  const validationSchema: Yup.AnyObject = [
    Yup.object({
      password: password.required(),
      confirm_password: password
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Password must match"),
      first_name: stringPrefixJoiValidation.min(2).required(),
      last_name: stringPrefixJoiValidation.min(2).required(),
      email: Yup.string()
        .email()
        .required("Email is required")
        .matches(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.edu)+$/,
          "Please enter a valid .edu email address"
        ),
    }),
    null,
    null,
    Yup.object({
      otp: Yup.string()
        .required()
        .matches(
          new RegExp("^[a-zA-Z0-9]{6}$"),
          "Please enter a valid verification code"
        ),
    }),
    null,
  ];

  const onShowHidePassword = (type: keyof ShowPasswordState) =>
    setShowPassword((preState) => {
      return {
        ...preState,
        [type]: !showPassword[type],
      };
    });

  const verifyEduMail = async (email: string): Promise<any> => {
    if (!email || !email?.length) return false;
    // verify university avaibility email address is valid
    let universityName = email.split("@")[1];
    return await universityLookup(universityName);
  };

  const handleUserExists = async (
    values: studentSignUpSchema,
    actions: FormikHelpers<studentSignUpSchema>
  ) => {
    const payload: userLoginField = {
      email: values.email,
      password: values.password,
    };
    await userAlreadyExists(payload.email)
      .then(async (response) => {
        const userRes =
          response.status === responseCodes.SUCCESS && response.data.data;
        if (!userRes?.isExist && !userRes?.user) {
          // user is new and can proceed with .edu verification
          await verifyEduMail(values.email)
            .then((res) => {
              actions.setFieldValue(
                "isEduVerified",
                res?.data?.data ? true : false
              );
              actions.setFieldValue(
                "universityName",
                res?.data?.data ? res.data.data.name : ""
              );
            })
            .catch((e) => console.log(e))
            .finally(() => {
              actions.setSubmitting(false);
              setCurrentStep((prevStep: number) => prevStep + 1);
            });
        } else if (userRes?.isExist && !userRes?.user?.verified_account) {
          // user verification pending
          actions.setSubmitting(false);
          setCurrentStep(2);
        } else if (userRes?.isExist && userRes?.user?.verified_account) {
          // user already verified
          setCommonErrorMessage(
            "That email address is already registered with EduRx"
          );
          setTimeout(() => {
            setCommonErrorMessage(null);
          }, 2000);
          actions.setSubmitting(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleCodeVerification = async (
    values: studentSignUpSchema,
    actions: FormikHelpers<studentSignUpSchema>
  ) => {
    const payload: {
      email: string;
      code: string;
    } = {
      email: values.email,
      code: values.otp,
    };
    await verifyConfirmationCode(payload)
      .then((res) => {
        if (res.status === responseCodes.SUCCESS) {
          setCurrentStep((prevStep: number) => prevStep + 1);
          setTimeout(() => {
            dispatch(setToken(res.data.data.token));
            dispatch(setUserDetail(res.data.data.details));
          }, 1000 * 3);
        } else if (res.status === responseCodes.NOT_ACCEPTABLE) {
          actions.setFieldError("otp", "Incorrect code, please try again");
        } else {
          setCommonErrorMessage("Something went wrong");
          setTimeout(() => {
            setCommonErrorMessage(null);
          }, 2000);
        }
      })
      .catch((err) => console.log("err", err))
      .finally(() => actions.setSubmitting(false));
  };

  const handleSignUpProcess = async (
    values: studentSignUpSchema,
    actions: FormikHelpers<studentSignUpSchema>
  ) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      confirm_password: values.confirm_password,
      role: "student",
      // universityName: values.universityName,
    };
    await signUp(payload)
      .then((response) => {
        if (
          response?.status === responseCodes.SUCCESS &&
          response?.data?.response_type === "success"
        ) {
          setCurrentStep(3);
        } else if (
          response?.status === responseCodes.SUCCESS &&
          response?.data?.response_type === "error"
        ) {
          setCommonErrorMessage(response.data.message);
          setTimeout(() => {
            setCommonErrorMessage(null);
            setCurrentStep(3);
          }, 2000);
        }
      })
      .catch((error) => console.log(error));
    actions.setTouched({});
    actions.setSubmitting(false);
  };

  const handleCodeGeneration = async (
    values: studentSignUpSchema,
    actions: FormikHelpers<studentSignUpSchema>
  ) => {
    await generateVerificationCode({
      email: values.email,
    })
      .then((res) => {
        if (res.status === responseCodes.SUCCESS) {
          setCurrentStep(3);
        }
      })
      .catch((err) => console.log("err", err))
      .finally(() => actions.setSubmitting(false));
  };

  const onResendCode = async (
    values: studentSignUpSchema,
    actions: FormikHelpers<studentSignUpSchema>
  ) => {
    await handleCodeGeneration(values, actions);
    setCommonErrorMessage("Verification code sent");
    setTimeout(() => {
      setCommonErrorMessage(null);
    }, 2000);
  };

  const onSubmit = async (
    values: studentSignUpSchema,
    actions: FormikHelpers<studentSignUpSchema>
  ) => {
    if (currentStep === 0) {
      // check if user already registered
      await handleUserExists(values, actions);
    } else if (currentStep === 1) {
      if (!values.isEduVerified) return setCurrentStep(0);
      await handleSignUpProcess(values, actions);
    } else if (currentStep === 2) {
      // generate new verification code
      await handleCodeGeneration(values, actions);
    } else if (currentStep === 3) {
      // validate verification code
      await handleCodeVerification(values, actions);
    } else {
      actions.setTouched({});
      actions.setSubmitting(false);
      setCurrentStep((prevStep: number) => prevStep + 1);
    }
  };

  const UniversityInfo = (): React.JSX.Element => {
    return (
      <div className="px-6 text-center">
        <p className="my-4 font-body text-[14px] text-eduBlack/60">
          If the information below is correct click next to continue sign up
          process.
        </p>
        <div className="py-6">
          <Field
            name="universityName"
            component={({ field }: formikField) => (
              <span className="text-[24px] font-headers text-eduBlack">
                {field?.value?.replaceAll(",", " -")}
              </span>
            )}
          />
        </div>
        <Field
          name="email"
          component={({ field }: formikField) => (
            <span className="font-body text-[12px] text-eduBlack/60">
              email:{" "}
              <a
                href={`mailto:${field.value}`}
                className="underline font-body text-[12px] text-eduBlack/60"
              >
                {field.value}
              </a>
            </span>
          )}
        />
      </div>
    );
  };

  const EduVerificationFailed = (): React.JSX.Element => {
    return (
      <div>
        <p className="text-eduBlack/60 text-[14px] font-body px-8 text-center">
          It looks like the university associated with your .edu email address
          is not yet eligible for an EduRx account. Please come back soon to
          check again...
        </p>
      </div>
    );
  };

  const VerifyYourEmail = (): React.JSX.Element => {
    return (
      <React.Fragment>
        <p className="text-eduBlack/60 text-[14px] font-body px-8 text-center">
          We need to verify your .edu email address. Click the “Send Code”
          button below to receive an email with a 6-digit code for email
          verification
        </p>
      </React.Fragment>
    );
  };

  const stepWiseRenderer = (
    values: studentSignUpSchema
  ): React.JSX.Element | null => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetails
            onShowPassword={onShowHidePassword}
            showPassword={showPassword}
          />
        );
      case 1:
        return values.isEduVerified ? (
          <UniversityInfo />
        ) : (
          <EduVerificationFailed />
        );
      case 2:
        return <VerifyYourEmail />;

      case 3:
        return <VerifyEmail />;

      case 4:
        return <AccountCreationSucceed />;
      default:
        return null;
    }
  };

  const getLabel = (values: studentSignUpSchema): string => {
    return currentStep === 1 && !values.isEduVerified
      ? "Back"
      : currentStep === 2
      ? "Send Code"
      : currentStep === 3
      ? "Submit"
      : "Next";
  };

  const getHeadTitle = (values: studentSignUpSchema): string => {
    return currentStep === 1
      ? values.isEduVerified
        ? "Confirm University"
        : "Oops... Something went wrong"
      : currentStep === 2
      ? "Verify Email"
      : currentStep === 3
      ? "Enter Verification Code"
      : currentStep === 4
      ? "Creating Account"
      : "Create Student Account";
  };
  return (
    <React.Fragment>
      <div className="flex justify-center p-4 bg-eduDarkGray">
        {![3, 4].includes(currentStep) && (
          <button
            onClick={() =>
              currentStep > 0
                ? currentStep == 2
                  ? setCurrentStep(0)
                  : setCurrentStep((prevStep: number) => prevStep - 1)
                : router.back()
            }
            className={`text-2xl px-2 self-center ${
              currentStep !== 0 && currentStep != 2 && currentStep % 2 === 0
                ? "opacity-50"
                : "opacity-100"
            }`}
            disabled={
              currentStep !== 0 && currentStep != 2 && currentStep % 2 === 0
            }
          >
            <BackArrowIcon />
          </button>
        )}
        <label className="text-[16px] text-eduBlack flex-1 text-center font-body self-center">
          Register for Edu-Rx | Student Account
        </label>
      </div>
      <Formik
        initialValues={intialFormikValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema[currentStep]}
      >
        {({ isSubmitting, values, ...actions }) => (
          <div className="flex flex-col items-center p-4 bg-white">
            <h1 className="text-3xl font-headers font-semibold">
              {getHeadTitle(values)}
            </h1>
            <Form>
              <div className="flex flex-col gap-4 text-eduBlack m-8">
                {stepWiseRenderer(values)}
              </div>
              <div className="m-2 flex justify-center">
                <button
                  className={`bg-eduLightGray border-eduBlack text-eduBlack font-[600] border-[2px] text-[16px] rounded-lg p-2 m-auto w-1/2 hover:bg-yellow-500  ease-in duration-300 !cursor-pointer ${
                    (isSubmitting || !actions.isValid) &&
                    "!opacity-[40%] hover:!bg-white hover:!cursor-not-allowed"
                  }`}
                  type="submit"
                  hidden={currentStep === 4}
                  disabled={isSubmitting || !actions.isValid}
                >
                  {getLabel(values)}
                </button>
              </div>
              {currentStep == 0 && (
                <div className="text-center text-sm font-[500] opacity-40 pt-3">
                  Already have an account?{" "}
                  <span
                    className="underline font-[700] cursor-pointer"
                    onClick={() => {
                      router.push("/signin");
                    }}
                  >
                    Log In
                  </span>
                </div>
              )}
              {currentStep === 3 && (
                <ResendCodeTemplate
                  onClick={() => onResendCode(values, actions)}
                />
              )}
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
}
