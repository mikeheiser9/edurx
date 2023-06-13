"use client";

import InputField from "@/components/input";
import {
  generateVerificationCode,
  login,
  signUp,
  verifyConfirmationCode,
} from "@/service/auth.service";
import { validateField } from "@/util/interface/constant";
import { commonRegistrationField } from "@/util/interface/user.interface";
// import axios from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const { stringPrefixJoiValidation, password } = validateField;
  const [currentStep, setCurrentStep] = useState<number>(0);
  interface studentSignUpSchema extends commonRegistrationField {
    otp: string;
    isEduVerified: boolean;
    universityName: string;
    isCodeExpired: boolean;
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
    isCodeExpired: false,
  };

  // stepwise flow 0 common registration / 1 university verification / 2 generate otp / 3 validation of otp / 4 create student account

  const validationSchema = [
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
          // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          // "/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[e][d][u]$/g"
          // new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+.edu$"),
          // new RegExp("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\.edu$/"),
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

  const BasicDetails = () => {
    return (
      <div>
        <h1>Create Account</h1>
        <div>
          <InputField name="first_name" placeholder="First name" type="text" />
          <InputField name="last_name" placeholder="Last name" type="text" />
        </div>
        <InputField name="email" placeholder="Email Address" type="email" />
        <InputField name="password" placeholder="Password" type="password" />
        <InputField
          name="confirm_password"
          placeholder="Confirm Password"
          type="password"
        />
      </div>
    );
  };

  const UniversityInfo = () => {
    return (
      <div>
        <h3>Confirm University</h3>
        <p>
          if the information below is correct click {"\n"} next to continue sign
          up process
        </p>
        <span>Name of University</span>
      </div>
    );
  };

  const EduVerificationFailed = () => {
    return (
      <div>
        <h3>Oops... Something went wrong</h3>
        <p>
          It looks like the university associated with your .edu email address
          is not yet eligible for an EduRx account. Please come back soon to
          check again...
        </p>
      </div>
    );
  };

  const VerifyYourEmail = () => {
    return (
      <div>
        <h3>Verify Your Email</h3>
        <p>
          We need to verify your .edu email address. Click the “Send Code”
          button below to receive an email with a 6-digit code for email
          verification
        </p>
      </div>
    );
  };

  const AccountCreationSucceed = () => {
    return (
      <div>
        <h3>Creating Account</h3>
        Welcome to EduRx Please wait while we set up your account When your
        account is ready you will be redirected
        <p>
          Your account has been successfully created. You can now login to your
          account.
        </p>
        <span>Please wait...</span>
      </div>
    );
  };

  const EmailVerificationCode = ({ email }: { email: string }) => {
    return (
      <div>
        <h3>Enter Verification Code</h3>
        <p>
          We sent an email to {email}. Please enter it below to complete email
          verification.
        </p>
        <InputField
          name="otp"
          type="text"
          placeholder="Enter Verification Code"
        />
      </div>
    );
  };

  const stepWiseRenderer = (
    currentStep: number,
    values: studentSignUpSchema
  ) => {
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
        return <EmailVerificationCode email={values.email} />;

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
      ? "Verify"
      : "Next";
  };

  const verifyEduMail = async (email: string): Promise<boolean> => {
    if (!email || !email?.length) return false;
    // verify university avaibility email address is valid
    let universityName = email.split("@")[1].split(".")[0];
    return true;
  };

  const onSubmit = async (
    values: studentSignUpSchema,
    actions: FormikHelpers<studentSignUpSchema>
  ) => {
    if (currentStep === 0) {
      // check if user already registered
      const payload = {
        email: values.email,
        password: values.password,
      };
      await login(payload)
        .then(async (response) => {
          if (response.status == 400 && response.data.toast) {
            // user is new and can proceed with .edu verification
            await verifyEduMail(values.email)
              .then((res: boolean) => {
                actions.setSubmitting(false);
                actions.setFieldValue("isEduVerified", res);
              })
              .catch((e) => {
                console.log(e);
                actions.setSubmitting(false);
              })
              .finally(() => {
                actions.setSubmitting(false);
                setCurrentStep((prevStep) => prevStep + 1);
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
            actions.setSubmitting(false);
            actions.setFieldError(
              "email",
              "This email address is already registered with us"
            );
            actions.setSubmitting(false);
            actions.resetForm();
          }
        })
        .catch((error) => console.log(error));
    } else if (currentStep === 1) {
      if (!values.isEduVerified) return router.push("/");
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
          }
        })
        .catch((error) => console.log(error));
      actions.setTouched({});
      actions.setSubmitting(false);
    } else if (currentStep === 2) {
      // generate new verification code
      await generateVerificationCode({
        email: values.email,
      })
        .then((res) => {
          if (res.status === 200) {
            setCurrentStep((prevStep) => prevStep + 1);
          }
        })
        .catch((err) => console.log("err", err))
        .finally(() => actions.setSubmitting(false));
    } else if (currentStep === 3) {
      // validate verification code
      const payload = {
        email: values.email,
        code: values.otp,
      };
      await verifyConfirmationCode(payload)
        .then((res) => {
          if (res.status === 200) {
            setCurrentStep((prevStep) => prevStep + 1);
            setTimeout(() => {
              router.push("/");
            }, 3000);
          } else if (res.status === 401) {
            actions.setFieldError("otp", "Incorrect code, please try again");
          } else {
            // handle expired code
            actions.setFieldValue("isCodeExpired", true);
            actions.setFieldError("otp", res?.data?.message);
          }
        })
        .catch((err) => console.log("err", err))
        .finally(() => actions.setSubmitting(false));
    } else {
      actions.setTouched({});
      actions.setSubmitting(false);
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-center">
        <h5>Register for Edu-Rx | Student Account</h5>
      </div>
      <Formik
        initialValues={intialFormikValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema[currentStep]}
      >
        {({ isSubmitting, values }) => (
          <div className="flex justify-center">
            <Form>
              {stepWiseRenderer(currentStep, values)}
              <div className="flex gap-2">
                {/* {currentStep !== 0 && !values.isEduVerified && (
                  <button
                    className="border border-slate-300 hover:border-indigo-300"
                    type="button"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
                  >
                    Back
                  </button>
                )} */}
                <button
                  className="border border-slate-300 hover:border-indigo-300"
                  type="submit"
                  hidden={currentStep === 4}
                  disabled={
                    isSubmitting ||
                    (currentStep === 3 && values.otp?.length < 6)
                  }
                >
                  {getLabel(currentStep, values)}
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </React.Fragment>
  );
}
