import {
  Formik,
  Form,
  FormikHelpers,
  FormikErrors,
  FormikTouched,
  FieldArray,
} from "formik";
import InputField from "@/components/input";
import { Modal } from "@/components/modal";
import { Select } from "@/components/select";
import { TabMenu } from "@/components/tabMenu";
import { useDebounce } from "@/hooks";
import {
  faEye,
  faGripVertical,
  faLock,
  faPlusCircle,
  faPoll,
} from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ModalFooter, ModalHeader } from "./sections";
import { TextEditor } from "./rich-editor";
import { Chip } from "@/components/chip";
import { axiosGet } from "@/axios/config";
import { LoadMore } from "@/components/loadMore";
import { Loader } from "../../signup/commonBlocks";
import {
  boldOnSearch,
  getAllowedForumAccessBasedOnRoleAndNpiDesignation,
} from "@/util/helpers";
import { ToggleSwitch } from "@/components/toggleSwitch";
import { postCreationValidation } from "@/util/validations/post";
import { responseCodes } from "@/util/constant";
import { addNewPost, updatePostById } from "@/service/post.service";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDraftCount,
  selectUserDetail,
  setDraftCount,
} from "@/redux/ducks/user.duck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showToast } from "@/components/toast";
import { getUserDraftCount } from "@/service/user.service";
import { uniqBy } from "lodash";
import { Button } from "@/components/button";

interface filterCategoryInput {
  category?: string | boolean;
  filter?: string | boolean;
}

interface PageData {
  page: number;
  totalRecords: number;
}

interface CurrentPageRecords {
  category: PageData;
  filter: PageData;
}

interface filterCategoryList {
  categories: [];
  filters: [];
}

export interface formikInitialValueType {
  forumType: ForumTypes;
  postType: string;
  title: string;
  categories: never[];
  filters: never[];
  isPrivate: boolean;
  content: string;
  options: string[];
  votingLength: number;
}

