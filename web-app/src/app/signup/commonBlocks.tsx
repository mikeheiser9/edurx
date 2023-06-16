import InputField from "@/components/input";
import { Field } from "formik";
import Image from "next/image";
import React from "react";
import CheckIcon from "@/assets/icons/checked.svg";

const BasicDetails = (): React.JSX.Element => {
  return (
    <React.Fragment>
      <div className="grid grid-cols-2 gap-4">
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
    </React.Fragment>
  );
};

const VerifyEmail = (): React.JSX.Element => {
  return (
    <div className="px-8">
      <Field
        name="email"
        component={({
          field,
        }: {
          field: {
            value: string;
          };
        }) => (
          <p className="text-white px-6 opacity-50 text-center">
            We sent an email to {field.value}. Please enter it below to complete
            email verification.
          </p>
        )}
      />
      <div className="mt-6">
        <InputField
          name="otp"
          type="text"
          placeholder="Enter Verification Code"
        />
      </div>
    </div>
  );
};

const RegistrationConfirmationMessage = (): React.JSX.Element => {
  return (
    <React.Fragment>
      <p className="text-md text-center opacity-50">
        Congrats your email has been verified!
      </p>
      <div className="flex justify-center my-2">
        <Image src={CheckIcon} alt="Checkmark" />
      </div>
    </React.Fragment>
  );
};

const AccountCreationSucceed = (): React.JSX.Element => {
  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 text-center text-white opacity-50 text-sm">
        <span>Welcome to EduRx</span>
        <span>Please wait while we set up your account</span>
        <span>When your account is ready you will be redirected</span>
      </div>
      <Loader />
    </React.Fragment>
  );
};

const Loader = (): React.JSX.Element => (
  <div
    className="inline-block self-center h-12 w-12 animate-spin rounded-full border-[.5rem] border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
);

export {
  BasicDetails,
  VerifyEmail,
  RegistrationConfirmationMessage,
  AccountCreationSucceed,
  Loader,
};
