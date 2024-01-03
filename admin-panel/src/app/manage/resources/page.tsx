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
  const [totalResources, setTotalResources] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const [categoryPagination, setCategoryPagination] = useState({
    page: 1,
    limit: 4,
  });
  const [totalCategory, setTotalCategory] = useState(0);
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
  const [categoryLoader, setCategoryLoader] = useState(false);
  const [loadMoreLoader, setLoadMoreLoader] = useState(false);

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
              getCategoryList([], getCatTags);
            }}
          />
        </div>
      ),
    },
  ];

  const getCategoryList = async (
    data: { _id: string; name: string }[],
    getCatTag?: string[]
  ) => {
    setCategoryLoader(true);
    
    let categoryPaginate =
      totalCategory > categoryList.length
        ? { ...categoryPagination }
        : { page: 1, limit: 4 };

    let categoriesRes;
    if (getCatTag && getCatTag.length > 0) {
      categoriesRes = await getCategories({
        ...categoryPaginate,
        selectedCategoryIds: getCatTag,
      });
    } else {
      categoriesRes = await getCategories({ ...categoryPaginate });
    }

    if (categoriesRes && categoriesRes.data?.response_type === "success") {
      const categoriesData = categoriesRes.data.data.records;
      setTotalCategory(categoriesRes.data.data.totalRecords);
      let categories: { _id: string; name: string }[] = [];
      if (categoriesData.length > 0) {
        categoriesData.map((category: any) =>
          categories.push({ name: category.name, _id: category._id })
        );
      }
      setCategoryList([...data, ...categories]);
    }
    setCategoryLoader(false);
  };

  const getResourcesList = async (data: TypeResourceData[]) => {
    setLoadMoreLoader(true)
    const resourceRes = await getResources({ ...pagination });

    if (resourceRes && resourceRes.data?.response_type === "success") {
      setResourceList([...data, ...resourceRes.data.data.data]);
      setTotalResources(resourceRes.data.data.count);
    }
    setLoadMoreLoader(false)
    setListLoader(false);
  };

  const handleDelete = async (id: string | null) => {
    if (id) {
      const res = await deleteResourceById(id);
      if (res && res.data.response_type === "success") {
        if (pagination.page !== 1) {
          setPagination({ ...pagination, page: 1 });
          setResourceList([]);
        } else {
          getResourcesList([]);
        }
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
          if (pagination.page !== 1) {
            setPagination({ ...pagination, page: 1 });
            setResourceList([]);
          } else {
            getResourcesList([]);
          }
          setIsFormDisable(true);
        }
      } else {
        const res = await addResource(values);
        if (res && res.data && res.data.response_type == "success") {
          if (pagination.page !== 1) {
            setPagination({ ...pagination, page: 1 });
            setResourceList([]);
          } else {
            getResourcesList([]);
          }
          setIsEditOpen(false);
        }
      }
    } catch (error) {}
    setIsFormSubmitting(false);
  };

  const setUserTag = (record: TypeResourceData) => {
    if (record && record.tags && record.tags.length > 0) {
      setTags(
        (record.tags as TypeResourceTags[]).map(
          (tag: TypeResourceTags) => tag._id
        )
      );
    }
  };

  const loadMoreCategories = () => {
    if (totalCategory > categoryList.length) {
      setCategoryPagination((prev) => {
        return { page: prev.page + 1, limit: 4 };
      });
    }
  };

  const loadMoreData = async () => {
    if (totalResources > resourceList.length && resourceList) {
      setPagination((prev) => {
        return { page: prev.page + 1, limit: prev.limit };
      });
    }
  };

  useEffect(() => {
    setListLoader(true);
    getResourcesList([]);
  }, []);

  useEffect(() => {
    getResourcesList(resourceList);
  }, [pagination.page]);

  useEffect(() => {
    getCategoryList(categoryList);
  }, [categoryPagination.page]);

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
          loadMoreData={loadMoreData}
          buttonClick={() => {
            setSelectedResource(null);
            setTags([]);
            setIsEditOpen(true);
            setIsFormDisable(false);
          }}
          loadMoreLoader={loadMoreLoader}
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
