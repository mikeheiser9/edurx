import InputField from "@/components/input";
import { TextArea } from "@/components/textArea";
import { FormikHelpers } from "formik";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import instagram from "../../../assets/icons/instagram.svg";
import linkedin from "../../../assets/icons/linkedin.svg";
import twitter from "../../../assets/icons/twitter.svg";
import facebook from "../../../assets/icons/facebook.svg";
import eduIcon from "../../../assets/icons/eduIcon.svg";
import {
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCircleCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { getStaticImageUrl } from "@/util/helpers";
import { allowedFileTypes } from "@/util/constant";

const socialMediaIcons: socials = {
  instagram,
  facebook,
  twitter,
  linkedin,
};
const labelProps = {
  className: "text-white/50 text-sm font-semibold",
};

const About = (): React.JSX.Element => {
  return (
    <React.Fragment>
      <TextArea
        label="Personal Bio"
        placeholder="Write about your self"
        name="personal_bio"
        className="w-full resize-y"
        isFormikField
      />
      <InputField
        name="contact_email"
        placeholder="admin@example.com"
        type="text"
        label="Preferred Contact Email"
        maxLength={50}
      />
      <div className="my-4">
        <span className="text-white/50 text-sm font-semibold">
          Link Socials
        </span>
        <div className="flex flex-wrap text-sm flex-auto justify-between gap-6 mt-2">
          {Object.keys(socialMediaIcons).map((socialMedia: string) => (
            <div className="flex gap-4" key={socialMedia}>
              <span className="bg-primary flex justify-center rounded-full h-10 w-10">
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
                className="flex-1"
                name={`socials.${socialMedia}`}
                placeholder={`${socialMedia}@123`}
                maxLength={30}
                onKeyDown={(event) => {
                  if (event.code === "Space") event.preventDefault();
                }}
              />
            </div>
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
}: {
  values: education;
  isListView: boolean;
  setIsListView?: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData;
  actions: FormikHelpers<education>;
}): React.JSX.Element => {
  const onEdit = (value: education) => {
    setIsListView?.(false);
    actions.setValues({
      ...value,
      start_date: moment(value?.start_date).format("YYYY-MM-DD"),
      end_date: moment(value?.end_date).format("YYYY-MM-DD"),
    });
  };

  const addMore = () => {
    setIsListView?.(false);
    actions.resetForm();
  };
  const ListView = () => (
    <>
      {userData?.educations?.map((value: education) => (
        <div className="flex gap-x-6" key={value?._id || Date.now()}>
          <div className="flex">
            <Image src={eduIcon} alt={`${value?._id as string}alt`} />
          </div>
          <div className="flex flex-1 flex-col text-white gap-1">
            <span className="text-lg">{value.school_name}</span>
            <span className="text-white/50 text-xs">
              {value.field_of_study}
            </span>
            <div>
              <span className="text-white/50 text-xs">
                {moment(value?.start_date).format("YYYY")}
              </span>
              {" - "}
              <span className="text-white/50 text-xs">
                {value?.is_in_progress
                  ? "Present"
                  : moment(value?.start_date).format("YYYY")}
              </span>
            </div>
          </div>
          <div className="flex p-4 py-2 justify-end">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-white cursor-pointer"
              onClick={() => onEdit(value)}
            />
          </div>
        </div>
      ))}
      <div className="flex gap-x-4 my-4">
        <span
          className="bg-[#3A3A3A] rounded-xl cursor-pointer w-10 h-10 flex justify-center"
          onClick={addMore}
        >
          <FontAwesomeIcon icon={faPlus} className="text-white self-center" />
        </span>
        <span
          className="cursor-pointer bg-[#3A3A3A] text-white/50 rounded-lg p-2 px-6"
          onClick={addMore}
        >
          Add another
        </span>
      </div>
    </>
  );
  return (
    <React.Fragment>
      <div className="flex gap-2 flex-col">
        {isListView && userData?.educations?.length ? (
          <ListView />
        ) : (
          <>
            {userData?.educations?.length && (
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="text-white cursor-pointer animate-fade-in-down"
                onClick={() => setIsListView?.(true)}
              />
            )}
            <InputField
              type="text"
              name="school_name"
              placeholder="Enter school name"
              label="School"
              maxLength={20}
              labelProps={labelProps}
              mandatory
            />
            <InputField
              type="text"
              name="degree"
              placeholder="Enter name of degree"
              maxLength={20}
              label="Degree"
              labelProps={labelProps}
            />
            <InputField
              type="text"
              name="field_of_study"
              placeholder="Enter field of study"
              label="Field of Study"
              maxLength={20}
              labelProps={labelProps}
              mandatory
            />
            <div className="flex flex-auto gap-4">
              <div className="flex flex-col flex-1">
                <InputField
                  label="Start Date"
                  name="start_date"
                  type="date"
                  className="dark:[color-scheme:dark]"
                  labelProps={labelProps}
                  mandatory
                />
                <div className="flex items-center gap-2 text-white/50">
                  <label className="cursor-pointer" htmlFor="is_in_progress">
                    In Progress
                  </label>
                  <InputField
                    id="is_in_progress"
                    name="is_in_progress"
                    type="checkbox"
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <InputField
                  label="End Date (or expected)"
                  name="end_date"
                  placeholder="Last name"
                  className="dark:[color-scheme:dark]"
                  type="date"
                  min={
                    values?.is_in_progress
                      ? moment().format("YYYY-MM-DD")
                      : undefined
                  }
                  labelProps={labelProps}
                  mandatory
                />
              </div>
            </div>
            <TextArea
              label="Activities and Societies"
              // placeholder="Write about your self"
              name="activities"
              className="w-full resize-y"
            />
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
}: {
  userData: any;
  isListView: boolean;
  setIsListView?: React.Dispatch<React.SetStateAction<boolean>>;
  currentSection: keyof profileSections;
  actions: FormikHelpers<userDocs>;
  values: userDocs;
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
          <div className="flex">
            <FontAwesomeIcon
              icon={faFileCircleCheck}
              className="text-white w-10 h-10"
            />
          </div>
          <div className="flex flex-1 flex-col text-white gap-1">
            <span className="text-lg capitalize">{value.doc_name}</span>
            <span className="text-white/50 text-xs capitalize">
              {value.issuer_organization}
            </span>
            {value?.issue_date && (
              <span className="text-white/50 text-xs">
                Issued {value?.issue_date}
              </span>
            )}
            {(value?.doc_id?.length as number) > 0 && (
              <span className="text-white/50 text-xs">
                Credential ID {value?.doc_id || "-"}
              </span>
            )}
          </div>
          <div className="flex p-4 py-2 justify-end">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-white cursor-pointer"
              onClick={() => onEdit(value)}
            />
          </div>
        </div>
      ))}
      <div className="flex gap-x-4 my-4">
        <span
          className="bg-[#3A3A3A] rounded-xl cursor-pointer w-10 h-10 flex justify-center"
          onClick={addMore}
        >
          <FontAwesomeIcon icon={faPlus} className="text-white self-center" />
        </span>
        <span
          className="cursor-pointer bg-[#3A3A3A] text-white/50 rounded-lg p-2 px-6"
          onClick={addMore}
        >
          Add another
        </span>
      </div>
    </>
  );

  // useEffect(() => {
  //   setIsListView?.(userData?.[dataKey]?.length > 0 ? true : false);
  // }, [currentSection, userData]);

  return (
    <div className="flex gap-4 flex-col">
      {isListView && userData?.[dataKey]?.length > 0 ? (
        <ListView />
      ) : (
        <>
          {showIcon && (
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="text-white cursor-pointer animate-fade-in-down"
              onClick={() => setIsListView?.(true)}
            />
          )}
          <InputField
            type="text"
            name="doc_name"
            maxLength={20}
            placeholder="Enter name"
            label="Name"
            labelProps={labelProps}
            mandatory
          />
          <InputField
            type="text"
            maxLength={20}
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
                className="dark:[color-scheme:dark]"
                labelProps={labelProps}
              />
            </div>
            <div className="flex flex-col">
              <InputField
                label="Expiration Date"
                name="expiration_date"
                className="dark:[color-scheme:dark] disabled:opacity-50"
                type="month"
                labelProps={labelProps}
                disabled={values.has_no_expiry}
              />
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <label className="cursor-pointer" htmlFor="has_no_expiry">
                No Expiry
              </label>
              <InputField
                id="has_no_expiry"
                name="has_no_expiry"
                type="checkbox"
                className="cursor-pointer"
              />
            </div>
          </div>
          <InputField
            type="text"
            name="doc_id"
            maxLength={40}
            label="Credential ID"
            placeholder="Enter credential ID"
            labelProps={labelProps}
          />
          <InputField
            type="text"
            name="doc_url"
            maxLength={60}
            label="Credential URL"
            placeholder="Enter credential URL"
            labelProps={labelProps}
          />
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
    console.log(file);

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
    console.log({
      isPixelsValidated,
      isSizeValidated,
    });
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
          } flex h-[12rem] flex-col overflow-hidden items-center justify-center min-h-[10rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
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
        className={`text-primary capitalize text-sm animate-fade-in-down ${
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
}: {
  values: profileImages;
  actions: FormikHelpers<profileImages>;
}): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-4 mb-3">
      <div className="flex flex-col items-start gap-2">
        <span className="text-white">Upload Profile Picture</span>
        <DropZone img_type="profile_img" values={values} actions={actions} />
        <span className="text-white/50 text-xs">
          (Image file should not exceed 500x500 pixels or 8MB)
        </span>
      </div>
      <span className="w-full border border-primary/50" />
      <div className="flex flex-col items-start gap-2">
        <span className="text-white">Upload Banner Image</span>
        <DropZone img_type="banner_img" values={values} actions={actions} />
        <span className="text-white/50 text-xs">
          (Image file should not exceed 1400x250 pixels or 18MB)
        </span>
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
