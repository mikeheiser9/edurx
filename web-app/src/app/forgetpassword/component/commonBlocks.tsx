import InputField from "@/components/input";
import { Field } from "formik";
import Image from "next/image";
import React from "react";
import CheckIcon from "@/assets/icons/checked.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface ShowPasswordState {
  password: boolean;
  confirmPassword: boolean;
}

const ForgetPasswordField = (): React.JSX.Element => {
  return (
    <React.Fragment>
     <InputField
        name="email"
        placeholder="Email Address"
        type="email"
        maxLength={150}
        className="w-full"
      />
    </React.Fragment>
  );
};
const ChangePassword = ({
  onShowPassword,
  showPassword,
}: {
  onShowPassword?: (type: keyof ShowPasswordState) => void;
  showPassword?: ShowPasswordState;
}): React.JSX.Element => {
  return (
    <React.Fragment>
      <InputField
        name="password"
        placeholder="Password"
        type={showPassword?.password ? "text" : "password"}
        maxLength={50}
        icon={
          <FontAwesomeIcon
            onClick={() => onShowPassword?.("password")}
            className="eduBlack mt-[8px] cursor-pointer"
            icon={showPassword?.password ? faEye : faEyeSlash}
          />
        }
      />
      <InputField
        name="confirm_password"
        placeholder="Confirm Password"
        maxLength={50}
        type={showPassword?.confirmPassword ? "text" : "password"}
        icon={
          <FontAwesomeIcon
            onClick={() => onShowPassword?.("confirmPassword")}
            className="text-eduBlack mt-[8px] cursor-pointer"
            icon={showPassword?.confirmPassword ? faEye : faEyeSlash}
          />
        }
      />
    </React.Fragment>
  );
};

const VerifyEmail = (): React.JSX.Element => {
  return (
    <React.Fragment>
      <Field
        name="email"
        component={({
          field,
        }: {
          field: {
            value: string;
          };
        }) => (
          <p className="text-eduBlack font-body text-center text-[14px]">
            We sent an OTP to Email &nbsp;
            <span className="text-eduLightBlue font-body text-center text-[14px]">
              { field.value}
            </span>
            . Please enter it below to complete email verification.
          </p>
        )}
      />
      <div className="mt-6 text-eduBlack">
        <InputField
          name="otp"
          maxLength={10}
          type="text"
          placeholder="Enter Verification Code"
        />
      </div>
    </React.Fragment>
  );
};


const Loader = (): React.JSX.Element => (
  <div
    className="inline-block self-center h-12 w-12 animate-spin rounded-full border-[.5rem] border-solid border-eduYellow border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
);

const BackArrowIcon = (): React.JSX.Element => {
  return (
    <svg
      width="9"
      height="16"
      viewBox="0 0 9 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.295372 7.29031C-0.0965097 7.67947 -0.0987143 8.31263 0.290448 8.70451L6.63221 15.0906C7.02137 15.4825 7.65453 15.4847 8.04642 15.0955C8.4383 14.7064 8.4405 14.0732 8.05134 13.6813L2.41422 8.0048L8.09073 2.36767C8.48261 1.97851 8.48482 1.34535 8.09566 0.953468C7.7065 0.561587 7.07333 0.559382 6.68145 0.948544L0.295372 7.29031ZM3.00348 7.00684L1.00349 6.99988L0.99653 8.99987L2.99652 9.00683L3.00348 7.00684Z"
        fill="#13222a"
      />
    </svg>
  );
};

const ResendCodeTemplate = ({
  onClick,
}: {
  onClick: () => void;
}): React.JSX.Element => {
  return (
    <div className="mt-4 text-eduBlack opacity-50 text-center text-xs grid gap-2">
      <span>Didn’t receive a code?</span>
      <span onClick={onClick} className="underline cursor-pointer">
        Resend Code
      </span>
    </div>
  );
};

export {
  ChangePassword,
  VerifyEmail,
  Loader,
  BackArrowIcon,
  ResendCodeTemplate,
  ForgetPasswordField
};
