import InputField from "@/components/input";
import { TextArea } from "@/components/textArea";
import { FormikHelpers, useField } from "formik";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import instagram from "../../../assets/icons/instagram.svg";
import linkedin from "../../../assets/icons/linkedin.svg";
import x from "../../../assets/icons/twitter.svg";
import facebook from "../../../assets/icons/facebook.svg";
import website from "../../../assets/icons/earthIcon.svg";
import {
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { getStaticImageUrl } from "@/util/helpers";
import { allowedFileTypes, availableFor } from "@/util/constant";
import { Switch } from "@/components/switch";

const socialMediaIcons: socials = {
  linkedin,
  instagram,
  x,
  facebook,
  website,
};
const labelProps = {
  className: "text-eduBlack font-body text-[16px] mb-[5px]",
};

const About = (): React.JSX.Element => {
  const socialMediaPlaceHolder={
    linkedin:"https://linkedin.com/in/${username}",
    instagram:"https://instagram.com/${username}",
    x:"https://twitter.com/${username}",
    facebook:"https://facebook.com/username-1234",
    website:"https://example.com"
  }

  return (
    <React.Fragment>
      <TextArea
        label="Personal Bio"
        placeholder="Tell us about yourself"
        name="personal_bio"
        className="w-full resize-y"
        isFormikField
      />
      <InputField
        name="contact_email"
        placeholder="example@gmail.com"
        type="text"
        label="Preferred Contact Email"
        maxLength={80}
      />
      <InputField
        name="username"
        placeholder="username"
        type="text"
        label="Username"
        maxLength={80}
      />
      <div className="mt-6">
        <div className="text-sm mt-2 grid grid-cols-[5%,1fr] gap-x-5 gap-y-5">
          {Object.keys(socialMediaIcons).map((socialMedia: string) => (
            <>
              <span className="!bg-eduYellow flex justify-center rounded-full h-9 w-9">
                <Image
                  src={
                    socialMediaIcons[
                      socialMedia as keyof typeof socialMediaIcons
                    ] as keyof StaticImageData
                  }
                  alt={socialMedia}
                  className="w-5"
                />
              </span>
              <InputField
                className="flex"
                name={`socials.${socialMedia}`}
                placeholder={(socialMediaPlaceHolder as any)?.[socialMedia]}
                maxLength={100}
                onKeyDown={(event) => {
                  if (event.code === "Space") event.preventDefault();
                }}
              />
            </>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

const Education = ({
  values,
  isListView,
  setIsListView,
  userData,
  actions,
  setSaveAndAddAnotherButtonPressed,
  saveAndAddAnotherButtonPressedRef,
}: {
  values: education;
  isListView: boolean;
  setIsListView?: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData;
  actions: FormikHelpers<education>;
  setSaveAndAddAnotherButtonPressed: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  saveAndAddAnotherButtonPressedRef:
    | React.MutableRefObject<React.LegacyRef<HTMLButtonElement>>
    | React.LegacyRef<HTMLButtonElement>
    | null;
}): React.JSX.Element => {
  const onEdit = (value: education) => {
    setIsListView?.(false);
    actions.setValues({
      ...value,
      start_date: value?.start_date
        ? moment(value?.start_date)?.format("YYYY-MM")
        : "",
      end_date: value?.end_date
        ? moment(value?.end_date).format("YYYY-MM")
        : "",
    });
  };
  useEffect(() => {
    if (userData?.educations && userData?.educations.length > 0) {
      setIsListView?.(true);
    } else {
      setIsListView?.(false);
    }
  }, []);
  const addMore = () => {
    setIsListView?.(false);
    actions.resetForm();
  };
  const ListView = () => (
    <>
      {userData?.educations?.map((value: education) => (
        <div className="flex gap-x-6" key={value?._id || Date.now()}>
          <div className="flex flex-1 flex-col text-eduBlack text-[16px] font-headers gap-1">
            <span className="text-lg capitalize">{value.school_name}</span>
            <span className="text-eduBlack text-[14px] font-body ">
              {value.field_of_study}
            </span>
            {value?.activities?.length > 0 && (
              <span className="text-eduBlack/60 text-[14px] font-body font-[400]">
                {`${value?.activities?.substring(0, 50)} ${
                  value?.activities?.length > 50 ? "..." : ""
                }  `}
              </span>
            )}
            <div>
              <span className="text-eduBlack/60 text-[14px] font-body font-[400]">
                {moment(value?.start_date).format("YYYY")}
              </span>
              {" - "}
              <span className="text-eduBlack/60 text-[14px] font-body font-[400]">
                {value?.is_in_progress
                  ? "Present"
                  : moment(value?.start_date).format("YYYY")}
              </span>
            </div>
          </div>
          <div className="flex p-6 py-2 justify-end">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-eduBlack cursor-pointer"
              onClick={() => onEdit(value)}
            />
          </div>
        </div>
      ))}
      <div className="flex gap-x-2 my-4">
        <span
          className="bg-eduYellow rounded-xl cursor-pointer w-10 h-10 flex justify-center"
          onClick={addMore}
        >
          <FontAwesomeIcon icon={faPlus} className="text-black self-center" />
        </span>
        <span
          className="cursor-pointer text-[16px] text-eduBlack/60 font-body p-2 bg-eduLightGray w-[250px] rounded-[10px]"
          onClick={addMore}
        >
          Add another
        </span>
      </div>
    </>
  );

  const executedSaveAndAddAnother = () => {
    setSaveAndAddAnotherButtonPressed(true);
    (
      saveAndAddAnotherButtonPressedRef as React.MutableRefObject<
        React.LegacyRef<HTMLButtonElement>
      > as any
    )?.current?.click();
  };
  return (
    <React.Fragment>
      <div className="flex gap-2 flex-col ">
        {isListView && userData?.educations?.length ? (
          <ListView />
        ) : (
          <>
            <div className="w-full flex justify-end">
              {!isListView &&
                userData?.educations &&
                userData?.educations?.length > 0 && (
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="text-eduBlack text-[24px] cursor-pointer animate-fade-in-down"
                    onClick={() => setIsListView?.(true)}
                  />
                )}
            </div>
            <InputField
              type="text"
              name="school_name"
              label="School"
              maxLength={120}
              labelProps={labelProps}
              mandatory
            />
            <InputField
              type="text"
              name="degree"
              maxLength={20}
              label="Degree"
              labelProps={labelProps}
            />
            <InputField
              type="text"
              name="field_of_study"
              label="Field of Study"
              maxLength={120}
              labelProps={labelProps}
              mandatory
            />
            <div className="flex flex-auto gap-4">
              <div className="flex flex-col flex-1">
                <InputField
                  label="Start Date"
                  name="start_date"
                  type="month"
                  // className="dark:[color-scheme:dark]"
                  labelProps={labelProps}
                  mandatory
                />
                <div className="flex items-center text-eduBlack font-body mt-[5px]">
                  <li className="animate-fade-in-down text-sm font-normal text-eduBlack flex ">
                    <input
                      id="is_in_progress"
                      name="is_in_progress"
                      type="checkbox"
                      checked={values.is_in_progress}
                      className="w-4 h-4 transition-colors duration-100 ease-in-out peer shrink-0 focus:outline-eduYellow appearance-none rounded-md bg-eduYellow checked:bg-eduYellow cursor-pointer"
                      onChange={() => {
                        actions.setFieldValue(
                          "is_in_progress",
                          !values.is_in_progress
                        );
                      }}
                    />
                    <svg
                      className="relative peer-checked:!fill-eduBlack fill-transparent transition-colors duration-100 ease-in-out inline w-4 h-4 p-0.5 pointer-events-none left-[-16px]"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      clip="10"
                    >
                      <path
                        // fill="currentColor"
                        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                      />
                    </svg>
                  </li>
                  <label
                    className="cursor-pointer !font-body"
                    htmlFor="is_in_progress"
                  >
                    In Progress
                  </label>
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <InputField
                  label="End Date (or expected)"
                  name="end_date"
                  className="disabled:opacity-60"
                  type="month"
                  labelProps={labelProps}
                  disabled={values.is_in_progress}
                  mandatory
                />
              </div>
            </div>
            <TextArea
              label="Activities and Societies"
              name="activities"
              className="w-full resize-y"
              isFormikField={true}
            />
            <div className="flex gap-x-2 my-4">
              <span
                className="bg-eduYellow rounded-xl cursor-pointer w-10 h-10 flex justify-center"
                onClick={executedSaveAndAddAnother}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-black self-center"
                />
              </span>
              <button
                type="submit"
                className="hidden"
                form={userData?._id}
                ref={
                  saveAndAddAnotherButtonPressedRef as React.LegacyRef<HTMLButtonElement>
                }
              ></button>
              <span
                className=" cursor-pointer text-[16px] text-eduBlack/60 font-body p-2 bg-eduLightGray w-[250px] rounded-[10px]"
                onClick={executedSaveAndAddAnother}
              >
                Save and Add Another
              </span>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

const UserDocs = ({
  userData,
  isListView,
  setIsListView,
  currentSection,
  actions,
  values,
  setSaveAndAddAnotherButtonPressed,
  saveAndAddAnotherButtonPressedRef,
}: {
  userData: any;
  isListView: boolean;
  setIsListView?: React.Dispatch<React.SetStateAction<boolean>>;
  currentSection: keyof profileSections;
  actions: FormikHelpers<userDocs>;
  values: userDocs;
  setSaveAndAddAnotherButtonPressed: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  saveAndAddAnotherButtonPressedRef:
    | React.MutableRefObject<React.LegacyRef<HTMLButtonElement>>
    | React.LegacyRef<HTMLButtonElement>
    | null;
}): React.JSX.Element => {
  let dataKey: keyof UserData =
    currentSection === "certifications" ? "certificates" : "licenses";
  let showIcon = userData?.[dataKey]?.length > 0;

  const onEdit = (value: userDocs) => {
    setIsListView?.(false);
    actions.setValues({
      ...value,
      issue_date: value?.issue_date
        ? moment(value.issue_date)?.format("YYYY-MM")
        : "",
      expiration_date: value?.expiration_date
        ? moment(value.expiration_date)?.format("YYYY-MM")
        : "",
    });
  };

  const addMore = () => {
    setIsListView?.(false);
    actions.resetForm();
  };

  const ListView = () => (
    <>
      {userData?.[dataKey]?.map((value: userDocs) => (
        <div className="flex gap-x-6" key={value?._id || Date.now()}>
          {/* <div className="flex">
            <FontAwesomeIcon
              icon={faFileCircleCheck}
              className="text-white w-10 h-10"
            />
          </div> */}
          <div className="flex flex-1 flex-col text-eduBlack text-[16px] font-headers gap-1">
            <span className="text-lg capitalize">{value.doc_name}</span>
            <span className="text-eduBlack/60 text-[14px] font-body capitalize">
              {value.issuer_organization}
            </span>
            {value?.issue_date && (
              <span className="text-eduBlack/60 text-[14px] font-body capitalize">
                Issued {moment(value?.issue_date).format("DD/MM/YYYY")}
              </span>
            )}
            {(value?.doc_id?.length as number) > 0 && (
              <span className="text-eduBlack/60 text-[14px] font-body capitalize">
                Credential ID {value?.doc_id || "-"}
              </span>
            )}
          </div>
          <div className="flex p-4 py-2 justify-end">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-eduBlack cursor-pointer"
              onClick={() => onEdit(value)}
            />
          </div>
        </div>
      ))}
      <div className="flex gap-x-4 my-4">
        <span
          className="bg-eduYellow rounded-xl cursor-pointer w-10 h-10 flex justify-center"
          onClick={addMore}
        >
          <FontAwesomeIcon icon={faPlus} className="self-center text-black" />
        </span>
        <span
          className="cursor-pointer text-eduBlack/60 p-2 px-6 bg-eduLightGray w-[250px] rounded-[10px]"
          onClick={addMore}
        >
          Add another
        </span>
      </div>
    </>
  );

  useEffect(() => {
    if (userData?.[dataKey] && userData?.[dataKey]?.length > 0) {
      setIsListView?.(true);
    } else {
      setIsListView?.(false);
    }
  }, [dataKey]);

  const executedSaveAndAddAnother = () => {
    setSaveAndAddAnotherButtonPressed(true);
    (
      saveAndAddAnotherButtonPressedRef as React.MutableRefObject<
        React.LegacyRef<HTMLButtonElement>
      > as any
    )?.current?.click();
  };

  return (
    <div className="flex gap-4 flex-col">
      {isListView && userData?.[dataKey]?.length > 0 ? (
        <ListView />
      ) : (
        <>
          <div className="w-full flex justify-end">
            {showIcon && (
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="!text-eduBlack cursor-pointer animate-fade-in-down text-[24px]"
                onClick={() => setIsListView?.(true)}
              />
            )}
          </div>
          <InputField
            type="text"
            name="doc_name"
            maxLength={120}
            placeholder="Enter name"
            label="Name"
            labelProps={labelProps}
            mandatory
          />
          <InputField
            type="text"
            maxLength={120}
            name="issuer_organization"
            placeholder="Enter issuer"
            label="Issuing Organization"
            labelProps={labelProps}
            mandatory
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <InputField
                label="Issue Date"
                name="issue_date"
                type="month"
                // className="dark:[color-scheme:dark]"
                labelProps={labelProps}
                mandatory
              />
            </div>
            <div className="flex flex-col">
              <InputField
                label="Expiration Date"
                name="expiration_date"
                className="disabled:opacity-50"
                type="month"
                labelProps={labelProps}
                disabled={values.has_no_expiry}
              />
            </div>
            <div className="flex items-center text-eduBlack/60">
              <li className="animate-fade-in-down text-sm font-normal text-eduBlack flex ">
                <input
                  id="has_no_expiry"
                  name="has_no_expiry"
                  type="checkbox"
                  checked={values.has_no_expiry}
                  className="w-4 h-4 transition-colors duration-100 ease-in-out peer shrink-0 focus:outline-eduYellow appearance-none rounded-md bg-eduYellow checked:bg-eduYellow cursor-pointer"
                  onChange={() => {
                    actions.setFieldValue(
                      "has_no_expiry",
                      !values.has_no_expiry
                    );
                  }}
                />
                <svg
                  className="relative peer-checked:!fill-eduBlack fill-transparent transition-colors duration-100 ease-in-out inline w-4 h-4 p-0.5 pointer-events-none left-[-16px]"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  clip="10"
                >
                  <path
                    // fill="currentColor"
                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                  />
                </svg>
              </li>
              <label
                className="cursor-pointer !font-body"
                htmlFor="has_no_expiry"
              >
                No Expiry
              </label>
            </div>
          </div>
          <InputField
            type="text"
            name="doc_id"
            maxLength={80}
            label="Credential ID"
            placeholder="Enter credential ID"
            labelProps={labelProps}
          />
          <InputField
            type="text"
            name="doc_url"
            // maxLength={160}
            label="Credential URL"
            placeholder="Enter credential URL"
            labelProps={labelProps}
          />
          <div className="flex gap-x-2 my-4">
            <span
              className="bg-eduYellow rounded-xl cursor-pointer w-10 h-10 flex justify-center"
              onClick={executedSaveAndAddAnother}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-black self-center"
              />
            </span>
            <button
              type="submit"
              className="hidden"
              form={userData?._id}
              ref={
                saveAndAddAnotherButtonPressedRef as React.LegacyRef<HTMLButtonElement>
              }
            ></button>
            <span
              className=" cursor-pointer text-[16px] text-eduBlack/60 font-body p-2 bg-eduLightGray w-[250px] rounded-[10px]"
              onClick={executedSaveAndAddAnother}
            >
              Save and Add Another
            </span>
          </div>
        </>
      )}
    </div>
  );
};

const DropZone = ({
  img_type,
  values,
  actions,
}: {
  img_type: keyof profileImages;
  values: profileImages;
  actions: FormikHelpers<profileImages>;
}) => {
  const [imgPreview, setImgPreview] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e?.preventDefault();
    errorMessage && setErrorMessage(null);
    const file = e.target?.files?.[0];

    if (!file) return;
    if (!allowedFileTypes.includes(file?.type)) {
      setErrorMessage(
        `${file.type} is not allowed, Only ${allowedFileTypes?.join(
          ", "
        )} acceptable`
      );
      return;
    }
    const isSizeValidated = validateImageSize(file);
    const isPixelsValidated = await validatePixels(URL.createObjectURL(file));
    if (isSizeValidated && isPixelsValidated) {
      actions.setFieldValue(img_type, file);
    }
  };

  const validatePixels = (imgBlob: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new window.Image();
      img.src = imgBlob;
      let maxAllowedPixels = {
        height: img_type === "profile_img" ? 500 : 250,
        width: img_type === "profile_img" ? 500 : 1400,
      };
      img.onload = () => {
        if (
          img.height > maxAllowedPixels.height ||
          img.width > maxAllowedPixels.width
        ) {
          const errorMessage = `Image dimensions must not exceed ${
            img_type === "profile_img" ? "500x500" : "1400x250"
          } pixels`;
          setErrorMessage(errorMessage);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        setErrorMessage("Failed to load image");
        resolve(false);
      };
    });
  };

  const validateImageSize = (file: File) => {
    if (!file) return false;
    let maxSize =
      img_type === "profile_img" ? 8 * 1024 * 1024 : 18 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage(
        `Image size must not exceed ${img_type === "profile_img" ? 8 : 18}MB`
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!values?.[img_type] || typeof values?.[img_type] === "string") return;
    const imgBlob = URL.createObjectURL(values[img_type] as Blob);
    setImgPreview((pre: any) => {
      return {
        ...pre,
        [img_type]: imgBlob,
      };
    });
    // free memory when this component is unmounted
    return () => URL.revokeObjectURL(imgBlob);
  }, [values]);

  return (
    <>
      <div className="flex items-center w-full relative">
        <label
          htmlFor={img_type}
          className={`${
            img_type === "profile_img" ? "w-1/5" : "w-full"
          } flex h-[12rem] flex-col overflow-hidden items-center justify-center min-h-[10rem] border transition-colors duration-300 border-white border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-white dark:hover:bg-gray-600`}
        >
          {values[img_type] ? (
            <div className="flex items-center justify-center">
              <Image
                className="object-cover w-full h-fit max-h-fit transition-all duration-300 ease-in-out"
                height={800}
                width={800}
                alt={img_type}
                src={
                  imgPreview?.[img_type]
                    ? imgPreview?.[img_type]
                    : getStaticImageUrl(values[img_type] as string)
                }
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-5">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            </div>
          )}
          <input
            accept="image/jpeg,image/jpg,image/gif,image/png"
            id={img_type}
            type="file"
            name={img_type}
            className="hidden"
            onChange={onFileSelect}
          />
        </label>
      </div>
      <span
        className={`text-red-500 capitalize text-sm animate-fade-in-down ${
          errorMessage ? "visible" : "hidden"
        }`}
      >
        {errorMessage}
      </span>
    </>
  );
};

const ProfileImages = ({
  values,
  actions,
  availableFor,
  setAvailableFor,
}: {
  values: profileImages;
  actions: FormikHelpers<profileImages>;
  availableFor: {
    Mentorship: boolean;
    Research: boolean;
    Collaboration: boolean;
  };
  setAvailableFor: React.Dispatch<
    React.SetStateAction<{
      Mentorship: boolean;
      Research: boolean;
      Collaboration: boolean;
    }>
  >;
}): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-4 mb-3">
      <div className="flex flex-col items-start gap-2">
        <span className="text-eduBlack font-body text-[16px]">
          Upload Profile Picture
        </span>
        <DropZone img_type="profile_img" values={values} actions={actions} />
        <span className="text-eduBlack/60 text-[12px] font-body">
          (Image file should not exceed 500x500 pixels or 8MB)
        </span>
      </div>
      <span className="w-full border border-eduBlack/60" />
      <div className="flex flex-col items-start gap-2">
        <span className="text-eduBlack font-body text-[16px]">
          Upload Banner Image
        </span>
        <DropZone img_type="banner_img" values={values} actions={actions} />
        <span className="text-eduBlack/60 text-[12px] font-body">
          (Image file should not exceed 1400x250 pixels or 18MB)
        </span>
      </div>
      <span className="w-full border border-eduBlack/60" />
      <div className="flex flex-col gap-2">
        <span className="text-eduBlack font-body text-[16px]">
          Available for
        </span>
        {/* {notificationCategories[item].types?.map((type) => ( */}
        <div className="flex flex-col gap-1" key={"df"}>
          <span className="text-[10px]">Mentorship</span>
          <Switch
            checked={availableFor.Mentorship}
            onChange={() =>
              setAvailableFor((pre) => {
                return {
                  ...pre,
                  Mentorship: !pre.Mentorship,
                };
              })
            }
          />
          <span className="text-[10px]">Research</span>
          <Switch
            checked={availableFor.Research}
            onChange={() =>
              setAvailableFor((pre) => {
                return {
                  ...pre,
                  Research: !pre.Research,
                };
              })
            }
          />
          <span className="text-[10px]">Collaboration</span>
          <Switch
            checked={availableFor.Collaboration}
            onChange={() =>
              setAvailableFor((pre) => {
                return {
                  ...pre,
                  Collaboration: !pre.Collaboration,
                };
              })
            }
          />
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};

export const sections = {
  about: About,
  education: Education,
  certifications: UserDocs,
  licenses: UserDocs,
  profileImages: ProfileImages,
};
