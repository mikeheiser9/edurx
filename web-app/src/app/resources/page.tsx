"use client";
import React, { useState, useEffect, useRef } from "react";
import { axiosGet } from "@/axios/config";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { ResourceCard } from "./components/ResourceCard";
import { getResources } from "@/service/resource.service";
import InfiniteScroll from "@/components/infiniteScroll";

export default function Resources(props: any) {
  const loggedInUser = useSelector(selectUserDetail);
  const resourceTabs = ["Resources", "News", "Reading List"];
  const [savedResources, setSavedResources] = useState(new Set());
  const [activeSubTab, setActiveSubTab] = useState(resourceTabs[0]);

  // resource states
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceCurrentPage, setResourceCurrentPage] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)
  const pageResourcelimit = 5

  const fetchResources = async (page: number = 1) => {
    setResourceLoading(true)
    try {
      const response = await getResources(page)
      if (response.data.response_type == "success") {
        setResources((pre) => [...pre, ...response.data.data]);
        setResourceCurrentPage((pre) => pre + 1);
        if (response.data.data.length < pageResourcelimit) {
          setShowLoadMore(false)
        }
      }
    } catch (error) {
      console.log("Error fetching resource data ", error);
    }
    setResourceLoading(false)
  };

  useEffect(() => {
    setShowLoadMore(true)
    fetchResources();
  }, []);

  useEffect(() => {
    interface ReadingListItem {
      _id: string;
      title: string;
      link: string;
      publisher: string;
      tags: Array<string>;
    }

    const fetchReadingList = async () => {
      try {
        const response = await axiosGet(
          `/user/${loggedInUser._id}/reading_list`
        );
        setSavedResources(
          new Set(response.data.map((item: ReadingListItem) => item._id))
        );
      } catch (error) {
        console.log("Error fetching reading list data ", error);
      }
    };

    fetchReadingList();
  }, []);

  const loadMorePosts = async () => {
    await fetchResources(resourceCurrentPage)
  }

  return (
    <>

      <ul className="flex gap-6 ipad-under:mx-auto justify-center items-center">
        {resourceTabs.map((item) => (
          <li
            onClick={() => setActiveSubTab(item)}
            className={`text-eduBlack font-body font-medium ease-in-out duration-500 border-b-2 py-2 text-[14px] cursor-pointer ipad-under:text-xs ipad-under:py-1 ${item === activeSubTab
              ? "border-primary"
              : "border-transparent"
              }`}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
      <InfiniteScroll
        className="flex flex-col w-full h-full rounded-md gap-4 overflow-y-scroll"
        callBack={loadMorePosts}
        hasMoreData={showLoadMore}
        showLoading={resourceLoading}
      >
        {resources.length > 0 && resources?.map((resource, index) => (
          <div key={index}>
            <ResourceCard
              resource={resource}
              userId={loggedInUser?._id}
              key={resource._id}
              isSaved={savedResources.has(resource._id)}
              isResource={false}
            />
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
}
