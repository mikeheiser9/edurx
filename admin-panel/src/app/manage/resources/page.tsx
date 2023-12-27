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
  deleteResourceById,
  getResources,
  updateResourceById,
} from "@/service/resources.service";
import { TypeResourceData } from "@/types/resource";
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
        `${convertUTCtoGMT(record.createdAt)}`,
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
              setSelectedResource(records);
            }}
          />
          <FiEdit
            onClick={() => {
              setIsEditOpen(true);
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
    const res = await getResources();
    console.log({ res });

    if (res && res.data?.response_type === "success") {
      setResourceList(res.data.data);
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
    { setErrors }: { setErrors: (errors: FormikErrors<TypeResourceData>) => void }
  ) => {
    console.log({values});
    
    // setIsFormSubmitting(true);
    // if (selectedResource) {
    //   const res = await updateResourceById(selectedResource._id, values as any);
    //   if (res && res.data && res.data.response_type == "error") {
    //     const { key, message }: { key: string; message: string } =
    //       getFieldnameAndErrorMessageBasedOnErrorString(res.data.message) || {
    //         key: "",
    //         message: "",
    //       };
    //     setErrors({ [key]: message });
    //   } else if (res && res.data && res.data.response_type == "success") {
    //     getResourcesList();
    //     setIsFormDisable(true);
    //   }
    // }
    // setIsFormSubmitting(false);
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
          handleDelete(selectedResource ? selectedResource._id : null);
          setIsDeleteOpen(false);
        }}
      />

      {/* EDIT MODAL */}
      {selectedResource && (
        <EditResourceModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          userData={selectedResource}
          disableForm={isFormDisable}
          onEdit={() => setIsFormDisable(false)}
          handleSubmit={handleSubmit}
          isFormSubmitting={isFormSubmitting}
        />
      )}
    </div>
  );
};

export default page;
