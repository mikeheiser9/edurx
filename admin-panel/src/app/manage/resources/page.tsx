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

interface TypeCategory {
  _id: string;
  name: string;
}

const page = () => {
  //======================= Use States =============================//

  const [resourceList, setResourceList] = useState<TypeResourceData[]>([]);
  const [categoryList, setCategoryList] = useState<TypeCategory[]>([]);
  const [totalResources, setTotalResources] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [resourcePage, setResourcePage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);

  const [selectedResource, setSelectedResource] =
    useState<TypeResourceData | null>(null);

  const [listLoader, setListLoader] = useState(false);
  const [categoryLoader, setCategoryLoader] = useState(false);
  const [loadMoreLoader, setLoadMoreLoader] = useState(false);

  const [isFormDisable, setIsFormDisable] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // For setTags according to Selected Category
  const [tags, setTags] = useState<string[]>([]);

  //================================================================//

  //======================= Use Effects ============================//

  useEffect(() => {
    setListLoader(true);
    getResourcesList();
    getCategoryList();
  }, []);

  //================================================================//
  //======================= Submit Handler =========================//

  const handleSubmit = async (
    values: TypeResourceData,
    {
      setErrors,
    }: { setErrors: (errors: FormikErrors<TypeResourceData>) => void }
  ) => {
    try {
      let responseSuccess = false;
      if (
        categoryList.length > 0 &&
        (values.tags.length == 0 || values.tags.length > 2)
      ) {
        setErrors({
          tags: "Minimum 1 or Maximum 2 Category can be selected",
        });
        return;
      }
      setIsFormSubmitting(true);

      if (selectedResource) {
        const res = await updateResourceById(selectedResource._id as string, {
          ...values,
        });
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
        const res = await addResource(values);
        if (res && res.data && res.data.response_type == "success") {
          responseSuccess = true;
          setIsEditOpen(false);
        }
      }
      if (responseSuccess) {
        resetResource();
      }
    } catch (error) {
      console.log(error);
    }
    setIsFormSubmitting(false);
  };

  //================================================================//
  //======================= Api Calls ==============================//

  const getResourcesList = async (page: number = 1) => {
    setLoadMoreLoader(true);
    try {
      const resourceRes = await getResources(page);

      if (resourceRes && resourceRes.data?.response_type === "success") {
        setResourceList((prev) => [...prev, ...resourceRes.data.data.data]);
        setTotalResources(resourceRes.data.data.count);
        setResourcePage((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Error in Fetching Resources");
    }
    setLoadMoreLoader(false);
    setListLoader(false);
  };

  const getCategoryList = async (
    page: number = 1,
    selectedCategoryIds?: string[]
  ) => {
    setCategoryLoader(true);
    let categoriesRes;
    if (selectedCategoryIds && selectedCategoryIds.length > 0) {
      categoriesRes = await getCategories(page, 4, selectedCategoryIds);
    } else {
      categoriesRes = await getCategories(page);
    }
    if (categoriesRes && categoriesRes.data?.response_type === "success") {
      const categoriesData = categoriesRes.data.data.records;
      let categories: { _id: string; name: string }[] = [];
      if (categoriesData.length > 0) {
        categoriesData.map((category: any) =>
          categories.push({ name: category.name, _id: category._id })
        );
      }
      setTotalCategory(categoriesRes.data.data.totalRecords);
      setCategoryList((prev) => [...prev, ...categories]);
      setCategoryPage((prev) => prev + 1);
    }
    setCategoryLoader(false);
  };

  const handleDelete = async (id: string | null) => {
    if (id) {
      const res = await deleteResourceById(id);
      if (res && res.data.response_type === "success") {
        resetResource();
      }
    }
  };

  //================================================================//
  //=======================  Function ==============================//

  const resetResource = () => {
    setResourcePage(1);
    setResourceList([]);
    getResourcesList();
  };

  const resetCategory = () => {
    setCategoryPage(1);
    setCategoryList([]);
  };

  // LoadMore Resources
  const loadMoreResources = async () => {
    if (totalResources > resourceList.length && resourcePage !== 1) {
      await getResourcesList(resourcePage);
    }
  };

  // LoadMore Category
  const loadMoreCategories = async () => {
    if (totalCategory > categoryList.length && categoryPage !== 1) {
      await getCategoryList(categoryPage, tags);
    }
  };

  // For setTags according to Selected Category
  const setUserTag = (record: TypeResourceData) => {
    if (record && record.tags && record.tags.length > 0) {
      setTags(
        (record.tags as TypeResourceTags[]).map(
          (tag: TypeResourceTags) => tag._id
        )
      );
    }
  };

  //================================================================//
  //======================= Constant ===============================//

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
              setSelectedResource(records);
              setIsDeleteOpen(true);
            }}
          />
          <FiEdit
            onClick={() => {
              setSelectedResource(records);
              setUserTag(records);
              setIsFormDisable(true);
              setIsEditOpen(true);
              const getCatTags = (records.tags as TypeResourceTags[]).map(
                (tag: TypeResourceTags) => tag._id
              );
              resetCategory();
              getCategoryList(1, getCatTags);
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
          dataSource={resourceList}
          isLoading={listLoader}
          loadMoreData={loadMoreResources}
          loadMoreLoader={loadMoreLoader}
          buttonClick={() => {
            setSelectedResource(null);
            setTags([]);
            setIsEditOpen(true);
            resetCategory();
            setIsFormDisable(false);
            getCategoryList();
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
        onClose={() => {
          setIsEditOpen(false);
        }}
        userData={selectedResource}
        disableForm={isFormDisable}
        onEdit={() => setIsFormDisable(false)}
        handleSubmit={handleSubmit}
        isFormSubmitting={isFormSubmitting}
        categoryList={categoryList}
        tags={tags}
        setTags={setTags}
        loadMoreButton={loadMoreCategories}
        loadMoreLoader={categoryLoader}
      />
    </div>
  );
};

export default page;
