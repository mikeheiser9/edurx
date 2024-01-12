import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Input from "@/components/Input";
import Label from "@/components/Label";
import RadioBox from "@/components/RadioBox";
import Select from "@/components/Select";
import { TypeCategoryFilter } from "@/types/resource";
import { CATEGORYFILTER_TYPE, validateField } from "@/util/constant";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const { stringPrefixJoiValidation } = validateField;

const EditCategoryFilterModal = ({
  isOpen = true,
  onClose,
  disableForm,
  selectedData,
  onEdit,
  handleSubmit,
  isFormSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: "";
  disableForm?: boolean;
  selectedData: TypeCategoryFilter | null;
  onEdit?: () => void;
  handleSubmit: any;
  isFormSubmitting: boolean;
  loadMoreButton?: () => void;
  loadMoreLoader?: boolean;
}) => {

  const options = [
    {
      label: "Dietetics & Nutrition",
      value: "Dietetics & Nutrition",
    },
    {
      label: "Medical professionals",
      value: "Medical professionals",
    },
    {
      label: "RDN",
      value: "RDN",
    },
    {
      label: "NDTR",
      value: "NDTR",
    },
    {
      label: "Student",
      value: "Student",
    },
  ];

  let forumType: unknown = "";

  if (selectedData) {
    forumType = options.filter(
      (option) => option.value === selectedData.forumType
    );
  }

  const initialValues = {
    name: selectedData ? selectedData.name : "",
    forumType: forumType,
    type: selectedData ? selectedData.type : CATEGORYFILTER_TYPE.category,
  };

  const validationSchema: Yup.AnyObject = Yup.object({
    name: stringPrefixJoiValidation.required().min(2),
    type: stringPrefixJoiValidation.required().min(2),
    forumType: Yup.array().min(1).required(),
  });

  return (
    <div>
      <Dialog
        isOpen={isOpen}
        title={
          selectedData
            ? `Manage Category / Filter - ${selectedData.name}`
            : "Add Category / Filter"
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
                  label={"Category"}
                  name="type"
                  onChange={() =>
                    setFieldValue("type", CATEGORYFILTER_TYPE.category)
                  }
                  isChecked={values["type"] == CATEGORYFILTER_TYPE.category}
                  disabled={selectedData ? true : disableForm}
                />
                <RadioBox
                  size="md"
                  labelClassName="text-sm text-dark"
                  border="sm"
                  label={"Filter"}
                  name="type"
                  onChange={() =>
                    setFieldValue("type", CATEGORYFILTER_TYPE.filter)
                  }
                  isChecked={values["type"] == CATEGORYFILTER_TYPE.filter}
                  disabled={selectedData ? true : disableForm}
                />
              </div>
              <Input name="name" label="Name" disabled={disableForm} />
              <Select
                disabled={selectedData ? true : disableForm}
                label={"Forum Type"}
                name="forumType"
                isSearchable={false}
                placeholder={"Select Forum Type"}
                defaultValue={
                  selectedData &&
                  (forumType as { label: string; value: string })
                }
                options={options}
                onChange={(e) => {
                  setFieldValue("forumType", e);
                }}
                isMulti
              />
              <div className="flex justify-center items-center">
                <div
                  className={`grid ${
                    selectedData ? "grid-cols-2" : "grid-cols-1"
                  } gap-8 my-2`}
                >
                  {selectedData && (
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
                  )}
                  <Button
                    title={"Save Changes"}
                    type="submit"
                    variant="filled"
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

export default EditCategoryFilterModal;
