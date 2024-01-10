"use client";
import React, { useEffect, useState } from "react";
import { DataTableColumn, DataTableColumnTextAlign } from "mantine-datatable";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import {
  capitalize,
  convertUTCtoGMT,
  getFieldnameAndErrorMessageBasedOnErrorString,
} from "@/util/functions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Table from "@/components/Table";
import { TypeCategoryFilter } from "@/types/resource";
import { FormikErrors } from "formik";
import {
  addCategoryFilter,
  getCategoryFilter,
  updateCategoryFilterById,
} from "@/service/category.service";
import EditCategoryFilterModal from "./component/EditCategoryFilterModal";

const page = () => {
  //======================= Use States =============================//

  const [categoryFilterList, setCategoryFilterList] = useState<
    TypeCategoryFilter[]
  >([]);
  const [totalCategoryFilter, setTotalCategoryFilter] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [categoryFilterPage, setCategoryFilterPage] = useState(1);

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<TypeCategoryFilter | null>(null);

  const [listLoader, setListLoader] = useState(false);
  const [loadMoreLoader, setLoadMoreLoader] = useState(false);

  const [isFormDisable, setIsFormDisable] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  //================================================================//

  //======================= Use Effects ============================//

  useEffect(() => {
    setListLoader(true);
    getCategoriesAndFilterList();
  }, []);

  //================================================================//
  //======================= Submit Handler =========================//

  const handleSubmit = async (
    values: TypeCategoryFilter,
    {
      setErrors,
    }: { setErrors: (errors: FormikErrors<TypeCategoryFilter>) => void }
  ) => {
    try {
      let responseSuccess = false;

      if (selectedCategoryFilter) {
        const res = await updateCategoryFilterById(
          selectedCategoryFilter._id as string,
          {
            ...values,
          }
        );
        if (res && res.data && res.data.response_type == "error") {
          const { key, message }: { key: string; message: string } =
            getFieldnameAndErrorMessageBasedOnErrorString(res.data.message) || {
              key: "",
              message: "",
            };
          setErrors({ [key]: message });
        } else if (res && res.data && res.data.response_type == "success") {
          responseSuccess = true;
          setIsFormDisable(true);
        }
      } else {
        const res = await addCategoryFilter(values);
        if (res && res.data && res.data.response_type == "success") {
          responseSuccess = true;
          setIsEditOpen(false);
        }
      }
      if (responseSuccess) {
        resetCategoryFilter();
      }
    } catch (error) {
      console.log(error);
    }
    setIsFormSubmitting(false);
  };

  //================================================================//
  //======================= Api Calls ==============================//

  const getCategoriesAndFilterList = async (page: number = 1) => {
    setLoadMoreLoader(true);
    try {
      const res = await getCategoryFilter(page);

      if (res && res.data?.response_type === "success") {
        setCategoryFilterList((prev) => [...prev, ...res.data.data.data]);
        setTotalCategoryFilter(res.data.data.count);
        setCategoryFilterPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Error in Fetching Resources");
    }
    setLoadMoreLoader(false);
    setListLoader(false);
  };

  //   const handleDelete = async (id: string | null) => {
  //     if (id) {
  //       const res = await deleteResourceById(id);
  //       if (res && res.data.response_type === "success") {
  //         resetResource();
  //       }
  //     }
  //   };

  //================================================================//
  //=======================  Function ==============================//

  const resetCategoryFilter = () => {
    setCategoryFilterPage(1);
    setCategoryFilterList([]);
    getCategoriesAndFilterList();
  };

  // LoadMore Category
  const loadMoreCategoriyFilter = async () => {
    if (
      totalCategoryFilter > categoryFilterList.length &&
      categoryFilterPage !== 1
    ) {
      await getCategoriesAndFilterList(categoryFilterPage);
    }
  };

  //================================================================//
  //======================= Constant ===============================//

  const columns = [
    {
      accessor: "name",
      title: "Name",
      width: 100,
    },
    {
      accessor: "type",
      title: "Type",
      width: 100,
      render: (records: any) => `${capitalize(records.type)}`,
    },
    {
      accessor: "forumType",
      title: "Forum Type",
      width: 100,
    },
    {
      accessor: "createdAt",
      title: "Created At",
      width: 200,
      render: (record: TypeCategoryFilter) =>
        `${convertUTCtoGMT(record.createdAt as string)}`,
    },
    {
      accessor: "",
      title: "Actions",
      textAlignment: "right" as DataTableColumnTextAlign,
      width: 100,
      render: (records: TypeCategoryFilter) => (
        <div className="flex gap-4 cursor-pointer">
          <ImBin
            onClick={() => {
              setSelectedCategoryFilter(records);
              setIsDeleteOpen(true);
            }}
          />
          <FiEdit
            onClick={() => {
              // setSelectedCategoryFilter(records);
              // setIsEditOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* USER LIST */}
      <MantineProvider>
        <Table
          columns={columns as DataTableColumn<object>[]}
          isButtonEnable
          buttonLabel="Add New"
          dataSource={categoryFilterList}
          isLoading={listLoader}
          loadMoreData={loadMoreCategoriyFilter}
          loadMoreLoader={loadMoreLoader}
          buttonClick={() => {
            setSelectedCategoryFilter(null);
            setIsEditOpen(true);
            setIsFormDisable(false);
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
          //   handleDelete(
          //     selectedResource ? (selectedResource._id as string) : null
          //   );
          //   setIsDeleteOpen(false);
        }}
      />

      {/* EDIT MODAL */}
      <EditCategoryFilterModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
        }}
        selectedData={selectedCategoryFilter}
        disableForm={isFormDisable}
        onEdit={() => setIsFormDisable(false)}
        handleSubmit={handleSubmit}
        isFormSubmitting={isFormSubmitting}
        loadMoreButton={() => {}}
        loadMoreLoader={false}
      />
    </div>
  );
};

export default page;