export const AddPost = ({
  addPostModal,
  fetchPosts,
  postDetails,
  getDrafts,
  mode = "New",
}: {
  addPostModal: UseModalType;
  fetchPosts?: () => Promise<void>;
  postDetails?: CreatePostFormikInterface & { id: string };
  getDrafts?: ((page?: number | undefined) => Promise<void>) | undefined;
  mode?: PostModeType;
}) => {
  const loggedInUser = useSelector(selectUserDetail);
  const currentDraftCount = useSelector(selectDraftCount);
  const [isLoading, setIsLoading] = useState<filterCategoryInput>({
    filter: false,
    category: false,
  });
  const [searchText, setSearchText] = useState<{
    category: string;
    filter: string;
  }>({
    category: "",
    filter: "",
  });
  const [filterCategoryList, setFilterCategoryList] = useState<{
    categories: [];
    filters: [];
  }>({ categories: [], filters: [] });
  const [currentPage, setCurrentPage] = useState<CurrentPageRecords>({
    category: {
      page: 1,
      totalRecords: 0,
    },
    filter: {
      page: 1,
      totalRecords: 0,
    },
  });

  const [selectedList, setSelectedList] = useState<filterCategoryList>({
    categories: [],
    filters: [],
  });
  const [forumSelected, setForumSelected] = useState<
    ForumTypes | "Choose forum"
  >("Choose forum");
  const dispatch = useDispatch();

  let tempDropdownOptions = getAllowedForumAccessBasedOnRoleAndNpiDesignation(
    loggedInUser?.role,
    loggedInUser?.npi_designation
  )
    .map((item) => {
      return {
        value: item,
        label: item,
      };
    })
    .filter((item) => item.label != "All Forums");
  let dropdownOptions = [
    { label: "Choose forum", value: "Choose forum" },
    ...tempDropdownOptions,
  ];
  const [intialFormikValues, setIntialFormikValues] = useState<
    formikInitialValueType | any
  >({
    forumType: dropdownOptions[0].value as ForumTypes,
    postType: "post",
    title: "",
    categories: [],
    filters: [],
    isPrivate: false,
    content: "",
    options: ["", ""],
    votingLength: 3,
  });
  const debouncedCategory = useDebounce(searchText.category, 1000);
  const debouncedFilter = useDebounce(searchText.filter, 1000);
  const onSearch = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSearchText((pre) => {
        return {
          ...pre,
          [name]: value,
        };
      });
    },
    []
  );

  const searchAPI = useCallback(
    async (
      type: keyof filterCategoryInput,
      value: string,
      isIntial?: boolean,
      forumType?: ForumTypes
    ) => {
      try {
        setIsLoading((preState) => {
          return {
            ...preState,
            [type]: true,
          };
        });
        const response = await axiosGet("/post/category/search", {
          params: {
            name: value,
            type: type,
            limit: 5,
            page: isIntial ? 1 : currentPage?.[type]?.page + 1,
            forumType:
              forumSelected == "Choose forum"
                ? forumType
                  ? forumType
                  : intialFormikValues.forumType
                : forumSelected,
          },
        });
        if (response.status === responseCodes.SUCCESS) {
          setIsLoading((preState) => {
            return {
              ...preState,
              [type]: false,
            };
          });
          let key: keyof typeof filterCategoryList =
            type === "category" ? "categories" : "filters";

          setFilterCategoryList((preState) => {
            return {
              ...preState,
              [key]: uniqBy(
                [...preState[key], ...response?.data?.data?.records],
                (obj) => obj._id
              ),
            };
          });
          setCurrentPage((preState: CurrentPageRecords) => {
            return {
              ...preState,
              [type]: {
                page: response?.data?.data?.currentPage,
                totalRecords: response?.data?.data?.totalRecords || 0,
              },
            };
          });
        } else throw new Error("Unable to find tag category");
      } catch (error) {
        setIsLoading((preState) => {
          return {
            ...preState,
            [type]: false,
          };
        });
        showToast.error(
          (error as Error)?.message || "Unable to perform search"
        );
        console.error("Error occurred during search:", error);
      }
    },
    [currentPage, searchText, filterCategoryList, forumSelected]
  );

  const onChipSelect = (
    type: keyof filterCategoryList,
    item: TagCategoryType
  ) => {
    setSelectedList((preState) => {
      return {
        ...preState,
        [type]: [...preState?.[type], item?._id],
      };
    });
  };

  const onChipeDelete = (
    type: keyof filterCategoryList,
    item: TagCategoryType
  ) => {
    setSelectedList((preState) => {
      return {
        ...preState,
        [type]: selectedList?.[type]?.filter(
          (_id: string) => _id !== item?._id
        ),
      };
    });
  };

  const ChipsTemplate = ({
    type,
    actions,
    values,
  }: {
    type: "categories" | "filters";
    actions: FormikHelpers<CreatePostFormikInterface>;
    values: CreatePostFormikInterface;
  }) => {
    return (
      <>
        {isLoading?.[type === "categories" ? "category" : "filter"] ? (
          <div className="flex flex-auto justify-center h-20">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 flex-auto">
            {filterCategoryList?.[type]?.length ? (
              filterCategoryList?.[type]?.map((item: TagCategoryType) => (
                <Chip
                  key={item?._id}
                  label={
                    boldOnSearch(
                      item?.name,
                      searchText?.[
                        type === "categories" ? "category" : "filter"
                      ]
                    ) as string
                  }
                  className={`${
                    type === "categories"
                      ? "bg-transparent border border-eduLightBlue "
                      : "!bg-eduDarkGray"
                  }  text-xs px-2 leading-6 rounded-md capitalize`}
                  onSelect={() => onChipSelect(type, item)}
                  onClear={() => onChipeDelete(type, item)}
                  isSelected={selectedList?.[type]?.some(
                    (_id: string) => _id === item?._id
                  )}
                />
              ))
            ) : (
              <span className={`text-eduBlack`}>
                {(values as any).forumType == "Choose forum"
                  ? `choose forum type to view ${type}`
                  : `No ${type} found`}
              </span>
            )}
          </div>
        )}
      </>
    );
  };

  const EditPostFooter = () => (
    <div className="flex flex-col gap-2 py-3 bg-primary-dark">
      <div className="flex justify-center gap-4">
        <Button
          label="Cancel"
          className="!m-0 !bg-eduBlack text-white"
          type="button"
          onClick={addPostModal?.closeModal}
        />
        <Button
          label="Update"
          type="submit"
          className={`!m-0 cursor-not-allowed`}
        />
      </div>
    </div>
  );

  const onSubmit = async (
    values: CreatePostFormikInterface,
    actions: FormikHelpers<CreatePostFormikInterface>
  ) => {
    let isError = false;
    const categoryLength = selectedList.categories.length;
    if (categoryLength > 2) {
      actions.setFieldError(
        "categories",
        "category field is required and maximum 2 is allowed"
      );
      isError = true;
    }
    if (selectedList.filters.length > 4) {
      actions.setFieldError(
        "filters",
        "filter field is required and maximum 4 is allowed"
      );
      isError = true;
    }
    if (
      (values as CreatePostFormikInterface & { postStatus: string })
        .postStatus == "published"
    ) {
      if (categoryLength == 0) {
        actions.setFieldError(
          "categories",
          "category field is required and maximum 2 is allowed"
        );
        isError = true;
      }
      if (values.content.replace(/<\/?[^>]+(>|$)/g, "").length == 0) {
        actions.setFieldError("content", "This field is required");
        isError = true;
      }
    }
    if (
      values.postType == "poll" &&
      values.options.length > new Set(values.options).size
    ) {
      actions.setFieldError("options", "All options must be unique");
      isError = true;
    }
    if (isError) {
      return;
    }
    const payload = {
      userId: loggedInUser?._id,
      ...values,
      postType: values.postType || "post",
      ...selectedList,
      postStatus:
        (values as any)?.postStatus || mode == "Edit" ? "published" : "",
    };

    // when editing the post from the draft flow
    if (postDetails) {
      const updateApiRes = await updatePostById(postDetails.id, payload);
      if (updateApiRes?.status === responseCodes.SUCCESS) {
        if (
          (values as CreatePostFormikInterface & { postStatus: string })
            .postStatus == "published"
        ) {
          dispatch(setDraftCount(currentDraftCount - 1));
        }
        getDrafts?.(1);
        addPostModal?.closeModal();
      }
    } else {
      await addNewPost(payload)
        .then(async (response) => {
          let message = response?.data?.message;
          if (response?.status === responseCodes.SUCCESS) {
            if (
              (values as CreatePostFormikInterface & { postStatus: string })
                .postStatus == "draft"
            ) {
              const res = await getUserDraftCount();
              if (res?.data?.response_type == "Success") {
                dispatch(setDraftCount(res?.data?.data));
              }
            }
            addPostModal?.closeModal();
            fetchPosts?.();
          } else throw new Error(message || "Something went wrong");
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  };

  useEffect(() => {
    if (forumSelected != "Choose forum") {
      searchAPI("category", debouncedCategory, true);
    } else {
      setFilterCategoryList((preState) => {
        return {
          ...preState,
          categories: [],
        };
      });
      setCurrentPage((preState: CurrentPageRecords) => {
        return {
          ...preState,
          category: {
            page: 1,
            totalRecords: 0,
          },
        };
      });
    }
  }, [debouncedCategory, forumSelected]);

  useEffect(() => {
    if (forumSelected != "Choose forum") {
      searchAPI("filter", debouncedFilter, true);
    } else {
      setFilterCategoryList((preState) => {
        return {
          ...preState,
          filters: [],
        };
      });
      setCurrentPage((preState: CurrentPageRecords) => {
        return {
          ...preState,
          filter: {
            page: 1,
            totalRecords: 0,
          },
        };
      });
    }
  }, [debouncedFilter, forumSelected]);

  useEffect(() => {
    setSelectedList({
      categories: [],
      filters: [],
    });
    setFilterCategoryList({
      categories: [],
      filters: [],
    });
  }, [forumSelected]);

  useEffect(() => {
    // setup which run open in the Edit mode
    if (postDetails) {
      const {
        forumType,
        isPrivate,
        votingLength,
        title,
        content,
        postType,
        categories,
        filters,
        options,
      } = postDetails;

      setIntialFormikValues({
        categories: [],
        content: content,
        filters: [],
        forumType: forumType,
        options: options.length == 0 ? ["", ""] : options,
        isPrivate: isPrivate,
        postType: postType,
        title: title,
        votingLength: votingLength,
      } as formikInitialValueType);
      const categorySelected: string[] = categories?.map((category: any) => {
        return category?._id;
      });
      const filterSelected: string[] = filters?.map((filter: any) => {
        return filter?._id;
      });
      setSelectedList((preState: any) => {
        return {
          ...preState,
          categories: categorySelected,
          filters: filterSelected,
        };
      });
      setFilterCategoryList((preState: any) => {
        return {
          ...preState,
          categories: categories,
          filters: filters,
        };
      });
      searchAPI("category", debouncedCategory, true, forumType);
      searchAPI("filter", debouncedFilter, true, forumType);
    }
  }, [postDetails?.id]);

  const shouldDisable = (params: {
    errors: FormikErrors<CreatePostFormikInterface>;
    touched: FormikTouched<CreatePostFormikInterface>;
    categoryFilter: filterCategoryList;
  }) => {
    const {
      content: contentError,
      forumType: forumTypeError,
      title: titleError,
      categories: categoriesError,
      filters: filtersError,
    } = params.errors;
    const { categoryFilter } = params;
    const {
      content: contentTouched,
      forumType: forumTypeTouched,
      title: titleTouched,
      categories: categoriesTouched,
      filters: filtersTouched,
    } = params.touched;
    if ((titleError && titleTouched) || (forumTypeError && forumTypeTouched)) {
      return true;
    } else if (contentError && contentTouched) {
      return true;
    } else if (
      categoriesError &&
      categoriesTouched &&
      (categoryFilter.categories.length == 0 ||
        categoryFilter.categories.length > 2)
    ) {
      return true;
    } else if (
      filtersError &&
      filtersTouched &&
      (categoryFilter.filters.length == 0 || categoryFilter.filters.length > 4)
    ) {
      return true;
    }
    return false;
  };

  return (
    <Formik
      validationSchema={postCreationValidation}
      initialValues={intialFormikValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, ...actions }) => (
        <Modal
          visible={addPostModal.isOpen}
          onClose={addPostModal.closeModal}
          customHeader={
            <ModalHeader
              onClose={addPostModal.closeModal}
              mode={postDetails?.id ? "Edit" : "New"}
            />
          }
          showFooter={false}
          modalClassName="!rounded-xl"
          modalBodyClassName="relative p-4 overflow-y-auto font-body overflow-hidden bg-white"
        >
          <Form>
            <div className="flex flex-col gap-4 p-2 ">
              <div className="flex justify-between">
                <div className="flex">
                  <Select
                    defaultValue="Choose Group"
                    options={dropdownOptions}
                    value={values?.forumType}
                    onSelect={(e) => {
                      actions.setFieldValue("forumType", e?.value);
                      setForumSelected(e?.value);
                    }}
                    wrapperClass="!w-[12rem] !text-xs"
                    optionClass="text-xs"
                  />
                  {actions?.touched.forumType && actions.errors.forumType ? (
                    <span className="ml-1 text-xs font-body mt-1 first-letter:capitalize flex-shrink-0 opacity-50 text-[#FF0000] font-[500]">
                      forum type is a required field
                    </span>
                  ) : null}
                </div>
                <ToggleSwitch
                  name="isPrivate"
                  off={{
                    icon: faEye,
                    label: "public",
                  }}
                  on={{
                    icon: faLock,
                    label: "private",
                  }}
                />
              </div>
              <TabMenu
                options={[
                  {
                    component() {
                      return (
                        <>
                          <InputField name="title" placeholder="Title" />
                          <TextEditor
                            value={values?.content}
                            setFieldValue={actions?.setFieldValue}
                            error={actions.errors.content}
                            isTouched={actions.touched.content}
                          />
                        </>
                      );
                    },
                    label: "Post",
                    icon: faPlusCircle,
                  },
                  {
                    component() {
                      return (
                        <div>
                          <InputField
                            name="title"
                            placeholder="Title"
                            maxLength={130}
                          />
                          <TextEditor
                            value={values.content}
                            setFieldValue={actions.setFieldValue}
                            error={actions.errors.content}
                            isTouched={actions.touched.content}
                          />
                          {actions?.touched.options &&
                          actions.errors.options ? (
                            <span className="ml-1 text-xs font-body mt-1 first-letter:capitalize flex-shrink-0 opacity-50 text-[#FF0000] font-[500]">
                              {actions.errors.options}
                            </span>
                          ) : null}
                          <FieldArray
                            name="options"
                            render={(arrayHelpers) => (
                              <div>
                                {values.options && values.options.length > 0 ? (
                                  <>
                                    <div className="gap-2 grid grid-cols-2">
                                      {values.options.map((option, index) => (
                                        <div
                                          className="flex animate-scale-in gap-2"
                                          key={index}
                                        >
                                          <FontAwesomeIcon
                                            size="lg"
                                            icon={faGripVertical}
                                            className="self-center text-eduBlack/60"
                                          />
                                          <InputField
                                            name={`options.${index}`}
                                            placeholder={`Option ${index + 1}`}
                                            type="text"
                                            className="w-full"
                                            maxLength={80}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex flex-auto items-center py-2 justify-between gap-2">
                                      <div className="gap-2 flex items-center">
                                        {values.options.length < 8 && (
                                          <span
                                            onClick={() =>
                                              arrayHelpers.insert(
                                                values.options.length + 1,
                                                ""
                                              )
                                            }
                                            className="text-white animate-scale-in inline-block mt-2 bg-eduLightBlue p-2 py-1 rounded-md text-xs cursor-pointer"
                                          >
                                            Add Option
                                          </span>
                                        )}
                                        {values.options.length > 2 && (
                                          <span
                                            onClick={() =>
                                              arrayHelpers.remove(
                                                values.options.length - 1
                                              )
                                            }
                                            className="animate-scale-in inline-block mt-2 bg-eduBlack text-white p-2 py-1 rounded-md text-xs cursor-pointer"
                                          >
                                            Remove
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-white text-xs flex gap-1 items-center">
                                        <label
                                          htmlFor="votingLength "
                                          className="text-black"
                                        >
                                          Voting Length
                                        </label>
                                        <Select
                                          options={[
                                            { label: "1 Day", value: 1 },
                                            { label: "3 Days", value: 3 },
                                            { label: "5 Days", value: 5 },
                                          ]}
                                          onClear={() =>
                                            actions.setFieldValue(
                                              "votingLength",
                                              0
                                            )
                                          }
                                          // className="bg-transparent outline-none font-bold"
                                          // optionClassName="text-black text-xs"
                                          value={values?.votingLength}
                                          defaultValue="Select"
                                          onSelect={(e) =>
                                            actions.setFieldValue(
                                              "votingLength",
                                              e.value
                                            )
                                          }
                                          wrapperClass="text-black !w-[5rem] !text-xs !font-semibold"
                                          optionClass="!text-xs"
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          />
                        </div>
                      );
                    },
                    label: "Poll",
                    icon: faPoll,
                  },
                ]}
                iconClass="text-eduLightBlue"
                tabItemClass="bg-eduDarkGray p-1 text-eduLightBlue font-normal px-3 ease-in-out duration-300 text-[10px] rounded-[5px] capitalize"
                activeTabClass="ring-1 ring-eduLightBlue outline-eduLightBlue"
                formikFieldName="postType"
              />
              <div
                className={`flex gap-2 flex-col ${
                  (values as any)?.forumType == "Choose forum" &&
                  "disabled cursor-not-allowed"
                }`}
              >
                <label htmlFor="categories">
                  Categories{" "}
                  {actions?.touched.categories && actions.errors.categories ? (
                    <span className="ml-1 text-xs font-body mt-1 first-letter:capitalize flex-shrink-0 opacity-50 text-[#FF0000] font-[500]">
                      {actions.errors.categories}
                    </span>
                  ) : null}
                </label>
                <InputField
                  name="category"
                  placeholder="Search"
                  type="search"
                  onChange={onSearch}
                  value={searchText?.category}
                  isFormikField={false}
                />
                <ChipsTemplate
                  type="categories"
                  actions={actions}
                  values={values}
                />
                {!isLoading?.category &&
                  currentPage?.category?.totalRecords >
                    filterCategoryList?.categories?.length && (
                    <LoadMore
                      isLoading={isLoading.category as boolean}
                      onClick={() =>
                        searchAPI("category", searchText?.category)
                      }
                    />
                  )}
                <label className="text-eduBlack" htmlFor="categories">
                  filter&nbsp;
                  {actions?.touched.filters && actions.errors.filters ? (
                    <span className="ml-1 text-xs font-body mt-1 first-letter:capitalize flex-shrink-0 opacity-50 text-[#FF0000] font-[500]">
                      {actions.errors.filters}
                    </span>
                  ) : null}
                </label>
                <InputField
                  name="filter"
                  placeholder="Search"
                  type="search"
                  onChange={onSearch}
                  value={searchText?.filter}
                  isFormikField={false}
                />
                <ChipsTemplate
                  type="filters"
                  actions={actions}
                  values={values}
                />
                {!isLoading?.filter &&
                  currentPage?.filter?.totalRecords >
                    filterCategoryList?.filters?.length && (
                    <LoadMore
                      isLoading={isLoading.filter as boolean}
                      onClick={() => searchAPI("filter", searchText?.filter)}
                    />
                  )}
              </div>
            </div>
            {mode === "Edit" ? (
              <EditPostFooter />
            ) : (
              <ModalFooter
                setFieldValue={actions.setFieldValue}
                disable={shouldDisable({
                  errors: actions.errors,
                  touched: actions.touched,
                  categoryFilter: selectedList,
                })}
              />
            )}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
