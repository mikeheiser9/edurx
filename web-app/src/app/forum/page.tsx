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
import { responseCodes, roleAccess, roleBasedForum } from "@/util/constant";
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
import { showToast } from "@/components/toast";
import { updatePostByAPI } from "@/service/post.service";
import { Select } from "@/components/select";
import EduRxIcon from "../../assets/icons/eduRx-black.svg";

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
  { label: "Hub", img: EduRxIcon },
  { label: "Forum" },
  { label: "Resources" },
  { label: "My Edu-Rx", isDisabled: true },
  { label: "Events", isDisabled: true },
  { label: "EduRx Library", isDisabled: true },
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
  const [selectedTab, setSelectedTab] = useState<string>(
    tabMenuOptions[0]?.label
  );
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
  const isAdmin = loggedInUser?.role === roleAccess.ADMIN;

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
      } else throw new Error("Unable to retrieve category list");
    } catch (error) {
      showToast.error(
        (error as Error)?.message || "Unable to retrieve category list"
      );
      console.error("Error processing category list", error);
    }
  };

  const handleFilters = (
    type: keyof FilterOptionsState,
    value: string | any[]
  ) => {
    if (selectedFilters?.[type] === value) return;
    setSelectedFilters((preState) => {
      return {
        ...preState,
        [type]: value,
      };
    });
  };

  const fetchPosts = async (page: Number, useConcat: boolean = true) => {
    try {
      let payload = {
        limit: 10,
        page,
      };
      if (selectedFilters?.categories?.length) {
        Object.assign(payload, {
          categories: selectedFilters.categories
            .map((item) => item?._id)
            .toString(),
        });
      }
      if (selectedFilters?.forumType) {
        Object.assign(payload, { forumType: selectedFilters.forumType });
      }
      if (selectedFilters?.sortBy) {
        Object.assign(payload, { sortBy: selectedFilters.sortBy });
      }
      const response = await axiosGet("/post/forum/all", {
        params: payload,
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

  const onDeletePost = async (postId: string) => {
    try {
      const response = await updatePostByAPI({
        _id: postId,
        isDeleted: true,
      });
      if (response.status === responseCodes.SUCCESS) {
        showToast.success("Post deleted successfully");
        // fetchPosts(1, false); // fetching posts again after deleting
        setPosts(posts?.filter((p) => p?._id !== postId));
      } else
        throw new Error(response?.data?.message || "Unable to delete post");
    } catch (error) {
      showToast.error((error as Error)?.message || "Something went wrong");
      console.log("Failed to delete post", error);
    }
  };

  const onFlagPost = async (postId: string, flag: PostFlags | null) => {
    try {
      const response = await updatePostByAPI({
        _id: postId,
        flag: flag || null,
      });
      console.log(response);
      if (response.status === responseCodes.SUCCESS) {
        let updatedPostIndex = posts?.findIndex((p) => p?._id === postId);
        if (updatedPostIndex !== -1) {
          posts[updatedPostIndex].flag = flag || null;
        }
        showToast.success(
          flag ? `Post flagged as ${flag}` : "Post flag removed successfully"
        );
        setPosts((pre) => [...pre]);
        // fetchPosts(1, false); // fetching posts again after deleting
      } else
        throw new Error(response?.data?.message || "Unable to update post");
    } catch (error) {
      console.log("Failed to update post", error);
    }
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
            {tabMenuOptions.map((item, index: number) => (
              <button
                key={index}
                onClick={() => !item?.isDisabled && setSelectedTab(item?.label)}
                className={`duration-300 disabled:select-none disabled:opacity-60 disabled:cursor-not-allowed items-center ease-in-out transition-all text-sm rounded-md flex justify-center p-2 px-6 ${
                  item?.label === selectedTab ? "bg-primary" : "bg-white cursor-pointer"
                }`}
                type="button"
                disabled={item?.isDisabled}
              >
                <span className="flex items-center justify-center font-semibold gap-1">
                  {item?.img && (
                    <Image
                      src={item.img}
                      alt={item?.label}
                      className="w-6 h-6"
                    />
                  )}
                  {item?.label}
                </span>
              </button>
            ))}
            <div
              className={`absolute transition-colors rounded-md ease-in-out duration-100 p-2 z-40 flex gap-2 flex-col right-4 ${
                showDropdown ? "bg-primary-darker" : "bg-transparent"
              }`}
              ref={dropDownRef}
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
                options={roleBasedForum[
                  loggedInUser?.role as keyof typeof roleBasedForum
                ]?.map((item) => {
                  return {
                    label: item,
                    value: item,
                  };
                })}
                onSelect={(e) => handleFilters("forumType", e?.value)}
                onClear={() => handleFilters("forumType", "")}
                value={selectedFilters?.forumType || "Choose a forum type"}
                wrapperClass="!w-[12rem]"
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
                onDeletePost={
                  isAdmin ? () => onDeletePost(post?._id) : undefined
                }
                onFlagPost={isAdmin ? onFlagPost : undefined}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </React.Fragment>
  );
};

export default requireAuthentication(Page);
