"use client";
import { Button } from "@/components/button";
import { useModal } from "@/hooks";
import React, { useEffect, useState } from "react";
import { AddPost } from "./components/addPost";
import { axiosGet } from "@/axios/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { responseCodes, roleAccess } from "@/util/constant";
import { PostCard } from "./components/postCard";
import InfiniteScroll from "@/components/infiniteScroll";
import { PostModal } from "./components/postModal";
import { requireAuthentication } from "@/components/requireAuthentication";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetail, setDraftCount } from "@/redux/ducks/user.duck";

import { showToast } from "@/components/toast";
import { updatePostByAPI } from "@/service/post.service";
import { Select } from "@/components/select";
import {
  getSelectedForumFilters,
  setSelectedFilter,
} from "@/redux/ducks/forum.duck";
import { getAllowedForumAccessBasedOnRoleAndNpiDesignation } from "@/util/helpers";
import { getUserDraftCount } from "@/service/user.service";
import DraftModal from "./components/draftModal";
import { Chip } from "@/components/chip";

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
  const [showLoading, setShowLoading] = useState(false);
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
      setShowLoading(true);
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
      if (selectedFilters?.filters?.length) {
        Object.assign(payload, {
          filters: selectedFilters.filters.map((item) => item?._id).toString(),
        });
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
        setPostPagination((prev) => {
          return {
            page: response?.data?.data?.posts?.metadata?.currentPage,
            totalRecords: response?.data?.data?.posts?.metadata?.totalRecords,
          };
        });
      }
      setShowLoading(false);
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
      } else
        throw new Error(response?.data?.message || "Unable to update post");
    } catch (error) {
      console.log("Failed to update post", error);
    }
  };

  useEffect(() => {
    if (selectedForumTab === forumTabs[2]) return;
    setPosts([]);
    setPostPagination({
      page: 1,
      totalRecords: 0,
    });
    setTimeout(()=>{
      fetchPosts(1, apiEndpoint, false);
    },1000)
  }, [selectedFilters, selectedForumTab]);

  useEffect(() => {
    (async () => {
      const res = await getUserDraftCount();
      if (res?.data?.response_type == "Success") {
        dispatch(setDraftCount(res?.data?.data));
      }
    })();
  }, []);

  return (
    <React.Fragment>
      {addPostModal.isOpen && (
        <AddPost
          addPostModal={addPostModal}
          fetchPosts={() => fetchPosts(1, apiEndpoint, false)}
        />
      )}
      <DraftModal />
      <PostModal viewPostModal={viewPostModal} postId={selectedPostId} />
      <div className="flex justify-between items-center w-full x-large:mb-2 x-large:gap-y-4 flex-wrap ipad-under:mb-5 ipad-under:flex-col-reverse ipad-under:gap-4">
        <div className="flex justify-center items-center gap-3 ipad-under:hidden">
          <span className="bg-primary-dark w-8 h-8 flex items-center justify-center rounded-[5px] ">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-eduBlack text-[18px] bg-eduDarkGray p-[8px] rounded-[5px]"
            />
          </span> 
          <Button
            onClick={addPostModal.openModal}
            className="!w-[125px] hover:!bg-eduBlack !h-[34px] !bg-eduDarkGray group text-eduBlack flex gap-3 justify-center items-center px-2 py-2 !border-none"
          >
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="text-eduLightBlue group-hover:text-white text-[18px]"
            />
            <span className="text-[14px] font-body font-medium text-eduLightBlue group-hover:text-white">New Post</span>
          </Button>
        </div>
        <ul className="flex gap-6 ipad-under:mx-auto">
          {forumTabs.map((item) => (
            <li
              onClick={() => setSelectedForumTab(item)}
              className={`text-eduBlack font-body font-medium ease-in-out duration-500 border-b-2 py-2 text-[14px] cursor-pointer ipad-under:text-xs ipad-under:py-1 ${
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
            className="text-eduBlack font-body text-[14px] font-medium ipad-under:hidden"
          >
            Viewing :
          </label>
          <Select
            options={getAllowedForumAccessBasedOnRoleAndNpiDesignation(
              loggedInUser?.role,
              loggedInUser?.npi_designation
            ).map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
            onSelect={(e) => handleFilters("forumType", e?.value)}
            onClear={() => handleFilters("forumType", "")}
            value={selectedFilters?.forumType || "Change forum"}
            wrapperClass="!w-[12rem] h-[34px]"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedFilters?.categories?.map((item: TagCategoryType) => (
          <Chip
            key={item._id}
            label={item.name}
            onClear={() => {
              const values =
                selectedFilters?.categories?.filter(
                  (i: TagCategoryType) => i._id !== item._id
                ) ?? [];
              handleFilters("categories", values);
            }}
            className="bg-transparent border border-eduLightBlue  text-xs ipad-under:text-[8px] ipad-under:rounded-sm ipad-under:leading-normal ipad-under:py-1 px-2 leading-6 rounded-md gap-2"
            isSelected
          />
        ))}
        {selectedFilters?.filters?.map((item: TagCategoryType) => (
          <Chip
            key={item._id}
            label={item.name}
            onClear={() => {
              const values =
                selectedFilters?.filters?.filter(
                  (i: TagCategoryType) => i._id !== item._id
                ) ?? [];
              handleFilters("filters", values);
            }}
            className="!bg-eduDarkGray border text-eduDarkBlue text-xs ipad-under:text-[8px] ipad-under:rounded-sm ipad-under:leading-normal ipad-under:py-1 px-2 leading-6 rounded-md gap-2"
            isSelected
          />
        ))}
      </div>
      <InfiniteScroll
        className="flex flex-col w-full h-full rounded-md gap-4"
        callBack={loadMorePosts}
        hasMoreData={posts?.length < postPagination.totalRecords}
        showLoading={showLoading}
      >
        {posts?.map((post) => (
          <div key={post._id}>
            <PostCard
              post={post}
              key={post._id}
              onPostClick={() => onPostClick(post?._id)}
              userRole={loggedInUser?.role}
              onDeletePost={isAdmin ? () => onDeletePost(post?._id) : undefined}
              onFlagPost={isAdmin ? onFlagPost : undefined}
              isPostOwner={post.userId == loggedInUser._id}
              loggedUserId={loggedInUser._id}
            />
          </div>
        ))}
      </InfiniteScroll>
    </React.Fragment>
  );
};

export default requireAuthentication(Page);
