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
  searchingFields?: string[];
  isLoading?: boolean;
}

const Table = (props: TableProps) => {
  const {
    columns,
    dataSource,
    noRecordsText,
    isSearchEnable,
    isButtonEnable,
    buttonLabel,
    searchingFields,
    buttonClick,
    isLoading,
  } = props;

  const [searchedData, setSearchedData] = useState([]);
  const [records, setRecords] = useState([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "key",
    direction: "asc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    page_sizes_option: [10, 15, 20, 50],
    total: 0,
  });
  const [pageSize, setPageSize] = useState(pagination.page_sizes_option[0]);
  const searchRef = useRef("");
  //   useEffect(() => {
  //     if (dataSource) {
  //       const { page } = pagination;
  //       const from = (page - 1) * pageSize;
  //       const to = from + pageSize;
  //       let recordArr = [];
  //       if (searchedData.length > 0) {
  //         recordArr = searchedData.slice(from, to);
  //       } else {
  //         recordArr = dataSource.slice(from, to);
  //         setPagination({ ...pagination, total: dataSource.length });
  //       }
  //       setRecords(recordArr);
  //     }
  //   }, [dataSource, pagination.page, pageSize, searchedData]);

  //   useEffect(() => {
  //     setPagination({ ...pagination, page: 1 });
  //   }, [pageSize]);

  //   useEffect(() => {
  //     setSortStatus({ columnAccessor: "key", direction: "asc" });
  //     setSearchedData([]);
  //     searchRef.current = "";
  //   }, [dataSource]);

  //   useEffect(() => {
  //     if (dataSource) {
  //       const { page } = pagination;
  //       const from = (page - 1) * pageSize;
  //       const to = from + pageSize;

  //       const nameSorter = (item) => item.name.toLowerCase();
  //       const setSorter = sortStatus.columnAccessor === "name" ? nameSorter : [];

  //       const sortedAllItems =
  //         searchedData.length > 0
  //           ? sortBy(searchedData, [setSorter], sortStatus.columnAccessor)
  //           : sortBy(dataSource, [setSorter], sortStatus.columnAccessor);

  //       const sortedSlicedData =
  //         sortStatus.direction === "desc"
  //           ? sortedAllItems.reverse().slice(from, to)
  //           : sortedAllItems.slice(from, to);

  //       setRecords(sortedSlicedData);
  //     }
  //   }, [sortStatus, dataSource, pagination.page, pageSize]);

  //   const handleSearch = async () => {
  //     if (dataSource) {
  //       const value: string = searchRef.current.trim().toLocaleLowerCase();
  //       const indexes = searchingFields;

  //       let searchRecordLen = 0;
  //       let record = [];

  //       if (value !== "") {
  //         const filter = dataSource.filter((obj) =>
  //           Object.keys(obj).some((key) => {
  //             return (
  //               indexes.includes(key) &&
  //               String(obj[key]).toLocaleLowerCase().includes(value)
  //             );
  //           })
  //         );
  //         filter.length > 0 ? setSearchedData(filter) : (record = []);
  //         searchRecordLen = filter.length;
  //       } else {
  //         searchRecordLen = dataSource.length;
  //         record = dataSource.slice(0, pageSize);
  //         setSearchedData([]);
  //       }

  //       setRecords(record);
  //       setPagination({ ...pagination, page: 1, total: searchRecordLen });
  //     }
  //   };

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
                placeholder={"Search"}
                startIcon={<RiSearch2Line />}
                rounded
                value={""}
                //   handleChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
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
