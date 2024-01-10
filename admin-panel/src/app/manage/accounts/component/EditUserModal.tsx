import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Select from "@/components/Select";
import { TypeUserData } from "@/types/user";
import { USER_ROLES, validateField } from "@/util/constant";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const { stringPrefixJoiValidation, password } = validateField;

const EditUserModal = ({
  isOpen = true,
  onClose,
  title,
  disableForm,
  userData,
  onEdit,
  handleSubmit,
  isFormSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  disableForm?: boolean;
  userData: TypeUserData;
  onEdit?: () => void;
  handleSubmit: any;
  isFormSubmitting: boolean;
}) => {
  const initialValues = {
    role: userData && userData.role,
    first_name: userData ? userData.first_name : "",
    last_name: userData ? userData.last_name : "",
    username: userData ? userData.username : "",
    email: userData ? userData.email : "",
    password: "",
    tax: userData.npi_designation[0],
    npi_number: userData ? userData.npi_number : "",
  };

  const options = [
    {
      label: "Student",
      value: "student",
    },
    {
      label: "Professional",
      value: "professional",
    },
    {
      label: "Moderator",
      value: "moderator",
    },
    {
      label: "Super Admin",
      value: "super_admin",
    },
  ];

  const full_name = (userData.first_name + " " + userData.last_name)
    .toString()
    .toUpperCase();

  const validationSchema: Yup.AnyObject = Yup.object({
    role: stringPrefixJoiValidation.required(),
    first_name: stringPrefixJoiValidation
      .min(2)
      .required()
      .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed")
      .max(200),
    last_name: stringPrefixJoiValidation
      .min(2)
      .required()
      .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed")
      .max(200),
    email: stringPrefixJoiValidation.email().required(),
    npi_number:
      userData.role !== USER_ROLES.student.value
        ? stringPrefixJoiValidation.length(10).required()
        : Yup.string(),
    password: password,
    username: stringPrefixJoiValidation
      .min(3)
      .max(20)
      .required()
      .matches(/^[a-zA-Z0-9@#_.\\/-]*$/, {
        message:
          "Only alphanumeric characters and special characters are allowed",
        excludeEmptyString: true, // Exclude empty string from validation
      }),
  });

  return (
    <div>
      <Dialog
        isOpen={isOpen}
        title={`MANAGE ACCOUNT - ${full_name}`}
        onClose={onClose}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            
            <Form>
              <Select
                disabled={
                  disableForm || userData.role === USER_ROLES.student.value
                }
                label={"Account Type"}
                name="role"
                isSearchable={false}
                placeholder={"Select Account Type"}
                options={options}
                defaultValue={{
                  label: USER_ROLES[userData.role].label,
                  value: userData.role,
                }}
                onChange={(e) => setFieldValue("role", e.value)}
              />
              <Input
                name="first_name"
                label="First Name"
                disabled={disableForm}
              />
              <Input
                name="last_name"
                label="Last Name"
                disabled={disableForm}
              />
              <Input name="username" label="Username" disabled={disableForm} />
              <Input name="email" label="Email" disabled={disableForm} />

              {!disableForm && (
                <PasswordInput
                  name="password"
                  label={"Password"}
                  disabled={disableForm}
                />
              )}

              {values["role"] !== USER_ROLES.student.value && (
                <div>
                  <Input name="tax" label="Taxonomy" disabled={true} />
                  <Input name="npi_number" label="NPI" disabled={disableForm} />
                </div>
              )}
              <div className="flex justify-center items-center">
                <div className={`grid grid-cols-2 gap-8`}>
                  <Button
                    onClick={onEdit}
                    title={"Edit Info"}
                    type="button"
                    variant="outline"
                    bg="transparent"
                    hoverBg="dark"
                    text="white"
                    hoverText="white"
                    border="dark"
                    hoverBorder="dark"
                  />
                  <Button
                    // onClick={onSave}
                    title={"Save Changes"}
                    type="submit"
                    variant="filled"
                    //   isLoading={isLoading}
                    bg={disableForm ? "bg-[#81929E]" : `bg-[#254661]`}
                    disabled={disableForm}
                    className={disableForm && "cursor-not-allowed"}
                    isLoading={isFormSubmitting}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default EditUserModal;
