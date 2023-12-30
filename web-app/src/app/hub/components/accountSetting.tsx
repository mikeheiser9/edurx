import { Modal } from "@/components/modal";
import { Switch } from "@/components/switch";
import { showToast } from "@/components/toast";
import { resetModalState, selectModalState } from "@/redux/ducks/modal.duck";
import { selectToast } from "@/redux/ducks/toast.duck";
import {
  getAccountSettingsByAPI,
  updateAccountSettingsByAPI,
} from "@/service/user.service";
import { NOTIFICATION_TYPES, responseCodes } from "@/util/constant";
import { getFullName } from "@/util/helpers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  accountSettingModal: UseModalType;
  userData: UserData;
}

interface NotificationTypeObj {
  label: string;
  types: {
    value: string;
    label: string;
  }[];
}

const notificationCategories: {
  [name: string]: NotificationTypeObj;
} = {
  post: {
    label: "Posts",
    types: [
      {
        value: NOTIFICATION_TYPES.USER_COMMENTED_ON_YOUR_POST,
        label: "Comments on you posts",
      },
      {
        value: NOTIFICATION_TYPES.USER_FOLLOWED_YOUR_POST,
        label: "Follows on your posts",
      },
      {
        value: NOTIFICATION_TYPES.USER_REQUESTED_TO_FOLLOW_YOUR_PRIVATE_POST,
        label: "Requests to follow your post",
      },
      {
        value: NOTIFICATION_TYPES.USER_REPLIED_TO_YOUR_COMMENT,
        label: "Replies to comments / mentions",
      },
      {
        value: NOTIFICATION_TYPES.USER_APPROVED_FOLLOW_REQUEST,
        label: "Approvals to follow a post",
      },
    ],
  },
  following: {
    label: "Following",
    types: [
      {
        value: NOTIFICATION_TYPES.USER_YOU_FOLLOW_PUBLISHED_NEW_POST,
        label: "Someone you follow made a new post",
      },
      {
        value: NOTIFICATION_TYPES.USER_YOU_FOLLOW_COMMENTED_ON_POST,
        label: "Someone you follow commented on a post",
      },
    ],
  },
  followers: {
    label: "Followers",
    types: [
      {
        value: NOTIFICATION_TYPES.USER_FOLLOWED_YOU,
        label: "Someone followed you",
      },
    ],
  },
};

export const AccountSetting = ({ accountSettingModal, userData }: Props) => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModalState);
  const [settings, setSettings] = useState<any>();
  const [settingSubmitLoader, setSettingSubmitLoader] = useState(false);
  const allowedTypes = settings?.allowedTypes;
  const toast = useSelector(selectToast);
  const onToggle = (type: any) => {
    let values: string[] = [...(allowedTypes ?? [])];
    if (allowedTypes?.includes(type?.value)) {
      values = allowedTypes.filter((t: string) => t !== type?.value) ?? [];
    } else {
      values.push(type?.value);
    }
    setSettings((pre: any) => {
      return {
        ...pre,
        allowedTypes: values,
      };
    });
  };

  const Footer = () => <div className="flex justify-center items-center"></div>;

  useEffect(() => {
    getAccountSettingsByAPI()
      .then((response) => {
        if (response.status === responseCodes.SUCCESS) {
          setSettings({ allowedTypes: response.data?.data.allowedTypes });
        }
      })
      .catch((error) => {
        console.error("Unable to retrieve settings", error);
        showToast.error(
          (error as Error).message || "Unable to retrieve settings"
        );
      });
  }, []);

  const handleClick = async () => {
    setSettingSubmitLoader(true);
    await updateAccountSettingsByAPI(settings);
    setTimeout(() => {
      setSettingSubmitLoader(false);
    }, 3000);
  };

  useEffect(() => {
    if (modal?.isOpen && modal?.type === "accountSettingModal") {
      accountSettingModal.openModal();
    }
    return () => {
      dispatch(resetModalState());
    };
  }, [modal]);

  return (
    <Modal
      headerTitle={`Account Settings | ${getFullName(
        userData?.first_name,
        userData?.last_name
      )}`}
      visible={accountSettingModal.isOpen}
      onClose={accountSettingModal.closeModal}
      modalClassName="md:!w-2/6"
      showFooter={false}
      resetReduxModalOnClose
    >
      <div className="flex gap-4 flex-col">
        <div className="text-eduBlack flex gap-2 flex-col">
          <span className="font-headers font-medium text-xl text-eduBlack">
            Your Plan
          </span>
          <span className="font-medium">Coming Soon...</span>
        </div>
        <hr className="text-black" />
        <div className="text-eduBlack flex gap-2 flex-col">
          <span className="font-headers font-medium text-xl text-eduBlack">
            Notification Settings
          </span>

          <div className="flex flex-col gap-4">
            {Object.keys(notificationCategories).map((item) => (
              <React.Fragment key={item}>
                <div className="flex text-eduBlack font-medium flex-col gap-2">
                  <span className="text-sm">
                    {notificationCategories[item].label}
                  </span>
                  {notificationCategories[item].types?.map((type) => (
                    <div className="flex flex-col gap-1" key={type?.value}>
                      <span className="text-[10px]">{type?.label}</span>
                      <Switch
                        checked={allowedTypes?.includes(type?.value)}
                        onChange={() => onToggle(type)}
                      />
                    </div>
                  ))}
                </div>
                <hr className="text-black last:hidden" />
              </React.Fragment>
            ))}
          </div>
          <div>
            <div className="flex justify-center ">
              <button
                className={`bg-eduBlack text-white border-eduBlack border-[1.5px] my-3 rounded-[10px] py-1 w-[150px] m-auto text-[16px]  font-body transition-colors duration-500 disabled:opacity-70 `}
                onClick={handleClick}
                disabled={settingSubmitLoader}
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
