"use client";
import InputField from "@/components/input";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  responseCodes,
  taxonomyCodeToProfessionalMapping,
  validateField,
} from "@/util/constant";
import React, { useState } from "react";
import {
  generateVerificationCode,
  npiNumberLookup,
  postToGoogleSheet,
  signUp,
  userAlreadyExists,
  verifyConfirmationCode,
} from "@/service/auth.service";
import { useRouter } from "next/navigation";
import {
  AccountCreationSucceed,
  BackArrowIcon,
  BasicDetails,
  Loader,
  RegistrationConfirmationMessage,
  ResendCodeTemplate,
  VerifyEmail,
} from "../commonBlocks";
import { Button } from "@/components/button";

interface professionalAccountSignUpField
  extends professionalUserRegistrationField {
  otp: string;
}

interface ShowPasswordState {
  password: boolean;
  confirmPassword: boolean;
}

export default function SignUp() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [commonErrorMessage, setCommonErrorMessage] = useState<string | null>(
    null
  );
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    password: false,
    confirmPassword: false,
  });
  const { stringPrefixJoiValidation, password } = validateField;
  const formInitialValues: professionalAccountSignUpField = {
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    npi_number: "",
    addresses: ["", ""],
    city: "",
    state: "",
    npi_designation: [""],
    zip_code: "",
    role: "",
    npiReturnFullName: "",
    taxonomy: "",
    organization: "",
    otp: "",
  };

  const validationSchema = [
    Yup.object({
      email: stringPrefixJoiValidation.email().required(),
      password: password.required(),
      confirm_password: password
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Password must match"),
      first_name: stringPrefixJoiValidation
        .min(2)
        .required()
        .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed"),
      last_name: stringPrefixJoiValidation
        .min(2)
        .required()
        .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed"),
    }),
    Yup.object({
      npi_number: stringPrefixJoiValidation.length(10).required(),
    }),
    ,
    ,
    Yup.object({
      city: stringPrefixJoiValidation.required(),
      state: stringPrefixJoiValidation.required(),
      zip_code: stringPrefixJoiValidation.required(),
      addresses: Yup.array().min(1).required(),
    }),
    Yup.object({
      otp: Yup.string()
        .required()
        .matches(
          new RegExp("^[a-zA-Z0-9]{6}$"),
          "Please enter a valid verification code"
        ),
    }),
  ];

  const capitalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  };

  const onShowHidePassword = (type: keyof ShowPasswordState) =>
    setShowPassword((preState) => {
      return {
        ...preState,
        [type]: !showPassword[type],
      };
    });

  const npiReturnVariables = [
    { fieldName: "npiReturnFullName", label: "Full Name" },
    { fieldName: "taxonomy", label: "Taxonomy" },
    { fieldName: "organization", label: "Organization name" },
    { fieldName: "addresses", label: "Address" },
  ];
  const handleAskNpi = async (
    actions: FormikHelpers<professionalAccountSignUpField>,
    npiNumber: string
  ) => {
    setIsLoading(true);
    const npiRes = await npiNumberLookup(npiNumber as string);
    const res: {
      data: any;
      isValid: boolean;
    } = {
      data: npiRes?.data?.data?.results?.[0] || null,
      isValid: npiRes?.data?.data?.result_count > 0,
    };

    if (res.data && res.isValid) {
      if (res.data?.taxonomies) {
        const validNpiCode = Object.keys(taxonomyCodeToProfessionalMapping);
        const exists: boolean = res.data.taxonomies
          .map((taxonomy: any) => taxonomy.code)
          .some((code: string) => validNpiCode.includes(code));
        if (exists) {
          let primaryTaxonomy = res.data?.taxonomies?.find(
            (taxonomy: any) => taxonomy?.primary
          );
          actions.setFieldValue(
            npiReturnVariables[0].fieldName,
            `${res?.data?.basic?.name_prefix || ""} ${
              res?.data?.basic?.first_name || "-"
            } ${res?.data?.basic?.middle_name || "-"} ${
              res?.data?.basic?.last_name || "-"
            }`
          );
          actions.setFieldValue(
            npiReturnVariables[1].fieldName,
            res?.data?.taxonomies?.[0].desc
          );
          actions.setFieldValue(
            npiReturnVariables[2].fieldName,
            res?.data?.organization || "-"
          );
          actions.setFieldValue(
            `${npiReturnVariables[3].fieldName}`,
            res.data?.addresses?.map(
              (address: any, index: number) => address?.[`address_${index + 1}`]
            )
          );
          actions.setFieldValue(
            "npi_designation",
            res.data.taxonomies.map((taxonomy: { code: string }) => {
              return taxonomy.code;
            })
          );
          actions.setFieldValue("city", res.data?.taxonomies[0]?.city);
          actions.setFieldValue("state", primaryTaxonomy?.state);
          actions.setFieldValue(
            "zip_code",
            res.data?.addresses[0]?.postal_code
          );

          setCurrentStep((curStep: number) => curStep + 2);
        } else {
          // save google sheet data
          actions.setFieldValue(
            "taxonomy",
            res.data?.taxonomies?.map(
              (taxonomy: { code: string; desc: string }) => {
                return `${taxonomy.code} | ${taxonomy.desc}`.toString();
              }
            )
          );
          actions.setFieldValue(
            "addresses",
            res.data?.addresses?.map((address: string) =>
              Object.values(address)
            )
          );
          setCurrentStep((curStep: number) => curStep + 1);
        }
        actions.setTouched({});
        actions.setSubmitting(false);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      actions.setFieldError("npi_number", "Invalid NPI. Please try again...");
    }
  };

  const handleUserExists = async (
    values: professionalAccountSignUpField,
    actions: FormikHelpers<professionalAccountSignUpField>
  ) => {
    const payload: userLoginField = {
      email: values.email,
      password: values.password,
    };
    await userAlreadyExists(payload.email)
      .then(async (response) => {
        const userRes =
          response.status === responseCodes.SUCCESS && response.data.data;
        if (!userRes.isExist && !userRes.user) {
          // user is new and can proceed further
          setCurrentStep((prevStep) => prevStep + 1);
        } else if (userRes?.isExist && userRes?.user?.verified_account) {
          // user already verified
          setCommonErrorMessage(
            "That email address is already registered with EduRx"
          );
          setTimeout(() => {
            setCommonErrorMessage(null);
          }, 2000);
        } else if (userRes?.isExist && !userRes?.user?.verified_account) {
          // user verification pending
          setCurrentStep(5);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => actions.setSubmitting(false));
  };

  const onResendCode = async (
    values: professionalAccountSignUpField,
    actions: FormikHelpers<professionalAccountSignUpField>
  ) => {
    await generateVerificationCode({
      email: values.email,
    })
      .then((res) => {
        if (res.status === responseCodes.SUCCESS) {
          setCommonErrorMessage("Verification code sent");
          setTimeout(() => {
            setCommonErrorMessage(null);
          }, 2000);
        }
      })
      .catch((err) => console.log("err", err))
      .finally(() => actions.setSubmitting(false));
  };

  const saveToGoogleSheets = async (
    values: professionalAccountSignUpField,
    actions: FormikHelpers<professionalAccountSignUpField>
  ) => {
    setIsLoading(true);
    try {
      const payload: googleSheetPayload = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        taxonomies: values?.taxonomy?.toString(),
        addresses: values?.addresses?.toString(),
      };
      await postToGoogleSheet(payload);
      actions.setTouched({});
      actions.setSubmitting(false);
      actions.resetForm();
      setIsLoading(false);
      setCurrentStep(0);
    } catch (err) {
      setIsLoading(false);
      console.error("failed to post to Google Sheet", err);
    }
  };

  const _handleSubmit = async (
    values: professionalAccountSignUpField,
    actions: FormikHelpers<professionalAccountSignUpField>
  ) => {
    if (currentStep === 0) {
      await handleUserExists(values, actions);
    } else if (currentStep == 1) {
      await handleAskNpi(actions, values.npi_number);
    } else if (currentStep == 2) {
      // can store the data into the google sheet
      await saveToGoogleSheets(values, actions);
    } else if (currentStep == 3 || currentStep == 4) {
      const {
        addresses,
        city,
        confirm_password,
        email,
        first_name,
        last_name,
        npi_designation,
        password,
        npi_number,
        state,
        zip_code,
      } = values;
      const details = {
        email,
        password,
        confirm_password,
        addresses: addresses?.map((address) => address?.toString()) || [],
        first_name,
        last_name,
        npi_designation,
        npi_number,
        zip_code,
        role: "professional",
        city,
        state,
      };
      const res = await signUp(details);
      if (res?.data?.response_type == "success") {
        currentStep == 4
          ? setCurrentStep((pre) => pre + 1)
          : currentStep == 3
          ? setCurrentStep((pre) => pre + 2)
          : "";
      } else if (
        res.status === responseCodes.SUCCESS &&
        res?.data?.response_type === "error"
      ) {
        // already verified handle it
        setCurrentStep(5);
      }
      actions.setTouched({});
      actions.setSubmitting(false);
    } else if (currentStep == 5) {
      const res = await verifyConfirmationCode({
        email: values.email,
        code: values.otp,
      });
      if (res?.data?.response_type == "success") {
        setCurrentStep((pre) => pre + 1);
      } else {
        actions.setFieldError("otp", "incorrect code, Please try again");
      }
    } else if (currentStep === 6) {
      setCurrentStep((preStep) => preStep + 1);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setCurrentStep((preStep: number) => preStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const AskNpiNumber = (): React.JSX.Element => {
    return (
      <React.Fragment>
        <p className="text-sm opacity-50 text-white text-center px-16 pb-6">
          EduRx is a curated community of medical professionals in order to
          ensure quality discussion and information please validate your NPI
          License below.
        </p>
        <div className="px-8">
          <InputField
            maxLength={20}
            name="npi_number"
            placeholder="License Number"
            type="text"
          />
        </div>
      </React.Fragment>
    );
  };

  const NpiDetailsNotAcceptableFound = (): React.JSX.Element => {
    return (
      <div className="px-6">
        <p className="text-sm opacity-50 text-center">
          EduRx is new and building! We are excited to be creating a hub for all
          medical professionals to come together. However we are not accepting
          accounts for your specific taxonomy right now. Please enter your email
          below to stay up to date with out latest news and find out when EduRx
          launches for you!
        </p>
      </div>
    );
  };

  const NpiDetailsShow = (): React.JSX.Element => {
    return (
      <div className="px-6 text-center">
        <p className="text-sm opacity-50">
          Please confirm the following information is accurate and up to date.
          Note: you will be able to add additional licenses and info later.
        </p>
        <div className="bg-[#FDCD2640] mt-4 text-white rounded flex flex-col gap-2 p-2">
          <div className="flex justify-end w-full relative">
            <div className="absolute text-xs text-primary">
              <button
                onClick={() => setCurrentStep((currentStep) => currentStep + 1)}
                className=""
              >
                Edit Info
              </button>
            </div>
          </div>
          {npiReturnVariables.map((variable, index: number) => {
            return (
              <div key={index}>
                <label className="text-xs opacity-50">{variable.label}</label>
                <Field
                  name={variable.fieldName}
                  component={({ field }: { field: { value: string } }) => (
                    <div>
                      <label>{field?.value}</label>
                    </div>
                  )}
                ></Field>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const NpiDetailsEdit = (): React.JSX.Element => {
    return (
      <React.Fragment>
        <InputField
          name="addresses.0"
          placeholder="Address Line 1"
          type="text"
          maxLength={60}
        />
        <InputField
          name="addresses.1"
          placeholder="Address Line 2"
          type="text"
          maxLength={60}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            name="city"
            placeholder="City"
            type="text"
            maxLength={20}
          />
          <InputField
            name="state"
            placeholder="State"
            type="text"
            maxLength={20}
          />
        </div>
        <InputField
          name="zip_code"
          placeholder="Zip Code"
          type="text"
          maxLength={20}
        />
      </React.Fragment>
    );
  };

  const _renderComponentStepWise = (currentStep: number): React.JSX.Element => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetails
            showPassword={showPassword}
            onShowPassword={onShowHidePassword}
          />
        );
      case 1:
        return <AskNpiNumber />;
      case 2:
        return <NpiDetailsNotAcceptableFound />;
      case 3:
        return <NpiDetailsShow />;
      case 4:
        return <NpiDetailsEdit />;
      case 5:
        return <VerifyEmail />;
      case 6:
        return <RegistrationConfirmationMessage />;
      case 7:
        return <AccountCreationSucceed />;
      default:
        return <></>;
    }
  };

  const renderButtonLabelBasedOnStep = (): string => {
    if (currentStep == 4) {
      return "Save";
    } else if (currentStep === 3) {
      return "Register";
    } else {
      return "Next";
    }
  };

  const getStepBasedTitle = (): string => {
    return currentStep === 1
      ? "Enter NPI"
      : currentStep === 2
      ? "Oops! Looks like you’re a little early!"
      : currentStep === 3
      ? "Your Information"
      : currentStep === 4
      ? "Edit Information"
      : currentStep === 5
      ? "Enter Verification Code"
      : "Create Account";
  };

  return (
    <React.Fragment>
      <div className="flex justify-center p-4 bg-primary">
        <button
          onClick={() =>
            currentStep > 0
              ? setCurrentStep((prevStep: number) => {
                  if (currentStep === 3) {
                    return prevStep - 2;
                  }
                  return prevStep - 1;
                })
              : router.back()
          }
          className={`text-2xl px-2 self-center ${
            // currentStep === 0 ||
            currentStep === 5 || currentStep === 6 || currentStep === 7
              ? "opacity-50"
              : "opacity-100"
          }`}
          disabled={
            // currentStep === 0 ||
            currentStep === 5 || currentStep === 6 || currentStep === 7
          }
        >
          <BackArrowIcon />
        </button>
        <label className="text-xl flex-1 text-center self-center">
          Register for Edu-Rx | Professional
        </label>
      </div>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema[currentStep]}
        onSubmit={_handleSubmit}
      >
        {({ isSubmitting, values, ...actions }) => (
          <div className="flex flex-col items-center p-4">
            <h1 className="text-white text-center tracking-wider text-4xl my-4 font-serif font-semibold">
              {getStepBasedTitle()}
            </h1>
            <Form>
              <div className="flex flex-col gap-4 text-white m-8">
                {_renderComponentStepWise(currentStep)}
              </div>
              {isLoading && (
                <div className="flex pb-3 justify-center">
                  <Loader />
                </div>
              )}
              <div className="m-2 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading || !actions.isValid}
                  hidden={currentStep === 7}
                  label={renderButtonLabelBasedOnStep()}
                />
              </div>
              {currentStep === 5 && (
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
