"use client";
import InfiniteScroll from "@/components/infiniteScroll";
import { requireAuthentication } from "@/components/requireAuthentication";
import {
  getNotificationOfUser,
  getTimeSensitiveNotification,
} from "@/service/user.service";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { PostModal } from "../forum/components/postModal";
import { useModal } from "@/hooks";
const Page = () => {
  const hubTab = ["All Notifications", "Following", "My Posts"];
  const [activeSubTab, setActiveSubTab] = useState(hubTab[0]);
  const [notifications, setNotifications] = useState<any>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [shouldFetchMoreNotification, setShouldFetchMoreNotification] =
    useState(false);
  const [notificationPaginationParm, setNotificationPaginationParm] = useState({
    page: 1,
    limit: 10,
  });
  const [
    timeSensitiveNotificationPaginationParm,
    setTimeSensitiveNotificationPaginationParm,
  ] = useState({
    page: 1,
    limit: 10,
  });
  const loggedInUser = useSelector(selectUserDetail);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [timeSensitiveNotifications, setTimeSensitiveNotifications] = useState(
    []
  );
  const [
    timeSensitiveNotificationsLoading,
    setTimeSensitiveNotificationsLoading,
  ] = useState(false);
  const [
    shouldFetchMoreTimeSensitiveNotification,
    setShouldFetchMoreTimeSensitiveNotification,
  ] = useState(false);
  const viewPostModal = useModal();

  const fetchNotification = async (pageNo?: number) => {
    setShowLoading(true);
    const notificationType =
      activeSubTab == "Following"
        ? "following"
        : activeSubTab == "My Posts"
        ? "my_post"
        : "all";

    const getNotificationResponse = await getNotificationOfUser(
      pageNo ? pageNo : notificationPaginationParm.page,
      notificationPaginationParm.limit,
      notificationType
    );
    if (getNotificationResponse.data.response_type == "success") {
      setNotifications((currentNotifications: any) =>
        currentNotifications.concat(getNotificationResponse.data.data)
      );
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
      }
    }
    setShowLoading(false);
  };

  const fetchTimeSensitiveNotification = async (pageNo?: number) => {
    setTimeSensitiveNotificationsLoading(true);
    const getNotificationResponse = await getTimeSensitiveNotification(
      pageNo ? pageNo : timeSensitiveNotificationPaginationParm.page,
      timeSensitiveNotificationPaginationParm.limit
    );
    if (
      getNotificationResponse &&
      getNotificationResponse.data.response_type == "success"
    ) {
      setTimeSensitiveNotifications((currentTimeSensitiveNotifications) =>
        currentTimeSensitiveNotifications.concat(
          getNotificationResponse.data.data
        )
      );
      setTimeSensitiveNotificationPaginationParm((parameter) => {
        return {
          ...parameter,
          page: parameter.page + 1,
        };
      });
      if (
        getNotificationResponse.data.data.length <
        timeSensitiveNotificationPaginationParm.limit
      ) {
        setShouldFetchMoreTimeSensitiveNotification(false);
      }
    }
    setTimeSensitiveNotificationsLoading(false);
  };

  useEffect(() => {
    setShouldFetchMoreNotification(true);
    setNotifications([]);
    setTimeSensitiveNotifications([]);
    fetchNotification(1);
    setNotificationPaginationParm((previousParam) => {
      return {
        ...previousParam,
        page: 1,
      };
    });
    if (activeSubTab == "All Notifications") {
      setTimeSensitiveNotificationPaginationParm((previousParam) => {
        return {
          ...previousParam,
          page: 1,
        };
      });
      setShouldFetchMoreTimeSensitiveNotification(true);
      fetchTimeSensitiveNotification(1);
    }
  }, [activeSubTab]);

  const getSemanticDescriptionFromEventType = (notificationType: string) => {
    switch (notificationType) {
      case "user_replied_to_your_comment":
        return "reply to your_comment";
      case "user_comments_on_your_post":
        return "commented on your post";
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
      return {
        postTitle: notification.postInfo?.[0]?.title,
        postId: notification.postInfo?.[0]?._id,
      };
    } else if (notification.commentsInfo?.[0].postInfo?.[0]?.title) {
      return {
        postTitle: notification.commentsInfo?.[0].postInfo?.[0]?.title,
        postId: notification.commentsInfo?.[0].postInfo?.[0]?._id,
      };
    }
  };

  return (
    <>
      <div>
        {viewPostModal.isOpen && (
          <PostModal viewPostModal={viewPostModal} postId={selectedPostId} />
        )}
        <ul className="flex justify-center gap-6">
          {hubTab.map((item,index) => (
            <li
              onClick={() => setActiveSubTab(item)}
              className={`text-eduBlack font-body font-medium ease-in-out duration-500 border-b-2 py-2 text-[14px] cursor-pointer ${
                item === activeSubTab ? "border-primary" : "border-transparent"
              }`}
              key={index}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="ml-[15px] w-full h-full ">
        <div className="text-[20px] font-[Hahmlet]">
          {activeSubTab == "All Notifications"
            ? activeSubTab
            : `${activeSubTab} Notifications`}
        </div>
        {!timeSensitiveNotificationsLoading &&
          timeSensitiveNotifications &&
          timeSensitiveNotifications?.length > 0 && (
            <>
              <p className="text-center font-[600] opacity-50 p-[10px]">
                Time Sensitive Notifications
              </p>
              <InfiniteScroll
                className="flex flex-col w-full h-1/3 rounded-md gap-4"
                callBack={fetchTimeSensitiveNotification}
                hasMoreData={shouldFetchMoreTimeSensitiveNotification}
                showLoading={showLoading}
              >
                <div className=" text-center  text-eduBlack">
                  <div className="flex flex-col w-full h-full rounded-md gap-4">
                    {timeSensitiveNotifications.map((notification: any,index:number) => {
                      return (
                          <div key={index} className="flex w-full p-4  bg-eduYellow rounded-[10px] bg-eduLightGray border-[2px] border-[#13222A] gap-2  justify-between ">
                            <div className="flex gap-3">
                              <img src="#" className="w-[17px]"></img>
                              <div className="flex flex-col text-left">
                                <div>
                                  Certificate Expiring Soon .{" "}
                                  <span className="opacity-[60%]">
                                    {moment(
                                      notification.documentInfo.expiration_date,
                                      "YYYYMMDD"
                                    ).fromNow()}
                                  </span>
                                </div>
                                <span className="font-[600] ">
                                  {notification.documentInfo.doc_name}{" "}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col  mr-[18px] underline text-end font-[600] ">
                              <a className="text-[#0F366D] cursor-pointer">
                                Remind me tomorrow
                              </a>
                              <a className="text-[#0F366D] cursor-pointer">
                                Dismiss
                              </a>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
              </InfiniteScroll>
            </>
          )}
        {/* new notification */}
        <p className="mt-[25px] text-center font-[600] opacity-50 p-[10px]">
          New Notifications
        </p>
        <InfiniteScroll
          className="flex flex-col w-full h-1/3 rounded-md gap-4"
          callBack={fetchNotification}
          hasMoreData={shouldFetchMoreNotification}
          showLoading={showLoading}
        >
          <div className=" text-center  text-eduBlack">
            <div className="flex flex-col w-full h-full rounded-md gap-4">
              {notifications?.map((notification: any, index: number) => {
                return (
                  <div
                    className="flex w-full p-4 rounded-[10px] bg-eduLightGray border-[1px] border-[#13222A] gap-2"
                    key={index}
                  >
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
                        {(notification.createdBy == loggedInUser._id
                          ? "You "
                          : notification.notificationFrom[0].username + " ") +
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
                          className="text-eduLightBlue font-[600] underline"
                          href={`/profile/${notification.notificationFrom[0]._id}`}
                        >
                          View Profile
                        </Link>
                        {notification.postInfo?.[0]?.title ||
                        notification.commentsInfo?.[0]?.postInfo?.[0]?.title ? (
                          <Link
                            href="#"
                            className="text-eduBlack opacity-[60%] font-[600] underline"
                            onClick={() => {
                              setSelectedPostId(
                                getPostTitle(notification)?.postId
                              );
                              viewPostModal.openModal();
                            }}
                          >
                            {getPostTitle(notification)?.postTitle}
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
      </div>
    </>
  );
};

export default requireAuthentication(Page);
