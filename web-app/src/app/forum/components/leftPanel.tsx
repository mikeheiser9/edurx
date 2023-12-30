import { axiosGet } from "@/axios/config";
import { Button } from "@/components/button";
import { showToast } from "@/components/toast";
import {
  getSelectedForumFilters,
  setSelectedFilter,
} from "@/redux/ducks/forum.duck";
import { responseCodes } from "@/util/constant";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrendingIcon from "../../../assets/icons/trending.svg";
import NewIcon from "../../../assets/icons/new.svg";
import ThumbsUpIcon from "../../../assets/icons/thumb_up.svg";
import Image from "next/image";
import { Checkbox } from "@/components/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "@/components/infiniteScroll";
import { useModal } from "@/hooks";
import { FilterSetting } from "./filterSelection";
import { ProfileDialog } from "@/app/hub/components/profileDialog";
import {
  removeToken,
  removeUserDetail,
  selectUserDetail,
} from "@/redux/ducks/user.duck";
import { setModalState } from "@/redux/ducks/modal.duck";
import { AccountSetting } from "@/app/hub/components/accountSetting";

const sortingOptions: { value: string; label: string; icon: any }[] = [
  {
    label: "Newest",
    value: "newest",
    icon: NewIcon,
  },
  {
    label: "Most Popular",
    value: "popular",
    icon: ThumbsUpIcon,
  },
  {
    label: "Trending",
    value: "trending",
    icon: TrendingIcon,
  },
];

