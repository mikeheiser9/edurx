"use client";
import { Button } from "@/components/button";
import { useModal } from "@/hooks";
import React, { useEffect, useState } from "react";
import { AddPost } from "./components/addPost";
import { axiosGet } from "@/axios/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { responseCodes, roleAccess, roleBasedForum } from "@/util/constant";
import { Chip } from "@/components/chip";
import { LeftPanel } from "./components/leftPanel";
import { PostCard } from "./components/postCard";
import InfiniteScroll from "@/components/infiniteScroll";
import { PostModal } from "./components/postModal";
import { requireAuthentication } from "@/components/requireAuthentication";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";

import { showToast } from "@/components/toast";
import { updatePostByAPI } from "@/service/post.service";
import { Select } from "@/components/select";

import DashboardLayout from "@/components/dashboardLayout";
import {
  getSelectedForumFilters,
  setSelectedFilter,
} from "@/redux/ducks/forum.duck";

const forumTabs = ["Forum Feed", "Your Posts", "Following"];

const Page = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const addPostModal = useModal();
  const viewPostModal = useModal();
  const selectedFilters: FilterOptionsState = useSelector(
    getSelectedForumFilters
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

  const isAdmin = loggedInUser?.role === roleAccess.ADMIN;
  let apiEndpoint: string = `/post/forum/${
    selectedForumTab === forumTabs[1] ? "user" : "all"
  }`;
  
  const handleFilters = (
    type: keyof FilterOptionsState,
    value: string | any[]
  ) => {
    dispatch(
      setSelectedFilter({
        ...selectedFilters,
        [type]: selectedFilters?.[type] === value ? null : value,
      })
    );
  };

  const fetchPosts = async (
    page: Number,
    endPoint: string,
    useConcat: boolean = true
  ) => {
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
      if(selectedFilters?.filters?.length)
      {
        Object.assign(payload,{
          filters:selectedFilters.filters.map((item)=>item?.id)
        })
      }
      if (selectedFilters?.forumType) {
        Object.assign(payload, { forumType: selectedFilters.forumType });
      }
      if (selectedFilters?.sortBy) {
        Object.assign(payload, { sortBy: selectedFilters.sortBy });
      }
      const response = await axiosGet(endPoint, {
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
    await fetchPosts(postPagination.page + 1, apiEndpoint);
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

  const fetchUsersPost = async () => {
    try {
      const response = await axiosGet("/post/forum/user");
      console.log(response);
    } catch (error) {
      showToast?.error(
        (error as Error)?.message || "Unable to fetch users post"
      );
      console.log("Failed to fetch user post", error);
    }
  };

  // const onForumTabChange = async (tab: string) => {
  //   if (select === tab) return;
  //   if (tab === forumTabs[1]) {
  //     await fetchPosts(1, "/post/forum/user", false);
  //   }
  //   setSelectedForumTab(tab);
  // };

  useEffect(() => {
    if (selectedForumTab === forumTabs[2]) return;
    fetchPosts(1, apiEndpoint, false);
  }, [selectedFilters, selectedForumTab]);
  
  return (
    <React.Fragment>
      {addPostModal.isOpen && <AddPost addPostModal={addPostModal} />}
      <PostModal viewPostModal={viewPostModal} postId={selectedPostId} />

      <div className="flex justify-between items-center w-full h-[55px]">
        <div className="flex justify-center items-center gap-2">
          <span className="bg-primary-dark w-8 h-8 flex items-center justify-center rounded-md ">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-eduBlack text-[18px] bg-eduDarkGray p-[8px] rounded-[10px]"
            />
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
          <label
            htmlFor="forumType"
            className="text-eduBlack font-body text-[14px] font-medium"
          >
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
            onClear={() => {
              const values =
                selectedFilters?.categories?.filter(
                  (i: TagCategoryType) => i.name !== item.name
                ) ?? [];
              handleFilters("categories", values);
            }}
            className="bg-transparent border border-eduLightBlue  text-xs px-2 leading-6 rounded-md gap-2"
            isSelected
          />
        ))}
      </div>
      <InfiniteScroll
        className="flex flex-col w-full h-full rounded-md gap-4"
        callBack={loadMorePosts}
        hasMoreData={posts?.length < postPagination.totalRecords}
        showLoading
      >
        
        {posts?.map((post) => (
          <div>
          <PostCard
            post={post}
            key={post._id}
            onPostClick={() => onPostClick(post?._id)}
            userRole={loggedInUser?.role}
            onDeletePost={isAdmin ? () => onDeletePost(post?._id) : undefined}
            onFlagPost={isAdmin ? onFlagPost : undefined}
            isPostOwner={post.userId==loggedInUser._id}
            loggedUserId={loggedInUser._id}
          />
          </div>
        ))}
      </InfiniteScroll>
    </React.Fragment>
  );
};

export default requireAuthentication(Page);
