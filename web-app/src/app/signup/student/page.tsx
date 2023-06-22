"use client";
import {
  generateVerificationCode,
  login,
  signUp,
  universityLookup,
  verifyConfirmationCode,
} from "@/service/auth.service";
import { validateField } from "@/util/interface/constant";
import {
  commonRegistrationField,
  userLoginField,
} from "@/util/interface/user.interface";
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

export default function () {
  const router = useRouter();
  const { stringPrefixJoiValidation, password } = validateField;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [commonErrorMessage, setCommonErrorMessage] = useState<string | null>(
    null
  );
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
      password,
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "password must match")
        .required("confirm password is required"),
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
    await login(payload)
      .then(async (response) => {
        if (response.status == 401 && response.data.toast) {
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
        } else if (response.status === 400 && !response.data.toast) {
          // user verification pending
          actions.setSubmitting(false);
          setCurrentStep(2);
        } else if (
          response.status === 200 &&
          response?.data?.data?.details?.verified_account
        ) {
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
        if (res.status === 200) {
          setCurrentStep((prevStep: number) => prevStep + 1);
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else if (res.status === 401) {
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
          response?.status === 200 &&
          response?.data?.response_type === "success"
        ) {
          setCurrentStep(3);
        } else if (
          response?.status === 200 &&
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
        if (res.status === 200) {
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
      if (!values.isEduVerified) return router.push("/");
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
      <div className="text-white px-6 text-center">
        <p className="opacity-50 my-4">
          if the information below is correct click next to continue sign up
          process
        </p>
        <div className="py-6">
          <Field
            name="universityName"
            component={({ field }: formikField) => (
              <span className="text-2xl">
                {field?.value?.replaceAll(",", " -")}
              </span>
            )}
          />
        </div>
        <Field
          name="email"
          component={({ field }: formikField) => (
            <span className="opacity-50">
              email:{" "}
              <a href={`mailto:${field.value}`} className="underline">
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
        <p className="text-white px-8 opacity-50 text-center">
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
        <p className="text-white px-8 opacity-50 text-center">
          We need to verify your .edu email address. Click the “Send Code”
          button below to receive an email with a 6-digit code for email
          verification
        </p>
      </React.Fragment>
    );
  };

  const stepWiseRenderer = (
    currentStep: number,
    values: studentSignUpSchema
  ): React.JSX.Element | null => {
    switch (currentStep) {
      case 0:
        return <BasicDetails />;
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

  const getLabel = (step: number, values: studentSignUpSchema): string => {
    return step === 0
      ? "Register"
      : step === 1 && !values.isEduVerified
      ? "Go Back"
      : step === 2
      ? "Send Code"
      : step === 3
      ? "Submit"
      : "Next";
  };

  const getHeadTitle = (step: number, values: studentSignUpSchema): string => {
    return step === 1
      ? values.isEduVerified
        ? "Confirm University"
        : "Oops... Something went wrong"
      : step === 2
      ? "Verify Email"
      : step === 3
      ? "Enter Verification Code"
      : step === 4
      ? "Creating Account"
      : "Create Student Account";
  };

  return (
    <React.Fragment>
      <div className="flex justify-center p-4 bg-primary">
        <button
          onClick={() =>
            currentStep > 0 &&
            setCurrentStep((prevStep: number) => prevStep - 1)
          }
          className={`text-2xl px-2 self-center ${
            currentStep % 2 === 0 ? "opacity-50" : "opacity-100"
          }`}
          disabled={currentStep % 2 === 0}
        >
          <BackArrowIcon />
        </button>
        <label className="text-xl flex-1 text-center self-center">
          Register for Edu-Rx | Student Account
        </label>
      </div>
      <Formik
        initialValues={intialFormikValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema[currentStep]}
      >
        {({ isSubmitting, values, ...actions }) => (
          <div className="flex flex-col items-center p-4">
            <h1 className="text-white tracking-wider text-4xl my-4 font-serif font-semibold">
              {getHeadTitle(currentStep, values)}
            </h1>
            <Form>
              <div className="flex flex-col gap-4 m-[5%]">
                {stepWiseRenderer(currentStep, values)}
              </div>
              <div className="m-2 flex justify-center">
                <button
                  className="bg-primary rounded p-2 m-auto w-1/2 text-lg hover:bg-yellow-500"
                  type="submit"
                  hidden={currentStep === 4}
                  disabled={isSubmitting}
                >
                  {getLabel(currentStep, values)}
                </button>
              </div>
              {currentStep === 3 && (
                <ResendCodeTemplate
                  onClick={() => onResendCode(values, actions)}
                />
              )}
              <span
                hidden={!commonErrorMessage}
                className="text-white flex place-content-center text-sm opacity-50 m-2 animate-fade-in-down"
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
