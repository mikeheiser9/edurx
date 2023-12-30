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
    wordWrap: "break-word",
  });

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  
  const batchSize = 20;
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(dataSource ?? []);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  useEffect(() => {
    loadMoreRecords();
  }, [dataSource]);

  const loadMoreRecords = () => {
    if (dataSource) {
      
        setLoading(true);
        timeout = setTimeout(() => {
          setRecords(dataSource.slice(0, records.length + batchSize));
          setLoading(false);
        }, 1000);
      }else{
        setRecords([]);
        setLoading(false);
      }
  };

  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [timeout]);
  
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
            records={records}
            minHeight={650}
            miw={650}
            idAccessor={(records: any) => records._id}
            noRecordsText={noRecordsText ?? "No Data"}
            backgroundColor={"#A5A5A8"}
            rowStyle={customRowStyle}
            onScrollToBottom={loadMoreRecords}
            scrollViewportRef={scrollViewportRef}
            height={300}
            fetching={loading}
            customLoader={<SectionLoader />}
          />
        )}
      </div>
    </div>
  );
};

export default Table;
