"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { axiosGet } from "@/axios/config";
import { responseCodes, roleAccess, roleBasedForum } from "@/util/constant";
import { Chip } from "@/components/chip";
import InfiniteScroll from "@/components/infiniteScroll";
import { requireAuthentication } from "@/components/requireAuthentication";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { showToast } from "@/components/toast";
import DashboardLayout from "@/components/dashboardLayout";
import {
  getSelectedForumFilters,
  setSelectedFilter,
} from "@/redux/ducks/forum.duck";
import { HubLeftPenal } from "../hub/components/leftPanel";
import { ResourceCard } from "./components/ResourceCard";
import HeaderNav from "@/components/headerNav";

const resourceTabs = ["Resources", "News", "Reading List"];


export default function Resources(props: any) {
  const router = useRouter();
  const loggedInUser = useSelector(selectUserDetail);
  const [resources, setResources] = useState<ResourceInfo[]>([]);

  console.log(loggedInUser);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosGet('/resource')
        setResources(response.data);
        console.log('data fetched ', response.data);
      } catch (error) {
        console.log('Error fetching data ', error);
      }
    }
    fetchResources();
  },[])

  console.log('resource state ', resources);

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

              <div className="w-full flex flex-col items-center justify-start p-4">
                <>
                <div>
                  <HeaderNav />
                </div>
                {resources?.map((resource) => (
                  <ResourceCard 
                    resource={resource}
                    userId={loggedInUser._id}
                    key={resource._id}
                    title={resource.title}
                    publisher={resource.publisher}
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