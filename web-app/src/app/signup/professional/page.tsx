"use client";
import InputField from "@/components/input";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { professionalUserRegistrationField } from "../../../util/interface/user.interface";
import {
  taxonomyCodeToProfessionalMapping,
  validateField,
} from "@/util/interface/constant";
import { useState } from "react";
import { signUp, verifyConfirmationCode } from "@/service/auth.service";
import axios from "axios";

interface professionalAccountSignUpField extends professionalUserRegistrationField {
    code:string
}
export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(0);
  const { stringPrefixJoiValidation, password } = validateField;
  const formInitialValues:professionalAccountSignUpField  = {
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
    code: "",
  };

  const validationSchema = [
    Yup.object({
      email: stringPrefixJoiValidation.email().required(),
      password,
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "password must match")
        .required("confirm password is required"),
      first_name: stringPrefixJoiValidation.min(2).required(),
      last_name: stringPrefixJoiValidation.min(2).required(),
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
      code: stringPrefixJoiValidation.required(),
    }),
  ];

  const npiReturnVariables = [
    { fieldName: "npiReturnFullName", label: "Full Name" },
    { fieldName: "taxonomy", label: "Taxonomy" },
    { fieldName: "organization", label: "Organization name" },
    { fieldName: "addresses", label: "Address" },
  ];
  const handleAskNpi = async (
    actions: FormikHelpers<professionalAccountSignUpField>,
    npiNumber:string
  ) => {
    const res = await axios.post(
     process.env.NEXT_PUBLIC_NPI_REGISTRY_CMS as string,
      {
        data: {
          number: npiNumber,
        },
      }
    );
    if (res.data) {
      if (res.data?.taxonomies) {
        const validNpiCode = Object.keys(taxonomyCodeToProfessionalMapping);
        const exists = res.data.taxonomies
          .map((taxonomy: any) => taxonomy.code)
          .some((code: string) => validNpiCode.includes(code));
        if (exists) {
          actions.setFieldValue(
            npiReturnVariables[0].fieldName,
            `${res?.data?.basic?.firstName}${res?.data?.basic?.lastName}`
          );
          actions.setFieldValue(
            npiReturnVariables[1].fieldName,
            res?.data?.taxonomies?.[0].desc
          );
          actions.setFieldValue(
            npiReturnVariables[2].fieldName,
            res?.data?.organization
          );
          actions.setFieldValue(`${npiReturnVariables[3].fieldName}.0`, [
            res.data?.addresses?.[0].addressLine1,
          ]);
          actions.setFieldValue(
            "npi_designation",
            res.data.taxonomies.map((taxonomy: any) => {
              return taxonomy.code;
            })
          );
          setCurrentStep((curStep) => curStep + 2);
        } else {
          setCurrentStep((curStep) => curStep + 1);
        }
        actions.setTouched({});
        actions.setSubmitting(false);
      }
    } else {
      actions.setFieldError("npi_number", "invalid NPI. Please try again...");
    }
  };

  const _handleSubmit = async (
    values: professionalAccountSignUpField,
    actions: FormikHelpers<professionalAccountSignUpField>
  ) => {
    if (currentStep == 1) {
      await handleAskNpi(actions,values.npi_number);
    } else if (currentStep == 2) {
      // can store the data into the google sheet
      actions.setTouched({});
      actions.setSubmitting(false);
      setCurrentStep(0);
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
        addresses,
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
      } else {
        // already verified handle it
      }
      actions.setTouched({});
      actions.setSubmitting(false);
    } else if (currentStep == 5) {
      const res = await verifyConfirmationCode({
        email: values.email,
        code: values.code,
      });
      if (res?.data?.response_type == "success") {
        setCurrentStep((pre) => pre + 1);
      } else {
        actions.setFieldError("code", "incorrect code, Please try again");
      }
    } else {
      setCurrentStep((preStep) => preStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const BasicDetail = () => {
    return (
      <div>
        <h1>Create Account</h1>
        <div>
          <InputField name="first_name" placeholder="First name" type="text" />
          <InputField name="last_name" placeholder="Last name" type="text" />
        </div>
        <InputField name="email" placeholder="Email address" type="text" />
        <InputField name="password" placeholder="Password" type="password" />
        <InputField
          name="confirm_password"
          placeholder="Confirm Password"
          type="password"
        />
      </div>
    );
  };

  const AskNpiNumber = () => {
    return (
      <div className="flex justify-center ">
        <div>
          <h1>Enter NPI</h1>
          <div>
            <label className="text-sm">
              EduRx is a curated community of medical professionals in order to
              ensure quality discussion and information please validate your NPI
              License below.
            </label>
          </div>
          <div>
            <InputField
              name="npi_number"
              placeholder="License Number"
              type="text"
            />
          </div>
        </div>
      </div>
    );
  };

  const NpiDetailsNotAcceptableFound = () => {
    return (
      <div className="flex justify-center ">
        <div>
          <h1>Oops! Looks like you're a little early! </h1>
          <div>
            <label className="text-sm">
              EduRx is new and building! We are excited to be creating a hub for
              all medical professionals to come together. However we are not
              accepting accounts for your specific taxonomy right now. Please
              enter your email below to stay up to date with out latest news and
              find out when EduRx launches for you!
            </label>
          </div>
        </div>
      </div>
    );
  };

  const NpiDetailsShow = () => {
    return (
      <div className="flex justify-center ">
        <div>
          <h1>Your Information</h1>
          <div>
            <label>
              Please confirm the following information is accurate and up to
              date.Note: you wil be able to add additional licenses and info
              later
            </label>
          </div>
          <div>
            <button
              onClick={() => setCurrentStep((currentStep) => currentStep + 1)}
            >
              Edit Info
            </button>
          </div>
          <div>
            {npiReturnVariables.map((variable) => {
              return (
                <div>
                  <label>{variable.label}</label>
                  <Field
                    name={variable.fieldName}
                    component={({ field }: any) => (
                      <div>
                        <label>
                          {variable.fieldName != "addresses"
                            ? field.value
                            : field.value[0]}
                        </label>
                      </div>
                    )}
                  ></Field>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const NpiDetailsEdit = () => {
    return (
      <div className="flex justify-center ">
        <h1>Edit Information</h1>
        <div>
          <InputField
            name="addresses.0"
            placeholder="Address Line 1"
            type="text"
          />
          <InputField
            name="addresses.1"
            placeholder="Address Line 2"
            type="text"
          />
          <div>
            <InputField name="city" placeholder="City" type="text" />
            <InputField name="state" placeholder="State" type="text" />
          </div>
          <InputField name="zip_code" placeholder="Zip Code" type="text" />
        </div>
      </div>
    );
  };

  const VerifyEmail = () => {
    return (
      <div className="flex justify-center ">
        <label className="text-lg">Enter Verification Code</label>
        <div>
          <Field
            name="email"
            component={({ field }: any) => (
              <div>
                <label>{`we send an email to ${field.value} Please enter it below to complete email verification.`}</label>
              </div>
            )}
          ></Field>
          <InputField
            name="code"
            placeholder="Enter Verification Code"
            type="text"
          />
        </div>
      </div>
    );
  };

  const RegistrationConfirmationMessage = () => {
    return (
      <div className="flex justify-center ">
        <label className="text-lg">Create Account</label>
        <div>Congrats Your email has been verified</div>
      </div>
    );
  };

  const _renderComponentStepWise = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return <BasicDetail />;
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
      default:
        return <></>;
    }
  };

  const renderButtonLabelBasedOnStep = () => {
    if (currentStep == 4) {
      return "Register";
    } else if (currentStep == 2) {
      return "Submit";
    } else if (currentStep == 5) {
      return "Verify";
    } else if (currentStep == 6) {
      return "Done";
    } else {
      return "next";
    }
  };

  return (
    <>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema[currentStep]}
        onSubmit={_handleSubmit}
      >
        {({ isSubmitting }) => (
          <div className="flex justify-center ">
            <Form>
              {_renderComponentStepWise(currentStep)}
              <div>
                <button
                  className="border border-slate-300 hover:border-indigo-300"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {renderButtonLabelBasedOnStep()}
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}
