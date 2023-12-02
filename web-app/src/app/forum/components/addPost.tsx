import { Formik, Form, FormikHelpers } from "formik";
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
import { boldOnSearch } from "@/util/helpers";
import { ToggleSwitch } from "@/components/toggleSwitch";
import { postCreationValidation } from "@/util/validations/post";
import { responseCodes, roleBasedForum } from "@/util/constant";
import { addNewPost } from "@/service/post.service";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showToast } from "@/components/toast";

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

export const AddPost = ({ addPostModal }: { addPostModal: UseModalType }) => {
  const loggedInUser = useSelector(selectUserDetail);
  const [pollOptionsCount, setPollOptionsCount] = useState<number>(2);
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

  const dropdownOptions = roleBasedForum[
    loggedInUser?.role as keyof typeof roleBasedForum
  ].map((item) => {
    return {
      value: item,
      label: item,
    };
  });
  const intialFormikValues: CreatePostFormikInterface = {
    forumType: dropdownOptions[0].value as ForumTypes,
    postType: "post",
    title: "",
    categories: [],
    filters: [],
    isPrivate: false,
    content: "",
    options: [...Array(pollOptionsCount)].map((_) => ""),
    votingLength: 3, //days
  };

  const debouncedCategory = useDebounce(searchText.category, 1000);
  const debouncedTag = useDebounce(searchText.filter, 1000);

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
      isIntial?: boolean
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
          let prevList = isIntial
            ? selectedList[key]?.length
              ? filterCategoryList?.[key]?.filter((item: TagCategoryType) =>
                  selectedList?.[key]?.some((_id) => _id === item._id)
                )
              : []
            : filterCategoryList?.[key];
          let newRecords = response?.data?.data?.records?.filter(
            (item: TagCategoryType) => {
              if (selectedList?.[key]?.length) {
                return selectedList?.[key]?.includes(item?._id as never)
                  ? false
                  : true;
              }
              return true;
            }
          );

          setFilterCategoryList((preState) => {
            return {
              ...preState,
              [key]: [...prevList, ...newRecords],
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
    [currentPage, searchText, filterCategoryList]
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
  }) => (
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
                    searchText?.[type === "categories" ? "category" : "filter"]
                  ) as string
                }
                className={`${
                  type === "categories"
                    ? "bg-transparent border border-eduLightBlue"
                    : "!bg-eduDarkGray"
                }  text-xs px-2 leading-6 rounded-md`}
                onSelect={() => onChipSelect(type, item)}
                onClear={() => onChipeDelete(type, item)}
                isSelected={selectedList?.[type]?.some(
                  (_id: string) => _id === item?._id
                )}
              />
            ))
          ) : (
            <span className="text-white">No {type} found</span>
          )}
        </div>
      )}
    </>
  );

  const onSubmit = async (
    values: CreatePostFormikInterface,
    actions: FormikHelpers<CreatePostFormikInterface>
  ) => {
    const payload = {
      userId: loggedInUser?._id,
      ...values,
      postType: values.postType || "post",
      ...selectedList,
    };
    console.log({ values });

    await addNewPost(payload)
      .then((response) => {
        let message = response?.data?.message;
        if (response?.status === responseCodes.SUCCESS) {
          showToast.success(message || "Post added successfully");
          setTimeout(() => {
            addPostModal?.closeModal();
          }, 1000);
        } else throw new Error(message || "Something went wrong");
      })
      .catch((err) => {
        console.log("error", err);
        showToast.error(err?.message || "Unable to add post");
      });
  };

  useEffect(() => {
    searchAPI("category", debouncedCategory, true);
  }, [debouncedCategory]);

  useEffect(() => {
    searchAPI("filter", debouncedTag, true);
  }, [debouncedTag]);

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
          customHeader={<ModalHeader onClose={addPostModal.closeModal} />}
          showFooter={false}
          modalClassName="!rounded-xl"
          modalBodyClassName="relative p-4 overflow-y-auto font-body overflow-hidden bg-white"
        >
          <Form>
            <div className="flex flex-col gap-4 p-2 ">
              <div className="flex justify-between">
                <Select
                  defaultValue="Choose Group"
                  options={dropdownOptions}
                  value={values?.forumType}
                  onSelect={(e) => actions.setFieldValue("forumType", e?.value)}
                  wrapperClass="!w-[12rem] !text-xs"
                  optionClass="text-xs"
                />
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
                          <InputField
                            name="title"
                            placeholder="Title"
                            maxLength={130}
                          />
                          <TextEditor
                            value={values?.content}
                            setFieldValue={actions?.setFieldValue}
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
                          />
                          <div className="gap-2 grid grid-cols-2">
                            {[...Array(pollOptionsCount)].map((_, index) => (
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
                              <span
                                onClick={() =>
                                  setPollOptionsCount((prev) => prev + 1)
                                }
                                className="text-white animate-scale-in inline-block mt-2 bg-eduLightBlue p-2 py-1 rounded-md text-xs cursor-pointer"
                              >
                                Add Option
                              </span>
                              {pollOptionsCount > 2 && (
                                <span
                                  onClick={() =>
                                    setPollOptionsCount((prev) => prev - 1)
                                  }
                                  className="animate-scale-in inline-block mt-2 bg-eduBlack text-white p-2 py-1 rounded-md text-xs cursor-pointer"
                                >
                                  Remove
                                </span>
                              )}
                            </div>
                            <div className="text-white text-xs flex gap-1 items-center">
                              <label htmlFor="votingLength">
                                Voting Length
                              </label>
                              <Select
                                options={[
                                  { label: "1 Day", value: 1 },
                                  { label: "3 Days", value: 3 },
                                  { label: "5 Days", value: 5 },
                                ]}
                                onClear={() =>
                                  actions.setFieldValue("votingLength", 0)
                                }
                                // className="bg-transparent outline-none font-bold"
                                // optionClassName="text-black text-xs"
                                value={values?.votingLength}
                                defaultValue="Select"
                                onSelect={(e) =>
                                  actions.setFieldValue("votingLength", e.value)
                                }
                                wrapperClass="text-black !w-[5rem] !text-xs !font-semibold"
                                optionClass="!text-xs"
                              />
                            </div>
                          </div>
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
                // componentWrapperClass="flex-auto"
                formikFieldName="postType"
              />
              <div className="flex gap-2 flex-col">
                <label htmlFor="categories">Categories</label>
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
                  filter
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
                {isLoading?.filter &&
                  currentPage?.filter?.totalRecords >
                    filterCategoryList?.filters?.length && (
                    <LoadMore
                      isLoading={isLoading.filter as boolean}
                      onClick={() => searchAPI("filter", searchText?.filter)}
                    />
                  )}
              </div>
            </div>
            <ModalFooter setFieldValue={actions.setFieldValue} />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
