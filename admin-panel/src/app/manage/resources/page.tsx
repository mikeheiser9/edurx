"use client";
import React, { useEffect, useState } from "react";
import { DataTableColumn, DataTableColumnTextAlign } from "mantine-datatable";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import {
  convertUTCtoGMT,
  getFieldnameAndErrorMessageBasedOnErrorString,
} from "@/util/functions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Table from "@/components/Table";
import {
  addResource,
  deleteResourceById,
  getCategories,
  getResources,
  updateResourceById,
} from "@/service/resources.service";
import { TypeResourceData, TypeResourceTags } from "@/types/resource";
import EditResourceModal from "./component/EditResourceModal";
import { FormikErrors } from "formik";

const page = () => {
  const [resourceList, setResourceList] = useState<TypeResourceData[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<TypeResourceData | null>(null);
  const [listLoader, setListLoader] = useState(false);
  const [isFormDisable, setIsFormDisable] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [categoryList, setCategoryList] = useState<
    { _id: string; name: string }[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);

  const setUserTag = (record: TypeResourceData) => {
    if (record && record.tags && record.tags.length > 0) {
      setTags(
        (record.tags as TypeResourceTags[]).map(
          (tag: TypeResourceTags) => tag._id
        )
      );
    }
  };

  const columns = [
    {
      accessor: "isResource",
      title: "Type",
      width: 100,
      render: (record: TypeResourceData) =>
        record.isResource ? "Resource" : "News",
    },
    {
      accessor: "title",
      title: "Title",
      width: 100,
    },
    {
      accessor: "publisher",
      title: "Author / Publisher",
      width: 100,
    },
    {
      accessor: "createdAt",
      title: "Created At",
      width: 200,
      render: (record: TypeResourceData) =>
        `${convertUTCtoGMT(record.createdAt as string)}`,
    },
    {
      accessor: "",
      title: "Actions",
      textAlignment: "right" as DataTableColumnTextAlign,
      width: 100,
      render: (records: TypeResourceData) => (
        <div className="flex gap-4 cursor-pointer">
          <ImBin
            onClick={() => {
              setIsDeleteOpen(true);
              setUserTag(records);
              setSelectedResource(records);
            }}
          />
          <FiEdit
            onClick={() => {
              setIsEditOpen(true);
              setUserTag(records);
              setSelectedResource(records);
              setIsFormDisable(true);
            }}
          />
        </div>
      ),
    },
  ];

  const getResourcesList = async () => {
    setListLoader(true);
    const resourceRes = await getResources();
    const categoriesRes = await getCategories({
      name: "",
      limit: 4,
      page: 1,
    });

    if (resourceRes && resourceRes.data?.response_type === "success") {
      setResourceList(resourceRes.data.data);
    }
    if (categoriesRes && categoriesRes.data?.response_type === "success") {
      const categoriesData = categoriesRes.data.data.records;
      let categories: { _id: string; name: string }[] = [];
      if (categoriesData.length > 0) {
        categoriesData.map((category: any) =>
          categories.push({ name: category.name, _id: category._id })
        );
      }
      setCategoryList(categories);
    }
    setListLoader(false);
  };

  const handleDelete = async (id: string | null) => {
    if (id) {
      const res = await deleteResourceById(id);
      if (res && res.data.response_type === "success") {
        getResourcesList();
      }
    }
  };

  const handleSubmit = async (
    values: TypeResourceData,
    {
      setErrors,
    }: { setErrors: (errors: FormikErrors<TypeResourceData>) => void }
  ) => {
    try {
      if (categoryList.length > 0 &&( values.tags.length == 0 || values.tags.length > 2)) {
        setErrors({
          tags: "Minimum of 1 or Maximum 2 Category can be selected",
        });
        return;
      }
      setIsFormSubmitting(true);
      if (selectedResource) {
        const res = await updateResourceById(selectedResource._id as string, {
          ...values,
          _id: selectedResource._id,
        });
        if (res && res.data && res.data.response_type == "error") {
          const { key, message }: { key: string; message: string } =
            getFieldnameAndErrorMessageBasedOnErrorString(res.data.message) || {
              key: "",
              message: "",
            };
          setErrors({ [key]: message });
        } else if (res && res.data && res.data.response_type == "success") {
          getResourcesList();
          setIsFormDisable(true);
        }
      } else {
        const res = await addResource(values);
        if (res && res.data && res.data.response_type == "success") {
          getResourcesList();
          setIsEditOpen(false);
        }
      }
    } catch (error) {}
    setIsFormSubmitting(false);
  };

  useEffect(() => {
    getResourcesList();
  }, []);

  return (
    <div>
      {/* USER LIST */}
      <MantineProvider>
        <Table
          columns={columns as DataTableColumn<object>[]}
          isButtonEnable
          buttonLabel="Add New"
          dataSource={resourceList}
          isLoading={listLoader}
          buttonClick={() => {
            setSelectedResource(null);
            setTags([]);
            setIsEditOpen(true);
            setIsFormDisable(true);
          }}
        />
      </MantineProvider>

      {/* DELETE MODAL */}
      <ConfirmationDialog
        message=""
        isOpen={isDeleteOpen}
        confirmText="DELETE ACCOUNT"
        buttonsClassName="grid grid-rows-2 gap-4 w-[40%] "
        title={`Are You Sure You want to Delete this Article?`}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          handleDelete(
            selectedResource ? (selectedResource._id as string) : null
          );
          setIsDeleteOpen(false);
        }}
      />

      {/* EDIT MODAL */}
      <EditResourceModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={selectedResource}
        disableForm={isFormDisable}
        onEdit={() => setIsFormDisable(false)}
        handleSubmit={handleSubmit}
        isFormSubmitting={isFormSubmitting}
        categoryList={categoryList}
        tags={tags}
        setTags={setTags}
      />
    </div>
  );
};

export default page;
