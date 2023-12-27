import Button from "@/components/Button";
import Input from "@/components/Input";
import SearchInput from "@/components/SearchInput";
import SectionLoader from "@/components/SectionLoader";
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
} from "mantine-datatable";
import React, { useEffect, useRef, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";

interface TableProps {
  columns: DataTableColumn<object>[];
  dataSource?: object[];
  noRecordsText?: string;
  isSearchEnable?: boolean;
  isButtonEnable?: boolean;
  buttonLabel?: string;
  buttonClick?: () => void;
  isLoading?: boolean;
  searchKeyword?: string;
  setSearchKeyword?: React.Dispatch<React.SetStateAction<string>>;
}

const Table = (props: TableProps) => {
  const {
    columns,
    dataSource,
    noRecordsText,
    isSearchEnable,
    isButtonEnable,
    buttonLabel,
    buttonClick,
    isLoading,
    searchKeyword,
    setSearchKeyword,
  } = props;

  const customRowStyle = (
    record: object,
    index: number
  ): React.CSSProperties => ({
    borderBottom: "2px solid black",
    borderTop: "2px solid black",
  });

  return (
    <div className="relative px-6 pt-2 ">
      <div className="relative bg-[#A5A5A8] p-6 rounded-xl min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between gap-4 mb-6 ">
          {isSearchEnable && (
            <div>
              <SearchInput
                parentClassName="w-72"
                placeholder={"Search Username"}
                startIcon={<RiSearch2Line />}
                rounded
                value={searchKeyword}
                handleChange={(e) =>
                  setSearchKeyword && setSearchKeyword(e.target.value)
                }
              />
            </div>
          )}
          {isButtonEnable && (
            <Button
              onClick={buttonClick}
              title={buttonLabel}
              type="submit"
              variant="filled"
              //   isLoading={isLoading}
              bg={"bg-[#254661]"}
            />
          )}
        </div>

        {isLoading ? (
          <div className="relative h-[calc(100vh-208px)]">
            <SectionLoader />
          </div>
        ) : (
          <DataTable
            columns={columns}
            records={dataSource}
            minHeight={450}
            miw={650}
            idAccessor={(records: any) => records._id}
            //   page={10000}
            //   recordsPerPage={100000}
            //   totalRecords={pagination.total}
            //   recordsPerPageOptions={pagination.page_sizes_option}
            //   onRecordsPerPageChange={setPageSize}
            //   sortStatus={sortStatus}
            //   onSortStatusChange={setSortStatus}
            //   onPageChange={(p) => setPagination({ ...pagination, page: p })}
            noRecordsText={noRecordsText ?? "No Data"}
            backgroundColor={"#A5A5A8"}
            rowStyle={customRowStyle}
          />
        )}
      </div>
    </div>
  );
};

export default Table;
