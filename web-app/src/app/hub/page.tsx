"use client";
import InfiniteScroll from "@/components/infiniteScroll";
import { requireAuthentication } from "@/components/requireAuthentication";
import { getNotificationOfUser } from "@/service/user.service";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import Link from "next/link";
const hubTab = ["All Notifications", "Following", "My Posts"];
const Page = () => {
  const [activeSubTab, setActiveSubTab] = useState(hubTab[0]);
  const [notifications, setNotifications] = useState<any>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [shouldFetchMoreNotification, setShouldFetchMoreNotification] =
    useState(false);
  const [notificationPaginationParm, setNotificationPaginationParm] = useState({
    page: 1,
    limit: 10,
  });

  const fetchNotification = async () => {
    setShowLoading(true);
    const notificationType =
      activeSubTab == "Following"
        ? "following"
        : activeSubTab == "My Posts"
        ? "my_post"
        : "all";
    const getNotificationResponse = await getNotificationOfUser(
      notificationPaginationParm.page,
      notificationPaginationParm.limit,
      notificationType
    );
    if (
      getNotificationResponse.data.response_type == "success" &&
      getNotificationResponse.data.data.length > 0
    ) {
      setNotifications(getNotificationResponse.data.data);
      setNotificationPaginationParm((notificationApiDetail) => {
        return {
          ...notificationApiDetail,
          page: notificationApiDetail.page + 1,
        };
      });
      if (
        getNotificationResponse.data.data.length <
        notificationPaginationParm.limit
      ) {
        setShouldFetchMoreNotification(false);
      } else {
        setShouldFetchMoreNotification(true);
      }
    }
    setShowLoading(false);
  };

  useEffect(() => {
    setShouldFetchMoreNotification(true);
    setNotifications([]);
    fetchNotification();
  }, [activeSubTab]);

  const getSemanticDescriptionFromEventType = (notificationType: string) => {
    switch (notificationType) {
      case "user_replied_to_your_comment":
        return "reply to your_comment";
      case "user_comments_on_your_post":
        return "commented on you post";
      case "user_you_follow_published_a_new_post":
        return ", who you follow, made a new post";
      case "user_who_you_follow_commented_on_a_post":
        return ", who you follow, commented on a post";
      case "user_commented_on_a_post_you_follow":
        return "commented on a post you follow";
      case "user_approved_your_request_to_follow_a_private_post":
        return "approved your request to follow their private post";
      case "user_requested_to_follow_your_private_post":
        return "user_requested_to_follow_your_private_post";
      case "user_followed_your_post":
        return "followed your post";
      case "user_followed_you":
        return "followed you";
    }
  };

  const getPostTitle = (notification: any) => {
    if (notification.postInfo?.[0]?.title) {
      return notification.postInfo?.[0]?.title;
    } else if (notification.commentsInfo?.[0].postInfo?.[0]?.title) {
      return notification.commentsInfo?.[0].postInfo?.[0]?.title;
    }
  };
  return (
    <>
      <div>
        <ul className="flex justify-center gap-6">
          {hubTab.map((item) => (
            <li
              onClick={() => setActiveSubTab(item)}
              className={`text-eduBlack font-body font-medium ease-in-out duration-500 border-b-2 py-2 text-[14px] ${
                item === activeSubTab ? "border-primary" : "border-transparent"
              }`}
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="ml-[15px] w-full h-full overflow-auto">
        <div className="text-[20px] font-[Hahmlet]">
          {activeSubTab == "All Notifications"
            ? activeSubTab
            : `${activeSubTab} Notifications`}
        </div>
        {/*  time sensitive notification */}
        <div className="text-center text-eduBlack">
          <p className="font-[600] opacity-50 p-[10px] text-eduBlack">
            Time Sensitive Notifications
          </p>
          <div className="flex w-full p-4  bg-eduYellow rounded-[10px] bg-eduLightGray border-[2px] border-[#13222A] gap-2 !cursor-pointer justify-between ">
            <div className="flex gap-3">
              <img src="#" className="w-[17px]"></img>
              <div className="flex flex-col text-left">
                <div>
                  Certificate Expiring Soon .{" "}
                  <span className="opacity-[60%]">in 10 days</span>
                </div>
                <span className="font-[600] ">Certificate Information </span>
              </div>
            </div>
            <div className="flex flex-col  mr-[18px] underline text-end font-[600] ">
              <a className="text-[#0F366D]">Remind me tomorrow</a>
              <a className="text-[#0F366D]">Dismiss</a>
            </div>
          </div>
        </div>
        <InfiniteScroll
          className="flex flex-col w-full h-full rounded-md gap-4"
          callBack={fetchNotification}
          hasMoreData={shouldFetchMoreNotification}
          showLoading
        >
          <div className="mt-[25px] text-center  text-eduBlack">
            <p className="font-[600] opacity-50 p-[10px]">New Notifications</p>
            <div className="flex flex-col w-full h-full rounded-md gap-4">
              {notifications.map((notification: any, index: number) => {
                index < 4;
                return (
                  <div className="flex w-full p-4 rounded-[10px] bg-eduLightGray border-[1px] border-[#13222A] gap-2 !cursor-pointer ">
                    <div className="w-[28px] mt-1 mr-3 ">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_SERVER_URL +
                          "/uploads/" +
                          notification?.notificationFrom[0]?.profile_img
                        }
                        className="rounded"
                      ></img>
                    </div>
                    <div className="flex flex-col text-start gap-3">
                      <span className="text-[20px] text-eduBlack font-headers">
                        {notification.notificationFrom[0].username +
                          " " +
                          getSemanticDescriptionFromEventType(
                            notification.notificationType
                          )}
                        <span className="opacity-[60%]">
                          {" "}
                          <span>&#8226;</span>{" "}
                          {moment(notification?.eventTime).fromNow()}
                        </span>
                      </span>
                      {notification.notificationType.indexOf("comment") !=
                        -1 && (
                        <span className="opacity-[60%]">
                          "
                          {notification.commentsInfo[0].content.length > 311
                            ? notification.commentsInfo[0].content.substring(
                                0,
                                311
                              ) + "..."
                            : notification.commentsInfo[0].content}
                          "{" "}
                        </span>
                      )}
                      <div className="flex gap-6">
                        <Link
                          className="text-[#0F366D] font-[600] underline"
                          href={`/profile/${notification.notificationFrom[0]._id}`}
                        >
                          View Profile
                        </Link>
                        {notification.postInfo?.[0]?.title ||
                        notification.commentsInfo?.[0]?.postInfo?.[0]?.title ? (
                          <Link
                            href="#"
                            className="text-eduBlack opacity-[60%] font-[600] underline"
                          >
                            {getPostTitle(notification)}
                          </Link>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>

        {/* older notification  */}
        {/* <div className="mt-[25px] text-center text-eduBlack">
          <p className="font-[600] opacity-50 p-[10px]">Older Notifications</p>
          <div className="flex flex-col w-full h-full rounded-md gap-4">
            <div className="flex w-full p-4 rounded-[10px] bg-eduLightGray gap-2 !cursor-pointer">
              <img src="#" className="w-[17px]"></img>
              <div className="flex flex-col text-start">
                <p>
                  Certificate Expiring Soon .{" "}
                  <span className="opacity-[60%]">in 10 days</span>
                </p>
                <p>Certificate Information </p>
              </div>
            </div>
            <div className="flex w-full p-4 rounded-[10px] bg-eduLightGray gap-2 !cursor-pointer">
              <img src="#" className="w-[17px]"></img>
              <div className="flex flex-col text-start">
                <p>
                  Certificate Expiring Soon .{" "}
                  <span className="opacity-[60%]">in 10 days</span>
                </p>
                <p>Certificate Information </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default requireAuthentication(Page);
