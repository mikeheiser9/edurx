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
import { forumTypes } from "@/util/constant";
import { Chip } from "@/components/chip";
import { LeftPanel } from "./components/leftPanel";
import { PostCard } from "./components/postCard";
import InfiniteScroll from "@/components/infiniteScroll";
import { PostModal } from "./components/postModal";
import { requireAuthentication } from "@/components/requireAuthentication";
import { DropDownPopover } from "./sections";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  removeToken,
  removeUserDetail,
  selectUserDetail,
  setUserDetail,
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
  "Forum",
  "Resources",
  "My Edu-Rx",
  "Events",
  "EduRx Library",
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
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>(tabMenuOptions[0]);
  const [selectedForumTab, setSelectedForumTab] = useState<string>(
    forumTabs[0]
  );
  const [posts, setPosts] = useState<any[]>([]);
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
      if (response.status === 200) {
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
          limit: 5,
          page,
        },
      });

      if (response?.status === 200) {
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
        <div className="flex-1 flex overflow-hidden flex-col gap-2">
          <div className="flex relative bg-primary-dark gap-4 p-4 justify-center rounded-md">
            {tabMenuOptions.map((item: string, index: number) => (
              <label
                key={index}
                onClick={() => setSelectedTab(item)}
                className={`text-white duration-500 ease-in-out transition-colors border text-sm rounded-md p-2 px-4 ${
                  item === selectedTab ? "border-primary" : "border-white/50"
                }`}
              >
                {item}
              </label>
            ))}
            <div
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
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex justify-center items-center gap-2">
              <span className="bg-primary-dark w-8 h-8 flex items-center justify-center rounded-md text-white">
                <FontAwesomeIcon icon={faSearch} size="sm" />
              </span>
              <Button
                onClick={addPostModal.openModal}
                className="!w-auto border border-transparent ease-in-out duration-200 hover:border-primary hover:!bg-primary-dark bg-primary-dark text-white flex gap-2 justify-center items-center px-4"
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  className="text-primary"
                  size="sm"
                />
                <span className="text-xs">New Post</span>
              </Button>
            </div>
            <ul className="flex gap-6">
              {forumTabs.map((item) => (
                <li
                  onClick={() => setSelectedForumTab(item)}
                  className={`text-white ease-in-out duration-500 border-b-2 py-2 text-sm ${
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
              <label htmlFor="forumType" className="text-white">
                Viewing :
              </label>
              <Select
                options={forumTypes.map((item) => {
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
            {selectedFilters?.categories?.map((item: any) => (
              <Chip
                key={item._id}
                label={item.name}
                // onSelect={() => onCipSelect(type, item)}
                onClear={() => {
                  const values =
                    selectedFilters?.categories?.filter(
                      (i: any) => i.name !== item.name
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
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </React.Fragment>
  );
};

export default requireAuthentication(Page);
