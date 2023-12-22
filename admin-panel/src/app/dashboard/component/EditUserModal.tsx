import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Select from "@/components/Select";
import { validateField } from "@/util/constant";
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
  handleSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  disableForm?: boolean;
  userData?: any;
  onEdit?: () => void;
  handleSubmit:any
}) => {
  const initialValues = {
    role: userData ? userData.role : "",
    first_name: userData ? userData.first_name : "",
    last_name: userData ? userData.last_name : "",
    username: userData ? userData.username : "",
    email: userData ? userData.email : "",
    password: userData ? userData.password : "",
    tax: userData ? userData.tax : "",
    npi_number: userData ? userData.npi_number : "",
  };

  const validationSchema: Yup.AnyObject = Yup.object({
    role: stringPrefixJoiValidation.required(),
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
    password: password,
    username: stringPrefixJoiValidation
      .min(3)
      .required()
      .matches(/^[a-zA-Z0-9@#_.\\/-]*$/, {
        message:
          "Only alphanumeric characters and special characters are allowed",
        excludeEmptyString: true, // Exclude empty string from validation
      }),
  });

  return (
    <div>
      <Dialog isOpen={isOpen} title="MANAGE ACCOUNT" onClose={onClose}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <Select
              disabled={disableForm}
              label={"Account Type"}
              name="role"
              isSearchable={false}
              placeholder={"Select Account Type"}
              options={[{
                value: "HEL",
                label: "Name",
              }]}
            />
            <Input
              name="first_name"
              label="First Name"
              disabled={disableForm}
            />
            <Input name="last_name" label="Last Name" disabled={disableForm} />
            <Input name="username" label="Username" disabled={disableForm} />
            <Input name="email" label="Email" disabled={disableForm} />
            <PasswordInput
              name="password"
              label={"Password"}
              disabled={disableForm}
            />
            <Input name="tax" label="Taxonomy" disabled={disableForm} />
            <Input name="npi_number" label="NPI" disabled={disableForm} />
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
                  bg={`bg-[${disableForm ? "#81929E" : "#254661"}]`}
                  disabled={disableForm}
                  className={disableForm && "cursor-not-allowed"}
                />
              </div>
            </div>
          </Form>
        </Formik>
      </Dialog>
    </div>
  );
};

export default EditUserModal;
