import { Button } from "@/components/button";
import { LoadMore } from "@/components/loadMore";
import { areArraysEqual } from "@/util/helpers";
import React, { SetStateAction } from "react";

interface Props {
  sortingOptions: { value: string; label: string }[];
  categoryList: TagCategoryType[];
  selectedFilters: FilterOptionsState | undefined;
  handleFilters: (
    type: keyof FilterOptionsState,
    value: string | string[] | TagCategoryType[]
  ) => void;
  onLoadMore: (isIntial: boolean) => void;
  categoryPagination: PageDataState;
  setSelectedCategories: React.Dispatch<SetStateAction<TagCategoryType[]>>;
  selectedCategories: TagCategoryType[];
}

export const LeftPanel = ({
  sortingOptions,
  categoryList,
  selectedFilters,
  handleFilters,
  onLoadMore,
  categoryPagination,
  setSelectedCategories,
  selectedCategories,
}: Props) => {
  const isCategoriesSame = areArraysEqual(
    selectedFilters?.categories?.map((i) => i._id) ?? [],
    selectedCategories.map((i) => i?._id)
  );

  return (
    <div className="bg-eduLightGray flex flex-col h-full rounded-md py-[30px] px-[30px] w-1/5 justify-start gap-3">
      <span className="text-eduBlack text-[22px] font-bold font-headers">Sort By</span>
      <ul className="flex flex-col gap-3">
        {sortingOptions?.map((item) => (
          <li
            key={item.value}
            onClick={() =>
              selectedFilters?.sortBy !== item.value &&
              handleFilters("sortBy", item.value)
            }
            className={`${
              item.value === selectedFilters?.sortBy
                ? "decoration-primary"
                : "decoration-transparent"
            } duration-300 font-body text-[16px] ease-in-out transition-colors decoration-2 underline underline-offset-4 text-eduBlack`}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <hr className="my-4 h-[3px] bg-eduBlack border-0" />
      <span className="text-eduBlack text-[22px] font-bold font-headers">Category</span>
      <ul className="flex flex-col gap-4 h-full overflow-y-auto">
        {categoryList?.map((item) => {
          let isSelected = selectedCategories?.some(
            (i) => i.name === item.name
          );
          return (
            <li
              key={item._id}
              className={`${
                isSelected ? "decoration-primary" : "decoration-transparent"
              } underline duration-300 decoration-2 ease-in-out animate-fade-in-down touch-pinch-zoom text-sm transition-colors text-eduBlack underline-offset-4`}
              onClick={() => {
                const values = isSelected
                  ? selectedCategories?.filter((i) => i.name !== item.name) ??
                    []
                  : [...(selectedCategories ?? []), item];
                setSelectedCategories(values);
              }}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
      {categoryPagination?.totalRecords > categoryList?.length && (
        <LoadMore isLoading={false} onClick={() => onLoadMore(false)} />
      )}
      <hr className="my-4 h-[3px] bg-eduBlack border-0" />
      <Button
        className="border m-0 self-center rounded-md p-2 hover:bg-primary w-auto px-4 font-medium text-sm text-primary border-primary bg-primary/10 hover:text-white transition-all ease-in-out duration-300"
        label="Sort by Filter"
        type="button"
        onClick={() =>
          !isCategoriesSame && handleFilters("categories", selectedCategories)
        }
        disabled={isCategoriesSame}
      />
    </div>
  );
};
