"use client";
import { Button } from "@/components/button";
import { useModal, useOutsideClick } from "@/hooks";
import React, { useEffect, useState } from "react";
import { AddPost } from "./components/addPost";
import { axiosGet } from "@/axios/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faPlusCircle,
  faSearch,
  faSignOut,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Select } from "@/components/select";
import { responseCodes, roleBasedForum } from "@/util/constant";
import { Chip } from "@/components/chip";
import { LeftPanel } from "./components/leftPanel";
import { PostCard } from "./components/postCard";
import InfiniteScroll from "@/components/infiniteScroll";
import { PostModal } from "./components/postModal";
import { requireAuthentication } from "@/components/requireAuthentication";
import { DropDownPopover } from "./components/sections";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  removeToken,
  removeUserDetail,
  selectUserDetail,
} from "@/redux/ducks/user.duck";
import Image from "next/image";
import { getStaticImageUrl } from "@/util/helpers";

const sortingOptions: { value: string; label: string }[] = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Most Popular",
    value: "popular",
  },
  {
    label: "Trending",
    value: "trending",
  },
];

const tabMenuOptions = [
  "Hub Home",
  "Forum",
  "Resources",
  "Events",
  "EduRx Library",
  "Health Check",
];

const forumTabs = ["Forum Feed", "Your Posts", "Following"];

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const addPostModal = useModal();
  const viewPostModal = useModal();
  const [categoryList, setCategoryList] = useState([]);
  const [categoryPagination, setCategoryPagination] = useState<PageDataState>({
    page: 1,
    totalRecords: 0,
  });
  const [selectedFilters, setSelectedFilters] = useState<FilterOptionsState>();
  const [selectedCategories, setSelectedCategories] = useState<
    TagCategoryType[]
  >([]);
  const [selectedTab, setSelectedTab] = useState<string>(tabMenuOptions[0]);
  const [selectedForumTab, setSelectedForumTab] = useState<string>(
    forumTabs[0]
  );
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [postPagination, setPostPagination] = useState<PageDataState>({
    page: 1,
    totalRecords: 0,
  });
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [showDropdown, setshowDropdown] = useState<boolean>(false);
  const dropDownRef = useOutsideClick(() => setshowDropdown(false));

  const fetchCategories = async (page: number = 1) => {
    try {
      const response = await axiosGet("/post/category/search", {
        params: {
          name: "",
          type: "category",
          limit: 10,
          page,
        },
      });
      if (response.status === responseCodes.SUCCESS) {
        setCategoryList(categoryList.concat(response?.data?.data?.records));
        setCategoryPagination({
          page: response?.data?.data?.currentPage,
          totalRecords: response?.data?.data?.totalRecords,
        });
      }
    } catch (error) {
      console.error("Error processing category list", error);
    }
  };

  const handleFilters = (
    type: keyof FilterOptionsState,
    value: string | any[]
  ) => {
    setSelectedFilters((preState) => {
      return {
        ...preState,
        [type]: value,
      };
    });
  };

  const fetchPosts = async (page: Number, useConcat: boolean = true) => {
    try {
      const response = await axiosGet("/post/forum/all", {
        params: {
          ...selectedFilters,
          ...(selectedFilters?.categories?.length
            ? {
                categories: selectedFilters.categories
                  .map((item) => item._id)
                  .toString(),
              }
            : {}),
          limit: 10,
          page,
        },
      });

      if (response?.status === responseCodes.SUCCESS) {
        setPosts(
          useConcat
            ? posts.concat(response?.data?.data?.posts?.data)
            : response?.data?.data?.posts?.data
        );
        setPostPagination({
          page: response?.data?.data?.posts?.metadata?.currentPage,
          totalRecords: response?.data?.data?.posts?.metadata?.totalRecords,
        });
      }
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };

  const loadMorePosts = async () => {
    await fetchPosts(postPagination.page + 1);
  };

  const onPostClick = (postId: string) => {
    viewPostModal.openModal();
    setSelectedPostId(postId);
  };

  const logOutUser = () => {
    dispatch(removeUserDetail());
    dispatch(removeToken());
  };

  useEffect(() => {
    fetchPosts(1, false);
  }, [selectedFilters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <React.Fragment>
      {addPostModal.isOpen && <AddPost addPostModal={addPostModal} />}
      <PostModal viewPostModal={viewPostModal} postId={selectedPostId} />
      <div className="flex p-4 gap-4 w-full h-screen overflow-hidden">
        <LeftPanel
          categoryList={categoryList}
          handleFilters={handleFilters}
          selectedFilters={selectedFilters}
          sortingOptions={sortingOptions}
          onLoadMore={() => fetchCategories(categoryPagination.page + 1)}
          categoryPagination={categoryPagination}
          setSelectedCategories={setSelectedCategories}
          selectedCategories={selectedCategories}
        />
        <div className="flex-1 flex overflow-hidden flex-col justify-center items-center gap-2">
          <div className="flex relative bg-primary-dark gap-8 p-4 justify-start rounded-md">
            {tabMenuOptions.map((item: string, index: number) => (
              <label
                key={index}
                onClick={() => setSelectedTab(item)}
                className={`text-eduBlack duration-500 ease-in-out transition-colors text-[16px] rounded-[5px] py-2 px-4 w-[145px] font-body text-center cursor-pointer ${
                  item === selectedTab ? "bg-eduBlack text-white" : "bg-eduDarkGray"
                }`}
              >
                {item}
              </label>
            ))}
            {/* <div
              className={`absolute transition-colors rounded-md ease-in-out duration-100 p-2 flex gap-2 flex-col right-4 ${
                showDropdown ? "bg-primary-darker" : "bg-transparent"
              }`}
              ref={dropDownRef as any}
            >
              <div className="flex justify-end">
                <span
                  onClick={() => setshowDropdown(!showDropdown)}
                  className={`flex ease-in-out duration-500 cursor-pointer ring-white border-primary overflow-hidden w-8 h-8 justify-center items-center text-primary rounded-full bg-white ${
                    showDropdown ? "ring-2" : ""
                  }`}
                >
                  {loggedInUser?.profile_img ? (
                    <Image
                      src={getStaticImageUrl(loggedInUser?.profile_img)}
                      alt="user_profile_img"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUserAlt} />
                  )}
                </span>
              </div>
              <DropDownPopover
                itemClassName="px-1 text-sm flex items-center gap-2 cursor-pointer"
                isVisible={showDropdown}
                options={[
                  {
                    label: "Profile",
                    icon: faUserAlt,
                    onClick: () => router.push("profile"),
                  },
                  {
                    label: "Notifications",
                    icon: faBell,
                  },
                  {
                    label: "Account",
                    icon: faGear,
                  },
                  {
                    label: "Logout",
                    icon: faSignOut,
                    onClick: logOutUser,
                  },
                ]}
              />
            </div> */}
          </div>
          <div className="flex justify-between items-center w-full h-[55px]">
            <div className="flex justify-center items-center gap-2">
              <span className="bg-primary-dark w-8 h-8 flex items-center justify-center rounded-md ">
                <FontAwesomeIcon icon={faSearch} className="text-eduBlack text-[18px] bg-eduDarkGray p-[8px] rounded-[10px]" />
              </span>
              <Button
                onClick={addPostModal.openModal}
                className="!w-[125px] hover:!bg-eduBlack !bg-eduLightGray text-eduBlack flex gap-3 justify-center items-center px-2 py-2 !border-none"
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  className="text-primary text-[20px]"
                />
                <span className="text-[14px] font-body font-medium">New Post</span>
              </Button>
            </div>
            <ul className="flex gap-6">
              {forumTabs.map((item) => (
                <li
                  onClick={() => setSelectedForumTab(item)}
                  className={`text-eduBlack font-body font-medium ease-in-out duration-500 border-b-2 py-2 text-[14px] ${
                    item === selectedForumTab
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex justify-center items-center gap-2">
              <label htmlFor="forumType" className="text-eduBlack font-body text-[14px] font-medium">
                Viewing :
              </label>
              <Select
                options={roleBasedForum[
                  loggedInUser?.role as keyof typeof roleBasedForum
                ]?.map((item) => {
                  return {
                    label: item,
                    value: item,
                  };
                })}
                onChange={(e) => handleFilters("forumType", e.target.value)}
                value={selectedFilters?.forumType ?? "Choose a forum type"}
                label="Choose a forum type"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters?.categories?.map((item: TagCategoryType) => (
              <Chip
                key={item._id}
                label={item.name}
                // onSelect={() => onCipSelect(type, item)}
                onClear={() => {
                  const values =
                    selectedFilters?.categories?.filter(
                      (i: TagCategoryType) => i.name !== item.name
                    ) ?? [];
                  handleFilters("categories", values);
                  setSelectedCategories(values);
                }}
                className="text-sm p-1 px-2 gap-1 flex items-center justify-center text-white/50 rounded-md"
                isSelected
              />
            ))}
          </div>
          <InfiniteScroll
            className="flex flex-col w-full h-full rounded-md gap-4"
            callBack={loadMorePosts}
            hasMoreData={posts.length < postPagination.totalRecords}
            showLoading
          >
            {posts.map((post) => (
              <PostCard
                post={post}
                key={post._id}
                onPostClick={() => onPostClick(post?._id)}
                userRole={loggedInUser?.role}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </React.Fragment>
  );
};

export default requireAuthentication(Page);
