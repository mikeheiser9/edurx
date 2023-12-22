"use client";
import React, { useEffect, useState } from "react";
import Table from "./component/Table";
import NextImage from "@/components/NextImage";
import { DataTableColumnTextAlign } from "mantine-datatable";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { deleteUserById, getUsers } from "@/service/user.service";
import { convertUTCtoGMT } from "@/util/functions";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import EditUserModal from "./component/EditUserModal";

const page = () => {
  const [usersList, setUsersList] = useState<any>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [listLoader, setListLoader] = useState(false);
  const [isFormDisable, setIsFormDisable] = useState(true);

  const columns = [
    {
      accessor: "",
      title: "Name",
      width: 100,
      render: ({ first_name, last_name }: any) => `${first_name} ${last_name}`,
    },
    { accessor: "role", title: "Account Type", width: 100 },
    {
      accessor: "joined",
      title: "Created At",
      width: 200,
      render: ({ joined }: any) => `${convertUTCtoGMT(joined)}`,
    },
    {
      accessor: "",
      title: "Actions",
      textAlignment: "right" as DataTableColumnTextAlign,
      width: 100,
      render: (records: any) => (
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

  const getUsersList = async () => {
    setListLoader(true);
    const res = await getUsers();
    if (res && res.data?.response_type === "success") {
      setUsersList(res.data.data);
    }
    setListLoader(false);
  };

  const handleDelete = async (id: string | null) => {
    if (id) {
      const res = await deleteUserById(id);
      if (res && res.data.response_type === "success") {
        getUsersList();
      }
    }
  };

  const handleSubmit = async (values:any) => {
    console.log({values});
    // await 
    
  }

  useEffect(() => {
    getUsersList();
  }, []);

  return (
    <div>
      {/* USER LIST */}
      <MantineProvider>
        <Table
          columns={columns}
          isSearchEnable
          dataSource={usersList}
          isLoading={listLoader}
        />
      </MantineProvider>

      {/* DELETE MODAL */}
      <ConfirmationDialog
        message=""
        isOpen={isDeleteOpen}
        confirmText="DELETE ACCOUNT"
        buttonsClassName="grid grid-rows-2 gap-4 w-[40%] "
        title={`Are You Sure You want to Delete ${selectedUser  ? (selectedUser.first_name + ' ' + selectedUser.last_name) : "USER"}'s Account?`}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          handleDelete(selectedUser ? selectedUser._id : null);
          setIsDeleteOpen(false);
        }}
      />

      {/* EDIT MODAL */}
      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={selectedUser}
        disableForm={isFormDisable}
        onEdit={()=> setIsFormDisable(false)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default page;
