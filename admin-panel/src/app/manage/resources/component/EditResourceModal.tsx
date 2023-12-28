import Button from "@/components/Button";
import { Chip } from "@/components/Chip";
import Dialog from "@/components/Dialog";
import Input from "@/components/Input";
import Label from "@/components/Label";
import RadioBox from "@/components/RadioBox";
import { TypeResourceData } from "@/types/resource";
import { RESOURCE_TYPE, validateField } from "@/util/constant";
import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
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
  categoryList,
  tags,
  setTags,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: "";
  disableForm?: boolean;
  userData: TypeResourceData | null;
  onEdit?: () => void;
  handleSubmit: any;
  isFormSubmitting: boolean;
  categoryList: { _id: string; name: string }[];
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const initialValues = {
    title: userData ? userData.title : "",
    link: userData ? userData.link : "",
    publisher: userData ? userData.publisher : "",
    isResource:
      userData && userData.isResource
        ? RESOURCE_TYPE.resource
        : RESOURCE_TYPE.news,
    tags: tags,
  };

  const validationSchema: Yup.AnyObject = Yup.object({
    title: stringPrefixJoiValidation.required().min(2),
    link: stringPrefixJoiValidation.required().min(2),
    publisher: stringPrefixJoiValidation.required().min(2),
    isResource: stringPrefixJoiValidation.required(),
  });

  const onChipSelect = (id: string) => {
    setTags((tags) => [...tags, id]);
  };

  const onChipeDelete = (id: string) => {
    setTags((tags) => tags.filter((tag: string) => tag !== id));
  };

  return (
    <div>
      <Dialog
        isOpen={isOpen}
        title={
          userData ? `Manage Resource - ${userData.title}` : "Add News/Resource"
        }
        onClose={onClose}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Label title={"Type"} />
              <div className="flex gap-14">
                <RadioBox
                  size="md"
                  labelClassName="text-sm text-dark"
                  border="sm"
                  label={"News"}
                  name="type"
                  onChange={() =>
                    setFieldValue("isResource", RESOURCE_TYPE.news)
                  }
                  isChecked={values["isResource"] == RESOURCE_TYPE.news}
                  disabled={disableForm}
                />
                <RadioBox
                  size="md"
                  labelClassName="text-sm text-dark"
                  border="sm"
                  label={"Resource"}
                  name="type"
                  onChange={() =>
                    setFieldValue("isResource", RESOURCE_TYPE.resource)
                  }
                  isChecked={values["isResource"] == RESOURCE_TYPE.resource}
                  disabled={disableForm}
                />
              </div>
              <Input name="title" label="Title" disabled={disableForm} />
              <Input
                name="publisher"
                label="Publisher / Author"
                disabled={disableForm}
              />
              <Input name="link" label="Resource URL" disabled={disableForm} />
              <Label title={"Category"} />
              <div className="flex gap-5 flex-wrap">
                {categoryList.length > 0
                  ? categoryList.map((category, i) => (
                      <>
                        <Chip
                          label={category.name}
                          onSelect={() => onChipSelect(category._id)}
                          onClear={() => onChipeDelete(category._id)}
                          isSelected={tags.includes(category._id)}
                          disabled={disableForm}
                        />
                      </>
                    ))
                  : "No Categories Found"}

                <ErrorMessage name={"tags"}>
                  {(msg) => (
                    <p className=" text-red-600 text-[12px] font-semibold mb-2">
                      {msg}
                    </p>
                  )}
                </ErrorMessage>
              </div>
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
                    onClick={() => setFieldValue("tags", tags)}
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
