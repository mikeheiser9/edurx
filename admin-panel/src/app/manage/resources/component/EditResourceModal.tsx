import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Input from "@/components/Input";
import RadioBox from "@/components/RadioBox";
import { TypeResourceData } from "@/types/resource";
import { validateField } from "@/util/constant";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const { stringPrefixJoiValidation, password } = validateField;

const EditResourceModal = ({
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
  title?: "";
  disableForm?: boolean;
  userData: TypeResourceData;
  onEdit?: () => void;
  handleSubmit: any;
  isFormSubmitting: boolean;
}) => {
  const initialValues = {
    title: userData ? userData.title : "",
    link: userData ? userData.link : "",
    publisher: userData ? userData.publisher : "",
    isResource: userData && userData.isResource ? "resource" : "news",
    tags: [],
  };

  const validationSchema: Yup.AnyObject = Yup.object({
    title: stringPrefixJoiValidation.required(),
    link: stringPrefixJoiValidation.required(),
    publisher: stringPrefixJoiValidation.required(),
    isResource: stringPrefixJoiValidation.required(),
  });

  return (
    <div>
      <Dialog
        isOpen={isOpen}
        title={`Manage Resource - ${userData.title}`}
        onClose={onClose}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="flex gap-14">
                <RadioBox
                  size="md"
                  labelClassName="text-sm text-dark"
                  border="sm"
                  label={"News"}
                  name="type"
                  onChange={() => setFieldValue("isResource","news")}
                  isChecked={values["isResource"] == "news"}  
                />
                <RadioBox
                  size="md"
                  labelClassName="text-sm text-dark"
                  border="sm"
                  label={"Resource"}
                  name="type"
                  onChange={() => setFieldValue("isResource","resource")}
                  isChecked={values["isResource"] == "resource"}  
                />
              </div>
              <Input name="title" label="Title" disabled={disableForm} />
              <Input
                name="publisher"
                label="Publisher / Author"
                disabled={disableForm}
              />
              <Input name="link" label="Resource URL" disabled={disableForm} />
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

export default EditResourceModal;
