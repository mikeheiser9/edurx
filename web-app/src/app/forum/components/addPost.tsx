import { Formik, Form } from "formik";
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
import { ModalFooter, ModalHeader } from "../sections";
import { TextEditor } from "../rich-editor";
import { Chip } from "@/components/chip";
import { axiosGet } from "@/axios/config";
import { LoadMore } from "@/components/loadMore";
import { Loader } from "../../signup/commonBlocks";
import { boldOnSearch } from "@/util/helpers";
import { ToggleSwitch } from "@/components/toggleSwitch";
import { postCreationValidation } from "@/util/validations/post";
import { forumTypes } from "@/util/constant";
import { addNewPost } from "@/service/post.service";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TagCategoryInput {
  category?: string | boolean;
  tag?: string | boolean;
}

interface PageData {
  page: number;
  totalRecords: number;
}

interface CurrentPageRecords {
  category: PageData;
  tag: PageData;
}

interface TagCategoryList {
  categories: [];
  tags: [];
}

export const AddPost = ({ addPostModal }: { addPostModal: any }) => {
  const userId = useSelector(selectUserDetail)?._id ?? undefined;
  const [commonMessage, setCommonMessage] = useState<string | null>(null);
  const [pollOptionsCount, setPollOptionsCount] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<TagCategoryInput>({
    tag: false,
    category: false,
  });
  const [searchText, setSearchText] = useState<{
    category: string;
    tag: string;
  }>({
    category: "",
    tag: "",
  });
  const [tagCategoryList, setTagCategoryList] = useState<{
    categories: [];
    tags: [];
  }>({ categories: [], tags: [] });
  const [currentPage, setCurrentPage] = useState<CurrentPageRecords>({
    category: {
      page: 1,
      totalRecords: 0,
    },
    tag: {
      page: 1,
      totalRecords: 0,
    },
  });
  const [selectedList, setSelectedList] = useState<TagCategoryList>({
    categories: [],
    tags: [],
  });

  const dropdownOptions = forumTypes.map((item) => {
    return {
      value: item,
      label: item,
    };
  });
  const intialFormikValues = {
    forumType: dropdownOptions[0].value,
    postType: "post",
    title: "",
    categories: [],
    tags: [],
    isPrivate: false,
    content: "",
    options: [...Array(pollOptionsCount)].map((_) => ""),
    votingLength: 3, //days
  };

  const debouncedCategory = useDebounce(searchText.category, 1000);
  const debouncedTag = useDebounce(searchText.tag, 1000);

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
    async (type: keyof TagCategoryInput, value: string, isIntial?: boolean) => {
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
        if (response.status === 200) {
          setIsLoading((preState) => {
            return {
              ...preState,
              [type]: false,
            };
          });
          let key: keyof typeof tagCategoryList =
            type === "category" ? "categories" : "tags";
          let prevList = isIntial
            ? selectedList[key]?.length
              ? tagCategoryList?.[key]?.filter((item: any) =>
                  selectedList?.[key]?.some((_id) => _id === item._id)
                )
              : []
            : tagCategoryList?.[key];
          let newRecords = response?.data?.data?.records?.filter(
            (item: any) => {
              if (selectedList?.[key]?.length) {
                return selectedList?.[key]?.includes(item?._id as never)
                  ? false
                  : true;
              }
              return true;
            }
          );

          setTagCategoryList((preState) => {
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
        }
      } catch (error) {
        setIsLoading((preState) => {
          return {
            ...preState,
            [type]: false,
          };
        });
        console.error("Error occurred during search:", error);
      }
    },
    [currentPage, searchText, tagCategoryList]
  );

  const onChipSelect = (type: keyof TagCategoryList, item: any) => {
    setSelectedList((preState) => {
      return {
        ...preState,
        [type]: [...preState?.[type], item?._id],
      };
    });
  };

  const onChipeDelete = (type: keyof TagCategoryList, item: any) => {
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
    type: "categories" | "tags";
    actions: any;
    values: any;
  }) => (
    <>
      {isLoading?.[type === "categories" ? "category" : "tag"] ? (
        <div className="flex flex-auto justify-center h-20">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 flex-auto">
          {tagCategoryList?.[type]?.length ? (
            tagCategoryList?.[type]?.map((item: any) => (
              <Chip
                key={item?._id}
                label={
                  boldOnSearch(
                    item?.name,
                    searchText?.[type === "categories" ? "category" : "tag"]
                  ) as string
                }
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

  const onSubmit = async (values: any, actions: any) => {
    const payload = {
      userId,
      ...values,
      postType: values.postType || "post",
      ...selectedList,
    };
    await addNewPost(payload)
      .then((response) => {
        const message = response?.data?.message;
        if (message) {
          setCommonMessage(message);
          setTimeout(() => {
            setCommonMessage(null);
            addPostModal?.closeModal();
          }, 3000);
        }
      })
      .catch((err) => console.log("error", err));
  };

  useEffect(() => {
    searchAPI("category", debouncedCategory, true);
  }, [debouncedCategory]);

  useEffect(() => {
    searchAPI("tag", debouncedTag, true);
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
          headerTitle="New Post"
          visible={addPostModal.isOpen}
          onClose={addPostModal.closeModal}
          closeOnOutsideClick
          customHeader={<ModalHeader />}
          showFooter={false}
          modalClassName="!rounded-xl"
        >
          <Form>
            <div className="flex flex-col gap-4 p-2">
              <div className="flex justify-between">
                <Select
                  name="forumType"
                  label="Choose Group"
                  options={dropdownOptions}
                  useAsFormikField
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
                          <InputField name="title" placeholder="Title" />
                          <TextEditor
                            value={values.content}
                            setFieldValue={actions.setFieldValue}
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
                        <>
                          <InputField name="title" placeholder="Title" />
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
                                  className="self-center text-white/50"
                                />
                                <InputField
                                  name={`options.${index}`}
                                  placeholder={`Option ${index + 1}`}
                                  type="text"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-auto items-center py-2 justify-between gap-2">
                            <span
                              onClick={() =>
                                setPollOptionsCount((prev) => prev + 1)
                              }
                              className="text-white/80 font-bold inline-block text-xs cursor-pointer"
                            >
                              Add Option
                            </span>
                            {pollOptionsCount > 2 && (
                              <span
                                onClick={() =>
                                  setPollOptionsCount((prev) => prev - 1)
                                }
                                className="text-white/50 animate-scale-in inline-block mt-2 bg-gray-600 p-2 py-1 rounded-md text-xs cursor-pointer"
                              >
                                Remove
                              </span>
                            )}
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
                                className="bg-transparent outline-none font-bold"
                                optionClassName="text-black text-xs"
                                name="votingLength"
                                useAsFormikField
                                id="votingLength"
                              />
                            </div>
                          </div>
                        </>
                      );
                    },
                    label: "Poll",
                    icon: faPoll,
                  },
                ]}
                iconClass="opacity-100 text-white"
                tabItemClass="bg-transparent p-1 text-white font-medium px-3 ease-in-out duration-300 text-xs rounded capitalize"
                activeTabClass="ring-2 ring-primary outline-primary"
                // componentWrapperClass="flex-auto"
                formikFieldName="postType"
              />
              <div className="flex gap-2 flex-col">
                <label className="text-white/50" htmlFor="categories">
                  Categories
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
                    tagCategoryList?.categories?.length && (
                    <LoadMore
                      isLoading={isLoading.category as boolean}
                      onClick={() =>
                        searchAPI("category", searchText?.category)
                      }
                    />
                  )}
                <label className="text-white/50" htmlFor="categories">
                  Tags
                </label>
                <InputField
                  name="tag"
                  placeholder="Search"
                  type="search"
                  onChange={onSearch}
                  value={searchText?.tag}
                  isFormikField={false}
                />
                <ChipsTemplate type="tags" actions={actions} values={values} />
                {isLoading?.tag &&
                  currentPage?.tag?.totalRecords >
                    tagCategoryList?.tags?.length && (
                    <LoadMore
                      isLoading={isLoading.tag as boolean}
                      onClick={() => searchAPI("tag", searchText?.tag)}
                    />
                  )}
              </div>
            </div>
            <ModalFooter
              message={commonMessage}
              setFieldValue={actions.setFieldValue}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
