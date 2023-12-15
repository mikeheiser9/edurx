import { Modal } from "@/components/modal";
import { showToast } from "@/components/toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@/components/checkbox";
import {
  getSelectedForumFilters,
  setSelectedFilter,
} from "@/redux/ducks/forum.duck";
import InfiniteScroll from "@/components/infiniteScroll";
import { axiosGet } from "@/axios/config";
import { responseCodes } from "@/util/constant";
interface Props {
  accountSettingModal: UseModalType;
}

interface filterType {
  _id: string;
  type: "filter";
  name: string;
}
export const FilterSetting = ({ accountSettingModal }: Props) => {
  const dispatch = useDispatch()
  const selectedFilters: FilterOptionsState = useSelector(
    getSelectedForumFilters
  );
  const [selectedLocalFilters, setSelectedLocalFilters] =
    useState<FilterOptionsState | null>(null);
  const [filters, setFilters] = useState<filterType[]>([]);
  const [filtersLoading, setFilterLoading] = useState(false);
  const [filterPagination, setFilterPagination] = useState<PageDataState>({
    page: 1,
    totalRecords: 0,
  });

  const getFilter = async (page: number = 1) => {
    try {
      setFilterLoading(true);
      const response = await axiosGet("/post/category/search", {
        params: {
          name: "",
          type: "filter",
          limit: 10,
          page,
          forumType: selectedFilters?.forumType
        },
      });
      if (response.status === responseCodes.SUCCESS) {
        setFilterLoading(false);
        setFilters((prevStates) => [...prevStates, ...response?.data?.data?.records]);
        setFilterPagination({
          page: response?.data?.data?.currentPage,
          totalRecords: response?.data?.data?.totalRecords,
        });
      } else throw new Error("Unable to retrieve category list");
    } catch (error) {
      showToast.error(
        (error as Error)?.message || "Unable to retrieve filter list"
      );
    }
  }

  useEffect(() => {
    if (accountSettingModal.isOpen) {
      setFilters([])
      setFilterPagination({
        page: 1,
        totalRecords: 0
      })
      getFilter()
    }
  }, [accountSettingModal.isOpen, selectedFilters?.forumType]);

  const handleClick = async () => {
    selectedLocalFilters && dispatch(setSelectedFilter(selectedLocalFilters))
    accountSettingModal.closeModal()
  };

  const onFilterSelect = (item: TagCategoryType, isSelected: boolean) => {
    const values = isSelected
      ? selectedLocalFilters?.filters?.filter((i) => i._id !== item._id) ??
      []
      : [...(selectedLocalFilters?.filters ?? []), item];
    setSelectedLocalFilters((preState) => {
      return {
        ...preState,
        filters: values,
      };
    });
  };

  const onLoadMore = () => getFilter(filterPagination.page + 1)

  useEffect(() => {
    setSelectedLocalFilters(selectedFilters);
  }, [selectedFilters]);
  return (
    <Modal
      headerTitle={`Sort by filter`}
      visible={accountSettingModal.isOpen}
      onClose={accountSettingModal.closeModal}
      modalClassName="!w-2/6"
      showFooter={false}
    >
      <div className="flex gap-4 flex-col">
        <div className="text-eduBlack flex gap-2 flex-col">
          <span className="font-headers font-medium text-xl text-eduBlack mb-4">
            Select Filters
          </span>
          <InfiniteScroll
            hasMoreData={filterPagination?.totalRecords > filters?.length}
            callBack={onLoadMore}
            className={`flex flex-col gap-3 max-h-[300px] !overflow-y-auto}`}
            showLoading={filtersLoading}
          >
            {filters?.length==0 && <span className="self-center">No Filter Available For {selectedFilters?.forumType} Forum</span>}
            {filters?.map((filter) => {
              let isSelected =
                selectedLocalFilters?.filters?.some(
                  (i) => i._id === filter._id
                ) || false;
              return (
                <div>
                  <li
                    key={filter._id}
                    className="animate-fade-in-down text-sm font-normal text-eduBlack flex gap-2"
                    onClick={() => {
                      onFilterSelect(filter, isSelected);
                    }}
                  >
                    <Checkbox
                      id={filter?._id}
                      name={"filter"}
                      checked={isSelected}
                      onChange={() => {
                        onFilterSelect(filter, isSelected);
                      }}
                    />
                    <label id={filter?._id}>{filter.name}</label>
                  </li>
                </div>
              );
            })}
          </InfiniteScroll>
          <div>
            <div className="flex justify-center ">
              <button
                className={`bg-eduBlack text-white border-eduBlack border-[1.5px] my-3 rounded-[10px] py-1 w-[150px] m-auto text-[16px]  font-body transition-colors duration-500 disabled:opacity-70 `}
                onClick={handleClick}
                // disabled={settingSubmitLoader}
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
