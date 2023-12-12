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
import {
  getSelectedResFilters,
  setSelectedFilter,
} from "@/redux/ducks/resource.duck";
import { HubLeftPenal } from "../hub/components/leftPanel";
import { ResourceCard } from "./components/ResourceCard";
import HeaderNav from "@/components/headerNav";

const resourceTabs = ["Resources", "News", "Reading List"];

interface ResourceInfo {
  _id: string;
  title: string;
  publisher: string;
  isResource: boolean;
  tags: Array<{ _id: string; name: string }>;
}

export default function Resources(props: any) {

  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [savedResources, setSavedResources] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const selectedFilters: FilterOptionsState = useSelector(
    getSelectedResFilters
  );
  const [selectedResTab, setSelectedResTab] = useState<string>(resourceTabs[0])


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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosGet('/resource')
        // setResources(response.data);
        let fetchedRes = response.data
        switch (selectedResTab) {
          case 'Resources':
            fetchedRes = fetchedRes.filter((resource: ResourceInfo) => resource.isResource);
          break;
          case 'News':
            fetchedRes = fetchedRes.filter((resource: ResourceInfo) => !resource.isResource);
          break;
          case 'Reading List':
            const readingListIds = new Set(savedResources);
            fetchedRes = fetchedRes.filter((resource: ResourceInfo) => readingListIds.has(resource._id));
          break;
          default:
          // No additional filtering
          break;
        }
        setResources(fetchedRes);
        console.log('data fetched ', response.data);
      } catch (error) {
        console.log('Error fetching resource data ', error);
      }
    }
    fetchResources();

  },[selectedResTab, savedResources])

  useEffect(() => {  
    interface ReadingListItem {
      _id: string;
      title: string;
      link: string;
      publisher: string;
      isResource: boolean;
      tags: Array<string>
    }

    const fetchReadingList = async () => {
      try {
      const response = await axiosGet(`/user/${loggedInUser._id}/reading_list`);
      console.log('response data in fetch reading list ', response.data);
      setSavedResources(new Set(response.data.map((item:ReadingListItem) => item._id)));
      } catch (error) {
        console.log('Error fetching reading list data ', error);
      }
    };
  
      fetchReadingList();

    },[])

  console.log('saved resources ', savedResources);
  console.log(loggedInUser._id);
  // console.log('resource state ', resources);

  return (
    <>
       <div className="relative w-screen min-h-screen flex justify-center items-start bg-white overflow-x-hidden">
          <div className="relative max-w-[1640px] w-full h-auto flex flex-1 justify-start items-start">
            <div className="realtive flex flex-row flex-nowrap w-full">
              <div className="relative flex-col">
                <div className="relative w-[300px] min-h-screen p-4">
                  <HubLeftPenal />
                </div>
              </div>

              <div className="relative w-full flex flex-col items-center justify-start p-4">
                <>
                <div className="relative w-full">
                  <HeaderNav />
                </div>
                <div className="relative w-full flex flex-row flex-nowrapf h-[100px] justify-center items-center">
                <ul className="flex gap-6">
                    {resourceTabs.map((item) => (
                      <li
                        onClick={() => setSelectedResTab(item)}
                        className={`text-eduBlack font-body font-medium ease-in-out duration-500 border-b-2 py-2 text-[14px] cursor-pointer ${
                          item === selectedResTab
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        key={item}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                  {
                  
                    resources?.map((resource) => (
                    <ResourceCard 
                      resource={resource}
                      userId={loggedInUser._id}
                      isSaved={savedResources.has(resource._id)}
                    />
                  ))
                  
                  }
                </>
              </div>
            </div>
          </div>
        </div>
    </>
  );
} 