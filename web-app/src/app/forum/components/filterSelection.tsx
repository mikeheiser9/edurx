import { Modal } from "@/components/modal";
import { showToast } from "@/components/toast";
import { getFilters } from "@/service/post.service";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@/components/checkbox";
import {
  getSelectedForumFilters,
  setSelectedFilter,
} from "@/redux/ducks/forum.duck";
interface Props {
  accountSettingModal: UseModalType;
}

interface filterType {
  _id: string;
  type: "filter";
  name: string;
}
export const FilterSetting = ({ accountSettingModal }: Props) => {
  const dispatch=useDispatch()
  const selectedFilters: FilterOptionsState = useSelector(
    getSelectedForumFilters
  );
  const [selectedLocalFilters, setSelectedLocalFilters] =
    useState<FilterOptionsState | null>(null);
  const [filters, setFilters] = useState<filterType[]>([]);
  useEffect(() => {
    if (accountSettingModal.isOpen) {
      getFilters()
        .then((response) => {
          setFilters(response.data?.data);
        })
        .catch((error) => {
          showToast.error(
            (error as Error).message || "Unable to retrieve filters"
          );
        });
    }
  }, [accountSettingModal.isOpen]);

  const handleClick = async () => {
    selectedLocalFilters && dispatch(setSelectedFilter(selectedLocalFilters))
    accountSettingModal.closeModal()
  };

  const onFilterSelect = (item: TagCategoryType, isSelected: boolean) => {
    const values = isSelected
      ? selectedLocalFilters?.filters?.filter((i) => i.name !== item.name) ??
        []
      : [...(selectedLocalFilters?.filters ?? []), item];
    setSelectedLocalFilters((preState) => {
      return {
        ...preState,
        filters: values,
      };
    });
  };

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

          {filters?.map((filter) => {
            let isSelected =
              selectedLocalFilters?.filters?.some(
                (i) => i.name === filter.name
              ) || false;
            return (
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
            );
          })}
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
