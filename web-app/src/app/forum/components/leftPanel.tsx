import { Button } from "@/components/button";
import { LoadMore } from "@/components/loadMore";
import { areArraysEqual } from "@/util/helpers";
import React, { SetStateAction } from "react";

interface Props {
  sortingOptions: { value: string; label: string }[];
  categoryList: any[];
  selectedFilters: FilterOptionsState | undefined;
  handleFilters: (
    type: keyof FilterOptionsState,
    value: string | string[]
  ) => void;
  onLoadMore: (isIntial: boolean) => void;
  categoryPagination: PageDataState;
  setSelectedCategories: React.Dispatch<SetStateAction<any>>;
  selectedCategories: any;
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
    selectedCategories.map((i: any) => i._id)
  );

  return (
    <div className="bg-primary-dark flex flex-col h-full rounded-md p-4 px-6 w-1/5 justify-start gap-2">
      <span className="text-white text-2xl font-bold font-serif">Sort By</span>
      <ul className="flex flex-col gap-2">
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
            } duration-300 text-sm ease-in-out transition-colors decoration-2 underline underline-offset-4 text-white`}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <span className="text-white text-2xl font-bold font-serif">Category</span>
      <ul className="flex flex-col gap-4 h-full overflow-y-auto">
        {categoryList?.map((item: any) => {
          let isSelected = selectedCategories?.some(
            (i: any) => i.name === item.name
          );
          return (
            <li
              key={item._id}
              className={`${
                isSelected ? "decoration-primary" : "decoration-transparent"
              } underline duration-300 decoration-2 ease-in-out animate-fade-in-down touch-pinch-zoom text-sm transition-colors text-white underline-offset-4`}
              onClick={() => {
                const values = isSelected
                  ? selectedCategories?.filter(
                      (i: any) => i.name !== item.name
                    ) ?? []
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
      <hr className="my-4" />
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
