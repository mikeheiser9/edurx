"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { axiosGet } from "@/axios/config";
// import { responseCodes, roleAccess, roleBasedForum } from "@/util/constant";
// import { Chip } from "@/components/chip";
// import InfiniteScroll from "@/components/infiniteScroll";
// import { requireAuthentication } from "@/components/requireAuthentication";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
// import { showToast } from "@/components/toast";
// import DashboardLayout from "@/components/dashboardLayout";
// import {
//   getSelectedForumFilters,
//   setSelectedFilter,
// } from "@/redux/ducks/forum.duck";
import { HubLeftPenal } from "../hub/components/leftPanel";
import { ResourceCard } from "./components/ResourceCard";
import HeaderNav from "@/components/headerNav";
import { LeftPanelWrapper } from "@/components/leftPanelWrapper";

const resourceTabs = ["Resources", "News", "Reading List"];

export default function Resources(props: any) {
  const router = useRouter();
  const loggedInUser = useSelector(selectUserDetail);
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [savedResources, setSavedResources] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);

  console.log({resources});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosGet("/resource/resources");
        setResources(response.data);
      } catch (error) {
        console.log("Error fetching resource data ", error);
      }
    };
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
        console.log("response data in fetch reading list ", response.data);
        setSavedResources(
          new Set(response.data.map((item: ReadingListItem) => item._id))
        );
      } catch (error) {
        console.log("Error fetching reading list data ", error);
      }
    };

    fetchReadingList();
  }, []);

  return (
    <>
    <div className="flex flex-col w-full">
    <div className="md:p-4 md:pb-0 h-[76px] md:block hidden">
     <div className="logo-desktop block ipad-under:hidden pl-7"><a className="inline-block" href="#"><img src="https://i.ibb.co/gwRZ6gm/edu-Rx-blue-1.png" alt="edu-Rx-blue-1"/></a></div>
      <div className="line w-full border-[2px] border-b-0 border-eduLightBlue h-[13px] mt-2.5 rounded-[6px_6px_0px_0px]" ></div>
    </div>
      <div className="flex md:p-4 md:px-5 w-full h-screen overflow-hidden md:max-h-[calc(100dvh_-_76px)]">
        <LeftPanelWrapper>
          <HubLeftPenal />{" "}
        </LeftPanelWrapper>

        <div className="flex-1 flex overflow-hidden flex-col gap-2">
          <>
            <HeaderNav />
            {resources.length>0 && resources?.map((resource) => (
              <ResourceCard
                resource={resource}
                userId={loggedInUser._id}
                key={resource._id}
                isSaved={savedResources.has(resource._id)}
                isResource={false}
              />
            ))}
          </>
        </div>
      </div>
      </div>
    </>
  );
}
