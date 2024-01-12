"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { ResourceCard } from "./components/ResourceCard";
import { getResources } from "@/service/resource.service";
import InfiniteScroll from "@/components/infiniteScroll";
import { setActiveLeftPanelTab } from "@/redux/ducks/forum.duck";
import NoDataComponent from "@/components/noData";

export default function Resources(props: any) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const resourceTabs = {
    resources: {
      key: "resources",
      label: "Resources",
    },
    news: {
      key: "news",
      label: "News",
    },
    reading_list: {
      key: "reading_list",
      label: "Reading List",
    },
  };
  const [activeSubTab, setActiveSubTab] = useState(resourceTabs.resources);

  // resource states
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceCurrentPage, setResourceCurrentPage] = useState(1);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [showNoData, setShowNoData] = useState(true)
  const pageResourcelimit = 5;

  const fetchResources = async (page: number = 1) => {
    setResourceLoading(true);
    setShowNoData(true)
    try {
      const response = await getResources(page, 5, activeSubTab.key);
      if (response.data.response_type == "success") {
        setResources((pre) => [...pre, ...response.data.data]);
        if (response.data.data.length < pageResourcelimit) {
          setShowLoadMore(false);
        }

        setResourceCurrentPage((pre) => pre + 1);
      }
    } catch (error) {
      console.log("Error fetching resource data ", error);
    }
    setShowNoData(false)
    setResourceLoading(false);
  };

  // For GetResources based on Active SubTabs
  useEffect(() => {
    setResourceCurrentPage(1);
    setResources([]);
    setShowLoadMore(true);
    fetchResources();
  }, [activeSubTab]);

  useEffect(() => {
    dispatch(setActiveLeftPanelTab({ label: "Resources" }));
  }, []);

  // useEffect(() => {
  //   interface ReadingListItem {
  //     _id: string;
  //     title: string;
  //     link: string;
  //     publisher: string;
  //     tags: Array<string>;
  //   }

  //   const fetchReadingList = async () => {
  //     try {
  //       const response = await axiosGet(
  //         `/user/${loggedInUser._id}/reading_list`
  //       );

  //       console.log(response.data.map((item: ReadingListItem) => item._id));

  //       setSavedResources(
  //         new Set(response.data.map((item: ReadingListItem) => item._id))
  //       );
  //     } catch (error) {
  //       console.log("Error fetching reading list data ", error);
  //     }
  //   };

  //   fetchReadingList();
  // }, []);

  const loadMorePosts = async () => {
    resourceCurrentPage !== 1 && (await fetchResources(resourceCurrentPage));
  };

  return (
    <>
      <ul className="flex gap-6 ipad-under:mx-auto justify-center items-center mb-4">
        {Object.values(resourceTabs).map((tab) => (
          <li
            onClick={() => setActiveSubTab(tab)}
            className={`text-eduBlack font-body font-medium ease-in-out duration-500 border-b-2 py-2 text-[14px] cursor-pointer ipad-under:text-xs ipad-under:py-1 ${
              tab.key === activeSubTab.key
                ? "border-primary"
                : "border-transparent"
            } `}
            key={tab.key}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      <InfiniteScroll
        className="flex flex-col w-full h-full rounded-md gap-4 overflow-y-scroll"
        callBack={loadMorePosts}
        hasMoreData={showLoadMore}
        showLoading={resourceLoading}
      >
        {resources.length > 0 ?
          resources?.map((resource, index) => (
            <div key={index}>
              <ResourceCard
                resource={resource}
                userId={loggedInUser?._id}
                key={resource._id}
              />
            </div>
          )): !showNoData &&  <NoDataComponent title={`No Data Found For ${activeSubTab.label} `}/>}
      </InfiniteScroll>
    </>
  );
}
