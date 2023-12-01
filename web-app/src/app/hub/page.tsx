"use client";
import InfiniteScroll from "@/components/infiniteScroll";
import { requireAuthentication } from "@/components/requireAuthentication";
import {
  dismissTimeSensitiveNotificationById,
  getNotificationOfUser,
  getTimeSensitiveNotification,
  remindMeTomorrowTimeSensitiveNotificationById,
} from "@/service/user.service";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import { PostModal } from "../forum/components/postModal";
import { useModal } from "@/hooks";
import { Loader } from "../signup/commonBlocks";
import { ProfileDialog } from "./components/profileDialog";
const Page = () => {
  const hubTab = ["All Notifications", "Following", "My Posts"];
  const [activeSubTab, setActiveSubTab] = useState(hubTab[0]);
  const loggedInUser = useSelector(selectUserDetail);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // states for new notification
  const [newNotificationLoader, setNewNotificationLoader] = useState(false);
  const [newNotifications, setNewNotifications] = useState<
    newAndOldNotificationType[]
  >([]);
  const [newNotificationPaginationParm, setNewNotificationPaginationParm] =
    useState({
      page: 1,
      limit: 10,
    });
  const [shouldFetchMoreNewNotification, setShouldFetchMoreNewNotification] =
    useState(false);

  // states for old notification
  const [oldNotifications, setOldNotifications] = useState<
    newAndOldNotificationType[]
  >([]);
  const [oldNotificationLoader, setOldNotificationLoader] = useState(false);
  const [oldNotificationPaginationParm, setOldNotificationPaginationParm] =
    useState({
      page: 1,
      limit: 10,
    });
  const [shouldFetchMoreOldNotification, setShouldFetchMoreOldNotification] =
    useState(false);

  // states for time sensitive notification
  const [timeSensitiveNotifications, setTimeSensitiveNotifications] = useState<
    timeSensitiveNotificationType[]
  >([]);
  const [
    timeSensitiveNotificationsLoading,
    setTimeSensitiveNotificationsLoading,
  ] = useState(false);
  const [
    shouldFetchMoreTimeSensitiveNotification,
    setShouldFetchMoreTimeSensitiveNotification,
  ] = useState(false);
  const [
    timeSensitiveNotificationPaginationParm,
    setTimeSensitiveNotificationPaginationParm,
  ] = useState({
    page: 1,
    limit: 10,
  });
  const [timeSensitiveNotificationAction, setTimeSensitiveNotificationAction] =
    useState<string[]>([]);
  const [refreshAndCloseTabDetected, setRefreshAndCloseTabDetected] =
    useState(false);
  const viewPostModal = useModal();
  const profileModal = useModal();

  const fetchNewNotification = async (pageNo?: number) => {
    setNewNotificationLoader(true);
    const notificationType =
      activeSubTab == "Following"
        ? "following"
        : activeSubTab == "My Posts"
        ? "my_post"
        : "all";
    let lastTime: string | null = localStorage.getItem(activeSubTab);
    if (!lastTime) {
      lastTime = new Date(0).getTime().toString();
    }
    const getNotificationResponse = await getNotificationOfUser(
      pageNo ? pageNo : newNotificationPaginationParm.page,
      newNotificationPaginationParm.limit,
      notificationType,
      true,
      lastTime
    );
    if (getNotificationResponse?.data?.response_type == "success") {
      setNewNotifications((previousNewNotification) => [
        ...previousNewNotification,
        ...getNotificationResponse.data.data,
      ]);
      setNewNotificationPaginationParm((params) => {
        return {
          ...params,
          page: params.page + 1,
        };
      });
      if (
        getNotificationResponse.data.data.length <
        newNotificationPaginationParm.limit
      ) {
        setShouldFetchMoreNewNotification(false);
      }
    }
    setNewNotificationLoader(false);
  };

  const fetchOldNotification = async (pageNo?: number) => {
    setOldNotificationLoader(true);
    const notificationType =
      activeSubTab == "Following"
        ? "following"
        : activeSubTab == "My Posts"
        ? "my_post"
        : "all";

    let lastTime: string | null = localStorage.getItem(activeSubTab);
    if (!lastTime) {
      lastTime = new Date(0).getTime().toString();
    }
    const getNotificationResponse = await getNotificationOfUser(
      pageNo ? pageNo : oldNotificationPaginationParm.page,
      oldNotificationPaginationParm.limit,
      notificationType,
      false,
      lastTime
    );
    if (getNotificationResponse?.data.response_type == "success") {
      setOldNotifications((previousNotifications) => [
        ...previousNotifications,
        ...getNotificationResponse.data.data,
      ]);
      setOldNotificationPaginationParm((params) => {
        return {
          ...params,
          page: params.page + 1,
        };
      });
      if (
        getNotificationResponse.data.data.length <
        newNotificationPaginationParm.limit
      ) {
        setShouldFetchMoreOldNotification(false);
      }
    }
    setOldNotificationLoader(false);
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
      setTimeSensitiveNotifications((currentTimeSensitiveNotifications) => [
        ...currentTimeSensitiveNotifications,
        ...getNotificationResponse.data.data,
      ]);
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
    setShouldFetchMoreNewNotification(true);
    setNewNotifications([]);
    setNewNotificationPaginationParm((previousParam) => {
      return {
        ...previousParam,
        page: 1,
      };
    });
    fetchNewNotification(1);

    setShouldFetchMoreOldNotification(true);
    setOldNotifications([]);
    setOldNotificationPaginationParm((previousParam) => {
      return {
        ...previousParam,
        page: 1,
      };
    });
    fetchOldNotification(1);

    setTimeSensitiveNotifications([]);
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
    return () => {
      localStorage.setItem(activeSubTab, new Date().getTime().toString());
    };
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

  const getPostTitle = (
    notification: newAndOldNotificationType
  ): {
    postTitle: string;
    postId: string;
  } => {
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
    } else {
      return {
        postId: "",
        postTitle: "",
      };
    }
  };

  // for track time, when user refresh the page or close the browser tab
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (
        window.location.href ==
        process.env.NEXT_PUBLIC_FRONTEND_URL + "/hub"
      ) {
        setRefreshAndCloseTabDetected(true);
      }
    });
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, [activeSubTab]);

  // for track time, when user change sub tab
  useEffect(() => {
    if (refreshAndCloseTabDetected) {
      localStorage.setItem(activeSubTab, new Date().getTime().toString());
    }
  }, [refreshAndCloseTabDetected]);

  const clickHandler = async (
    type: "Remind_me_tomorrow" | "dismiss",
    notificationId: string
  ) => {
    setTimeSensitiveNotificationAction((prev) => [
      ...(prev ? prev : []),
      notificationId,
    ]);
    if (type == "Remind_me_tomorrow") {
      remindMeTomorrowTimeSensitiveNotificationById(notificationId).then(
        (res) => {
          if (res && res.data.response_type == "success") {
            setTimeout(() => {
              setTimeSensitiveNotificationAction((prev) =>
                prev?.filter((id) => id != notificationId)
              );
              setTimeSensitiveNotifications((prev) =>
                prev.filter(
                  (notification) => notification._id != notificationId
                )
              );
            }, 2000);
          }
        }
      );
    } else {
      dismissTimeSensitiveNotificationById(notificationId).then((res) => {
        if (res && res.data.response_type == "success") {
          setTimeout(() => {
            setTimeSensitiveNotificationAction((prev) =>
              prev?.filter((id) => id != notificationId)
            );
            setTimeSensitiveNotifications((prev) =>
              prev.filter((notification) => notification._id != notificationId)
            );
          }, 3000);
        }
      });
    }
  };

  return (
    <>
      <div>
        {selectedUserId && (
          <ProfileDialog
            loggedInUser={{ _id: selectedUserId } as UserData}
            profileModal={profileModal}
          />
        )}
        {viewPostModal.isOpen && (
          <PostModal viewPostModal={viewPostModal} postId={selectedPostId} />
        )}
        <ul className="flex justify-center gap-6">
          {hubTab.map((item, index) => (
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

      <div className="ml-[15px] w-full h-full overflow-auto">
        <div className="text-[20px] font-[Hahmlet]">
          {activeSubTab == "All Notifications"
            ? activeSubTab
            : `${activeSubTab} Notifications`}
        </div>
        {activeSubTab == "All Notifications" && (
          <>
            <p
              className={`text-center font-[600] opacity-50 p-[10px] ${
                !timeSensitiveNotificationsLoading &&
                timeSensitiveNotifications.length == 0 &&
                "hidden"
              }`}
            >
              Time Sensitive Notifications
            </p>
            <InfiniteScroll
              className={`flex flex-col w-full max-h-[27%] rounded-md gap-4 ${
                !timeSensitiveNotificationsLoading &&
                timeSensitiveNotifications.length == 0 &&
                "hidden"
              }`}
              callBack={fetchTimeSensitiveNotification}
              hasMoreData={shouldFetchMoreTimeSensitiveNotification}
              showLoading={timeSensitiveNotificationsLoading}
            >
              <div className="text-center text-eduBlack">
                <div className="flex flex-col w-full h-full rounded-md gap-4">
                  {newNotificationLoader &&
                  newNotificationPaginationParm.page == 1 ? (
                    <div className="flex justify-center items-center">
                      <Loader />
                    </div>
                  ) : (
                    timeSensitiveNotifications.map(
                      (notification, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`flex w-full p-4  bg-eduYellow rounded-[10px] bg-eduLightGray border-[2px] border-[#13222A] gap-2  justify-between ${
                              timeSensitiveNotificationAction?.findIndex(
                                (ids) => ids == notification._id
                              ) != -1 && "opacity-60"
                            }`}
                          >
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
                            <div className="flex flex-col items-end mr-[18px] underline text-end font-[600] ">
                              <button
                                className="text-[#0F366D] cursor-pointer"
                                onClick={() =>
                                  clickHandler(
                                    "Remind_me_tomorrow",
                                    notification._id
                                  )
                                }
                                disabled={
                                  timeSensitiveNotificationAction?.findIndex(
                                    (ids) => ids == notification._id
                                  ) != -1
                                }
                              >
                                Remind me tomorrow
                              </button>
                              <button
                                className="text-[#0F366D] cursor-pointer"
                                onClick={() =>
                                  clickHandler("dismiss", notification._id)
                                }
                                disabled={
                                  timeSensitiveNotificationAction?.findIndex(
                                    (ids) => ids == notification._id
                                  ) != -1
                                }
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
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
          className={`flex flex-col w-full ${
            activeSubTab != "All Notifications"
              ? "max-h-[45%]"
              : !timeSensitiveNotificationsLoading &&
                timeSensitiveNotifications.length == 0
              ? "max-h-[45%]"
              : "max-h-[27%]"
          } rounded-md gap-4`}
          callBack={fetchNewNotification}
          hasMoreData={shouldFetchMoreNewNotification}
          showLoading={newNotificationLoader}
        >
          <div className="text-center  text-eduBlack">
            <div className="flex flex-col w-full h-full rounded-md gap-4">
              {newNotificationLoader &&
              newNotificationPaginationParm.page == 1 ? (
                <div className="flex justify-center items-center">
                  <Loader />
                </div>
              ) : !newNotificationLoader && newNotifications.length == 0 ? (
                <div className="flex w-full p-4 rounded-[10px] bg-eduLightGray border-[1px] border-[#13222A] gap-2 justify-center">
                  <span>No New Notifications Available...!</span>
                </div>
              ) : (
                newNotifications?.map((notification, index: number) => {
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
                          notification.commentsInfo?.[0]?.postInfo?.[0]
                            ?.title ? (
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
                })
              )}
            </div>
          </div>
        </InfiniteScroll>
        <p className="mt-[25px] text-center font-[600] opacity-50 p-[10px]">
          Old Notifications
        </p>
        <InfiniteScroll
          className={`flex flex-col w-full ${
            activeSubTab != "All Notifications"
              ? "max-h-[45%]"
              : !timeSensitiveNotificationsLoading &&
                timeSensitiveNotifications.length == 0
              ? "max-h-[45%]"
              : "max-h-[27%]"
          } rounded-md gap-4`}
          callBack={fetchOldNotification}
          hasMoreData={shouldFetchMoreOldNotification}
          showLoading={oldNotificationLoader}
        >
          <div className="text-center text-eduBlack">
            <div className="flex flex-col w-full h-full rounded-md gap-4">
              {oldNotificationLoader &&
              oldNotificationPaginationParm.page == 1 ? (
                <div className="flex justify-center items-center">
                  <Loader />
                </div>
              ) : (
                oldNotifications?.map((notification, index: number) => {
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
                            href={`#`}
                            onClick={() => {
                              setSelectedUserId(
                                notification.notificationFrom[0]._id
                              );
                              profileModal.openModal();
                            }}
                          >
                            View Profile
                          </Link>
                          {notification.postInfo?.[0]?.title ||
                          notification.commentsInfo?.[0]?.postInfo?.[0]
                            ?.title ? (
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
                })
              )}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default requireAuthentication(Page);
