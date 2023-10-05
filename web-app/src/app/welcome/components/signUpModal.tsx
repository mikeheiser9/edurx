import React, { useCallback, useState } from "react";
import { Modal } from "@/components/modal";
import { Form, Formik, FormikHelpers } from "formik";
import InputField from "@/components/input";
import EduLogo from "../../../assets/icons/eduRx-blue.svg";
import Image from "next/image";
import * as Yup from "yup";
import { responseCodes, validateField } from "@/util/constant";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "@/hooks";
import { npiNumberLookup } from "@/service/auth.service";

const { stringPrefixJoiValidation } = validateField;

interface Props {
  signUpModal: UseModalType;
}

interface SignUpSchema {
  first_name: string;
  last_name: string;
  email: string;
  npi_number: string;
  npi_designation: string;
}

export const SignUpModal = ({ signUpModal }: Props) => {
  const [commonMessage, setCommonMessage] = useState<{
    type: "success" | "error";
    message: string;
  }>();
  // const [npiNumber, setNpiNumber] = useState<string>("");
  // const debouncedNpi = useDebounce(npiNumber, 1000);
  const labelProps = {
    className: "text-eduBlack font-body text-[14px] my-2",
  };
  const formInitialValues: SignUpSchema = {
    first_name: "",
    last_name: "",
    email: "",
    npi_number: "",
    npi_designation: "",
  };
  const validationSchema: Yup.AnyObject = Yup.object({
    first_name: stringPrefixJoiValidation
      .min(2)
      .required()
      .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed"),
    last_name: stringPrefixJoiValidation
      .min(2)
      .required()
      .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed"),
    email: stringPrefixJoiValidation.email().required(),
    npi_number: stringPrefixJoiValidation.length(10).required(),
    npi_designation: stringPrefixJoiValidation,
  });

  const showErrorMessage = (
    message: string,
    type: "success" | "error",
    callback?: () => void,
    autoHide: number = 3000
  ) => {
    setCommonMessage({ type, message });
    setTimeout(() => {
      callback?.();
      setCommonMessage(undefined);
    }, autoHide);
  };

  const onSubmit = async (
    values: SignUpSchema,
    actions: FormikHelpers<SignUpSchema>
  ) => {
    console.log({ values });
    actions.setSubmitting(true);
    const payload = {
      "First Name": values.first_name,
      "Last Name": values.last_name,
      Email: values.email,
      NPI: values.npi_number?.toUpperCase(),
      "Join Date": new Date().toLocaleDateString(),
    };
    console.log({ payload });
    // return;

    await axios
      .post(
        "https://sheet.best/api/sheets/0af70a5b-e42e-4bb1-8152-f42dab3e55d7",
        payload
      )
      .then((response) => {
        console.log(response);
        if (response?.status === responseCodes.SUCCESS) {
          showErrorMessage(
            "Thank you, We will respond to you soon",
            "success",
            signUpModal.closeModal
          );
          actions.resetForm();
        } else throw new Error("User registration failed");
      })
      .catch((err) => {
        console.log(err);
        showErrorMessage(
          "Oops... something went wrong, please try again",
          "error"
        );
      })
      .finally(() => actions.setSubmitting(false));
  };

  // const onNpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNpiNumber(e.target.value);
  // };

  // useEffect(() => {
  //   if (debouncedNpi?.length > 9)
  //     npiNumberLookup(debouncedNpi)
  //       .then((res) => console.log(res))
  //       .catch((err) => console.log("Error: ", err));
  // }, [debouncedNpi]);

  return (
    <Modal
      headerTitle="Register for EduRx Beta"
      visible={signUpModal.isOpen}
      onClose={signUpModal.closeModal}
      showFooter={false}
      modalClassName="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-auto flex justify-center items-center"
      modalBodyClassName="relative p-4 px-8 overflow-y-auto font-body overflow-hidden bg-eduLightGray"
    >
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <div className="flex flex-col flex-auto flex-wrap items-center gap-2">
            <div className="flex flex-wrap flex-auto justify-center items-center flex-col gap-6 my-6">
              <Image src={EduLogo} alt="eduRx-logo" />
              <div className="flex flex-col items-center justify-center">
                <span className="font-body text-center text-sm md:text-lg">
                  Fill out the form to get beta access to EduRx
                </span>
                <span className="font-body text-xs mt-2 italic">
                  (Must have valid NPI)
                </span>
              </div>
            </div>

            <Form>
              <div className="relative flex flex-col flex-auto flex-wrap gap-4">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                  <InputField
                    label="First Name"
                    type="text"
                    name="first_name"
                    className="block w-full text-sm  bg-white"
                    maxLength={20}
                    labelProps={labelProps}
                    mandatory
                  />
                  <InputField
                    name="last_name"
                    type="text"
                    maxLength={20}
                    className="block w-full text-sm  bg-white"
                    label="Last name"
                    labelProps={labelProps}
                    mandatory
                  />
                </div>

                <InputField
                  name="email"
                  type="email"
                  maxLength={50}
                  className="block w-full text-sm  bg-white"
                  label="Email Address"
                  labelProps={labelProps}
                  mandatory
                />

                <InputField
                  name="npi_number"
                  maxLength={10}
                  className="bg-white block w-full text-sm tracking-[.25rem] uppercase"
                  label="NPI"
                  labelProps={labelProps}
                  mandatory
                />
                <button
                  type="submit"
                  className="border-2 my-4 border-eduBlack rounded-lg px-[25px] py-[4px] font-body text-eduBlack hover:bg-eduYellow hover:border-eduYellow ease-in-out flex justify-center items-center gap-2 duration-500 m-auto disabled:opacity-60"
                  disabled={isSubmitting || !isValid}
                >
                  Register{" "}
                  {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
                </button>
              </div>
            </Form>
            {commonMessage?.message && (
              <span
                className={`font-body text-sm animate-fade-in-down ${
                  commonMessage?.type === "error"
                    ? "text-red-500"
                    : "text-eduLightBlue"
                }`}
              >
                {commonMessage?.message}
              </span>
            )}
          </div>
        )}
      </Formik>
    </Modal>
  );
};
