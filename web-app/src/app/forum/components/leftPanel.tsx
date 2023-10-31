import { Loader } from "@/app/signup/commonBlocks";
import { axiosGet } from "@/axios/config";
import { Button } from "@/components/button";
import { LoadMore } from "@/components/loadMore";
import { showToast } from "@/components/toast";
import {
  getSelectedForumFilters,
  setSelectedFilter,
} from "@/redux/ducks/forum.duck";
import { responseCodes } from "@/util/constant";
import { areArraysEqual } from "@/util/helpers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrendingIcon from "../../../assets/icons/trending.svg";
import NewIcon from "../../../assets/icons/new.svg";
import ThumbsUpIcon from "../../../assets/icons/thumb_up.svg";
import Image from "next/image";
import { Checkbox } from "@/components/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "@/components/infiniteScroll";

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

  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<TagCategoryType[]>([]);
  const [categoryPagination, setCategoryPagination] = useState<PageDataState>({
    page: 1,
    totalRecords: 0,
  });
  const [selectedLocalFilters, setSelectedLocalFilters] =
    useState<FilterOptionsState | null>(null);
  const [showMoreCatagories, setShowMoreCatagories] = useState<boolean>(true);
  const isCategoriesSame: boolean = areArraysEqual(
    selectedFilters?.categories?.map((i) => i._id) ?? [],
    selectedLocalFilters?.categories?.map((i) => i?._id) ?? []
  );
  const isUpdated: boolean =
    !isCategoriesSame || selectedLocalFilters?.sortBy != null;

  console.log({
    isCategoriesSame,
    selectedFilters,
    selectedLocalFilters,
  });

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
        },
      });
      if (response.status === responseCodes.SUCCESS) {
        setIsCategoriesLoading(false);
        setCategoryList(categoryList.concat(response?.data?.data?.records));
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
      ? selectedLocalFilters?.categories?.filter((i) => i.name !== item.name) ??
        []
      : [...(selectedLocalFilters?.categories ?? []), item];
    setSelectedLocalFilters((preState) => {
      return {
        ...preState,
        categories: values,
      };
    });
  };

  const onLoadMore = () => fetchCategories(categoryPagination.page + 1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedLocalFilters(selectedFilters);
  }, [selectedFilters]);

  return (
    <div className="flex flex-col h-full flex-auto">
      <span className="text-eduBlack text-2xl font-medium font-headers">
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
            className="font-body flex-auto items-center flex gap-2 text-[16px] text-eduBlack"
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
      <hr className="my-4 h-[3px] bg-eduBlack border-0" />
      <span className="text-eduBlack text-[22px] font-bold font-headers">
        Category
      </span>
      {/* {console.log(categoryList.length)} */}
      <InfiniteScroll
        hasMoreData={categoryPagination?.totalRecords > categoryList?.length}
        callBack={onLoadMore}
        className={`flex flex-col gap-3 h-full overflow-hidden ${
          showMoreCatagories ? "max-h-[20vh] !overflow-y-hidden" : "max-h-max"
        }`}
      >
        {categoryList?.map((item) => {
          let isSelected =
            selectedLocalFilters?.categories?.some(
              (i) => i.name === item.name
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
      <hr className="my-2 h-[3px] bg-eduBlack border-0" />
      <div className="flex-1 flex flex-col justify-end">
        <Button
          className="rounded-md w-auto px-4 font-medium text-sm"
          label="Sort by Filter"
          type="button"
          onClick={() =>
            selectedLocalFilters &&
            dispatch(setSelectedFilter(selectedLocalFilters))
          }
          disabled={!isUpdated}
        />
      </div>
    </div>
  );
};