export const LeftPanel = () => {
  const dispatch = useDispatch();
  const selectedFilters: FilterOptionsState = useSelector(
    getSelectedForumFilters
  );
  const accountSettingModal = useModal();
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<TagCategoryType[]>([]);
  const [categoryPagination, setCategoryPagination] = useState<PageDataState>({
    page: 1,
    totalRecords: 0,
  });
  const [selectedLocalFilters, setSelectedLocalFilters] =
    useState<FilterOptionsState | null>(null);
  const [showMoreCatagories, setShowMoreCatagories] = useState<boolean>(true);
  const filterSetting = useModal();
  const profileModal = useModal();
  const loggedInUser = useSelector(selectUserDetail);
  const handleFilters = (
    type: keyof FilterOptionsState,
    value: string | any[]
  ) => {
    setSelectedLocalFilters((preState) => {
      return {
        ...preState,
        [type]: selectedLocalFilters?.[type] === value ? null : value,
      };
    });
    dispatch(
      setSelectedFilter({
        ...selectedLocalFilters,
        [type]: selectedLocalFilters?.[type] === value ? null : value,
      })
    );
  };
  const fetchCategories = async (page: number = 1) => {
    try {
      setIsCategoriesLoading(true);
      const response = await axiosGet("/post/category/search", {
        params: {
          name: "",
          type: "category",
          limit: 10,
          page,
          forumType: selectedFilters?.forumType,
        },
      });
      if (response.status === responseCodes.SUCCESS) {
        setIsCategoriesLoading(false);
        setCategoryList((prevStates) => [
          ...prevStates,
          ...response?.data?.data?.records,
        ]);
        setCategoryPagination({
          page: response?.data?.data?.currentPage,
          totalRecords: response?.data?.data?.totalRecords,
        });
      } else throw new Error("Unable to retrieve category list");
    } catch (error) {
      showToast.error(
        (error as Error)?.message || "Unable to retrieve category list"
      );
      console.error("Error processing category list", error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const onCategorySelect = (item: TagCategoryType, isSelected: boolean) => {
    const values = isSelected
      ? selectedLocalFilters?.categories?.filter((i) => i._id !== item._id) ??
        []
      : [...(selectedLocalFilters?.categories ?? []), item];
    setSelectedLocalFilters((preState) => {
      return {
        ...preState,
        categories: values,
      };
    });
    dispatch(
      setSelectedFilter({ ...selectedLocalFilters, categories: values })
    );
  };

  const onLoadMore = () => fetchCategories(categoryPagination.page + 1);

  useEffect(() => {
    setCategoryPagination({
      page: 1,
      totalRecords: 0,
    });
    setCategoryList([]);
    setShowMoreCatagories(true);
    fetchCategories();
  }, [selectedFilters?.forumType]);

  useEffect(() => {
    setSelectedLocalFilters(selectedFilters);
  }, [selectedFilters]);

  return (
    <>
      <AccountSetting
        userData={loggedInUser}
        accountSettingModal={accountSettingModal}
      />
      <FilterSetting accountSettingModal={filterSetting} />
      <ProfileDialog loggedInUser={loggedInUser} profileModal={profileModal} />
      <div className="flex flex-col h-full flex-auto relative">
      <span className="hidden ipad-under:flex items-center justify-center ipad-under:absolute ipad-under:top-0 ipad-under:right-0 ipad-under:w-6 ipad-under:h-6 ">
            <FontAwesomeIcon
                className="text-eduLightBlue cursor-pointer text-xl"
                icon={faChevronLeft}
              />
            </span>
        <span className="text-eduBlack text-[22px] font-medium font-headers mb-[20px]">
          Sort By
        </span>
        <ul className="flex flex-col gap-3">
          {sortingOptions?.map((item) => (
            <li
              key={item.value}
              // onClick={() =>
              //   selectedFilters?.sortBy !== item.value &&
              //   handleFilters("sortBy", item.value)
              // }
              className="font-body flex-auto items-center flex gap-2 text-[16px] text-eduBlack "
            >
              <Checkbox
                id={item?.value}
                name={item?.value}
                checked={item.value === selectedLocalFilters?.sortBy}
                onChange={() => handleFilters("sortBy", item.value)}
              />
              {item?.icon && (
                <span className="w-3 flex justify-center items-center h-3">
                  <Image
                    src={item?.icon}
                    height={50}
                    width={50}
                    alt={item?.value}
                  />
                </span>
              )}
              <label htmlFor={item?.value}>{item.label}</label>
            </li>
          ))}
        </ul>
        <hr className="my-4 h-[1px] min-h-[1px] bg-eduBlack/60 border-0" />
        <span className="text-eduBlack text-[22px] font-headers mb-[20px] font-medium">
          Category
        </span>
        <InfiniteScroll
          hasMoreData={categoryPagination?.totalRecords > categoryList?.length}
          callBack={onLoadMore}
          className={`flex flex-col gap-3 h-full overflow-hidden ${
            showMoreCatagories ? "max-h-[20vh] !overflow-y-hidden" : "max-h-max"
          }`}
          showLoading={isCategoriesLoading}
        >
          {categoryList?.map((item) => {
            let isSelected =
              selectedLocalFilters?.categories?.some(
                (i) => i._id === item._id
              ) || false;
            return (
              <li
                key={item._id}
                className="animate-fade-in-down text-sm font-normal text-eduBlack flex gap-2"
                onClick={() => onCategorySelect(item, isSelected)}
              >
                <Checkbox
                  id={item?._id}
                  name={item?.name}
                  checked={isSelected}
                  onChange={() => onCategorySelect(item, isSelected)}
                />
                <label id={item?._id}>{item.name}</label>
              </li>
            );
          })}
        </InfiniteScroll>

        {categoryList?.length > 5 && (
          <div
            onClick={() => {
              setShowMoreCatagories(!showMoreCatagories);
              if (categoryPagination?.totalRecords > categoryList?.length) {
                onLoadMore();
              }
            }}
            className="text-eduBlack mt-2 flex text-xs justify-center items-center cursor-pointer animate-fade-in-down flex-col"
          >
            <span>{showMoreCatagories ? "More" : "Less"}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`ease-in-out duration-500 ${
                showMoreCatagories ? "rotate-0" : "rotate-180"
              }`}
            />
          </div>
        )}
        <hr className="my-2 h-[1px] min-h-[1px] bg-eduBlack/60 border-0" />
        <div className="flex-1 flex flex-col justify-end">
          <Button
            className="rounded-md ml-0 px-4 font-medium text-sm"
            label="Sort by Filter"
            type="button"
            onClick={() => {
              filterSetting.openModal();
            }}
            // disabled={!isUpdated}
          />
        </div>
        <hr className="my-2 h-[1px] min-h-[1px] bg-eduBlack/60 border-0" />
        <div className="flex flex-col gap-2 text-eduBlack text-base pt-2 ">
          <span
            className="cursor-pointer"
            onClick={() => {
              profileModal.openModal();
            }}
          >
            Profile
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              dispatch(setModalState({ isOpen: true, type: "viewDraftModal" }));
            }}
          >
            My Drafts
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              dispatch(removeToken());
              dispatch(removeUserDetail());
            }}
          >
            Sign Out
          </span>
        </div>
      </div>
    </>
  );
};
