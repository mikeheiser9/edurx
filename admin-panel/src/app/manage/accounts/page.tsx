"use client";
import React, { useEffect, useState } from "react";
import { DataTableColumn, DataTableColumnTextAlign } from "mantine-datatable";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import {
  deleteUserById,
  getUsers,
  updateUserById,
} from "@/service/user.service";
import {
  convertUTCtoGMT,
  getFieldnameAndErrorMessageBasedOnErrorString,
} from "@/util/functions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { USER_ROLES } from "@/util/constant";
import { TypeUserData } from "@/types/user";
import EditUserModal from "./component/EditUserModal";
import Table from "@/components/Table";
import { FormikErrors } from "formik";

const page = () => {
  const [usersList, setUsersList] = useState<TypeUserData[]>([]);
  const [totalUser, setTotalUser] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TypeUserData | null>(null);
  const [listLoader, setListLoader] = useState(false);
  const [isFormDisable, setIsFormDisable] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [prevSearchKeyword, setPrevSearchKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const [loadMoreLoader, setLoadMoreLoader] = useState(true);
  const columns = [
    {
      accessor: "",
      title: "Name",
      width: 100,
      render: (record: TypeUserData) =>
        `${record.first_name} ${record.last_name}`,
    },
    {
      accessor: "username",
      title: "Username",
      width: 100,
    },
    {
      accessor: "role",
      title: "Account Type",
      width: 100,
      render: (record: TypeUserData) => `${USER_ROLES[record.role].label}`,
    },
    {
      accessor: "joined",
      title: "Created At",
      width: 200,
      render: (record: TypeUserData) => `${convertUTCtoGMT(record.joined)}`,
    },
    {
      accessor: "",
      title: "Actions",
      textAlignment: "right" as DataTableColumnTextAlign,
      width: 100,
      render: (records: TypeUserData) => (
        <div className="flex gap-4 cursor-pointer">
          <ImBin
            onClick={() => {
              setIsDeleteOpen(true);
              setSelectedUser(records);
            }}
          />
          <FiEdit
            onClick={() => {
              setIsEditOpen(true);
              setSelectedUser(records);
              setIsFormDisable(true);
            }}
          />
        </div>
      ),
    },
  ];

  const getUsersList = async (data: TypeUserData[]) => {
    setLoadMoreLoader(true);
    const res = await getUsers(
      searchKeyword,
      pagination.page,
      pagination.limit
    );
    if (res && res.data?.response_type === "success") {
      setTotalUser(res.data.data.count);
      setUsersList([...data, ...res.data.data.data]);
    }
    setLoadMoreLoader(false);
    setListLoader(false);
  };

  const handleDelete = async (id: string | null) => {
    if (id) {
      const res = await deleteUserById(id);
      if (res && res.data.response_type === "success") {
        if (pagination.page !== 1) {
          setPagination({ ...pagination, page: 1 });
          setUsersList([]);
        } else {
          getUsersList([]);
        }
      }
    }
  };

  const handleSubmit = async (
    values: TypeUserData,
    { setErrors }: { setErrors: (errors: FormikErrors<TypeUserData>) => void }
  ) => {
    setIsFormSubmitting(true);
    if (selectedUser) {
      const res = await updateUserById(selectedUser.id, values);
      if (res && res.data && res.data.response_type == "error") {
        const { key, message }: { key: string; message: string } =
          getFieldnameAndErrorMessageBasedOnErrorString(res.data.message) || {
            key: "",
            message: "",
          };
        setErrors({ [key]: message });
      } else if (res && res.data && res.data.response_type == "success") {
        if (pagination.page !== 1) {
          setUsersList([]);
          setPagination({ ...pagination, page: 1 });
        } else {
          getUsersList([]);
        }
        setIsFormDisable(true);
      }
    }
    setIsFormSubmitting(false);
  };

  useEffect(() => {
    setListLoader(true);
    getUsersList([]);
  }, []);

  useEffect(() => {
    getUsersList(usersList);
  }, [pagination.page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (prevSearchKeyword.trim() != searchKeyword.trim()) {
        getUsersList([]);
        setPrevSearchKeyword(searchKeyword);
      }
    }, 1000);

    return () => {
      if (!timeout) return;
      clearTimeout(timeout);
    };
  }, [searchKeyword]);

  const loadMoreData = async () => {
    if (totalUser > usersList.length && usersList) {
      setPagination((prev) => {
        return { page: prev.page + 1, limit: prev.limit };
      });
    }
  };

  return (
    <div>
      {/* USER LIST */}
      <MantineProvider>
        <Table
          columns={columns as DataTableColumn<object>[]}
          isSearchEnable
          dataSource={usersList}
          isLoading={listLoader}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          loadMoreLoader={loadMoreLoader}
          loadMoreData={loadMoreData}
          noRecordsText={
            (searchKeyword.length > 0 &&
              usersList.length == 0 &&
              "No users found matching that search criteria") ||
            "No Data"
          }
        />
      </MantineProvider>

      {/* DELETE MODAL */}
      <ConfirmationDialog
        message=""
        isOpen={isDeleteOpen}
        confirmText="DELETE ACCOUNT"
        buttonsClassName="grid grid-rows-2 gap-4 w-[40%] "
        title={`Are You Sure You want to Delete ${
          selectedUser
            ? selectedUser.first_name + " " + selectedUser.last_name
            : "USER"
        }'s Account?`}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          handleDelete(selectedUser ? selectedUser.id : null);
          setIsDeleteOpen(false);
        }}
      />

      {/* EDIT MODAL */}
      {selectedUser && (
        <EditUserModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          userData={selectedUser}
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
