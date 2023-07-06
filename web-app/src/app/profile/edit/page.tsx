"use client";
import { axiosGet, axiosPut } from "@/axios/config";
import { requireAuthentication } from "@/components/requireAuthentication";
import { selectUserDetail } from "@/redux/ducks/user.duck";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sections } from "./sections";
import { Form, Formik, FormikHelpers } from "formik";
import { validationSchema } from "@/util/validations/userProfile";
import { Button } from "@/components/button";
import { AxiosResponse } from "axios";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const profileSections: profileSections = {
    about: "About",
    education: "Education",
    certifications: "Certifications",
    licenses: "Licenses",
    profileImages: "Profile Images",
  };
  const queryParam =
    (useSearchParams()?.get("section") as keyof profileSections) || null;
  const isValidQueryParam = profileSections[queryParam] || false;

  const userId: string | undefined = useSelector(selectUserDetail)?._id;
  const [userData, setUserData] = useState<any>(null);
  const [isListView, setIsListView] = useState<boolean>(true);
  const [currentSection, setCurrentSection] = useState<keyof profileSections>(
    isValidQueryParam
      ? (queryParam as keyof profileSections)
      : (Object.keys(profileSections)[0] as keyof profileSections)
  );

  const intialFormikValues: userProfileInterface = {
    about: {
      personal_bio: userData?.personal_bio || "",
      contact_email: userData?.contact_email || "",
      socials: {
        instagram: userData?.socials?.instagram || "",
        twitter: userData?.socials?.twitter || "",
        facebook: userData?.socials?.facebook || "",
        linkedin: userData?.socials?.linkedin || "",
      },
    },
    education: {
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      is_in_progress: false,
      activities: "",
    },
    certifications: {
      doc_name: "",
      doc_type: "certificate",
      issue_date: "",
      expiration_date: "",
      issuer_organization: "",
      doc_id: "",
      doc_url: "",
      doc_image: "",
      has_no_expiry: false,
    },
    licenses: {
      doc_name: "",
      doc_type: "license",
      issue_date: "",
      expiration_date: "",
      issuer_organization: "",
      doc_id: "",
      doc_url: "",
      doc_image: "",
      has_no_expiry: false,
    },
    profileImages: {
      // Add profileImages fields here
      banner_img: userData?.banner_img || "",
      profile_img: userData?.profile_img || "",
    },
  };

  const fetchUserDocuments = async (doc_type: string) => {
    if (userData && Object.keys(userData)?.includes(doc_type)) return;
    await axiosGet(`/user/${userId}/documents`, {
      params: {
        doc_type,
      },
    })
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          setUserData((preData: any) => {
            return {
              ...preData,
              [doc_type]: res.data.data,
            };
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const onSelectSection = async (section: keyof profileSections) => {
    if (section === currentSection) return;
    setCurrentSection(section);
    !isListView && setIsListView(true);
    if (section === "certifications" || section === "licenses") {
      let doc_type = section === "licenses" ? "license" : "certificate";
      await fetchUserDocuments(doc_type);
    }
  };

  const handleAboutSection = async (
    values: education & about & userDocs & profileImages
  ) => {
    try {
      await axiosPut("/user/profile", {
        userId,
        ...values,
      });
    } catch (err) {
      console.log(`Failed to save user profile/${currentSection}`, err);
    }
  };

  const handleEducation = async (
    values: education & about & userDocs & profileImages
  ) => {
    try {
      let editId = values?._id,
        payload = [...(userData?.educations || [])];
      if (editId) {
        payload = userData?.educations?.filter(
          (item: education) => item._id !== editId
        );
      }
      setUserData((preData: userProfileInterface) => {
        return {
          ...preData,
          educations: [...payload, values],
        };
      });
      await axiosPut("/user/profile", {
        userId,
        educations: [...payload, values],
      });
      setIsListView(true);
    } catch (err) {
      console.log(`Failed to save user profile/${currentSection}`, err);
    }
  };

  const handleDocsSection = async (
    values: education & about & userDocs & profileImages,
    doc_type: string
  ) => {
    const payload = {
      ...values,
      doc_type,
      userId,
    };
    const editId = values?._id;
    setUserData((preData: any) => {
      let data = preData?.[doc_type] || [];
      if (editId) {
        data = data?.filter((doc: userDocs) => doc._id !== editId);
      }
      return {
        ...preData,
        [doc_type]: [...data, values],
      };
    });
    try {
      await axiosPut(`/user/${userId}/documents`, payload);
      setIsListView(true);
    } catch (err) {
      console.log(`Failed to save user profile/${currentSection}`, err);
    }
  };

  const handleProfileImages = async (
    values: education & about & userDocs & profileImages
  ) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) =>
        formData.set(key, values[key as keyof profileImages])
      );
      formData.append("data", JSON.stringify({ userId }));
      await axiosPut("/user/profile", formData);
    } catch (err) {
      console.log(`Failed to save user profile/${currentSection}`, err);
    }
  };

  const onSubmit = async (
    values: education & about & userDocs & profileImages,
    actions: FormikHelpers<about & education & userDocs & profileImages>
  ) => {
    try {
      console.log("onsubmitss", { values });
      const updateCalls = {
        about: handleAboutSection,
        education: handleEducation,
        certifications: handleDocsSection,
        licenses: handleDocsSection,
        profileImages: handleProfileImages,
      };
      const update = updateCalls[currentSection as keyof typeof updateCalls];
      let doc_type = currentSection === "licenses" ? "license" : "certificate";
      await update(values, doc_type);
    } catch (err) {
      console.log(`Failed to save user profile/${currentSection}`, err);
    }
  };

  const _renderSection = (
    sectionType: string,
    values: about & education & userDocs & profileImages,
    actions: FormikHelpers<about & education & userDocs & profileImages>
  ) => {
    const Component = sections[sectionType as keyof profileSections];
    return (
      <Component
        values={values}
        isListView={isListView}
        setIsListView={setIsListView}
        userData={userData}
        actions={actions as any}
        currentSection={currentSection as keyof profileSections}
      />
    );
  };

  useEffect(() => {
    axiosGet(`/user/${userId}/profile`)
      .then((response) => {
        if (response.status === 200) {
          setUserData(response?.data?.data?.user);
        }
      })
      .catch((error) => console.log("could not retrieve user profile", error));
  }, []);

  // fetch docs if user gose to tab by query string
  useEffect(() => {
    if (
      !queryParam ||
      !isValidQueryParam ||
      !userId ||
      !currentSection ||
      (queryParam !== "certifications" && queryParam !== "licenses")
    )
      return;
    let doc_type = currentSection === "licenses" ? "license" : "certificate";
    const fetchData = async () => {
      await fetchUserDocuments(doc_type);
    };
    fetchData();
  }, [queryParam]);

  if (!userData) return null;

  return (
    <div className="flex justify-center flex-col items-center">
      <h3>Edit Profile</h3>
      <div className="container rounded-lg bg-primary-dark overflow-hidden">
        <div className="flex bg-primary p-4">
          <span className="text-2xl">
            {profileSections[currentSection as keyof profileSections]}
          </span>
        </div>
        <ul className="flex gap-4 p-4 px-8">
          {Object.keys(profileSections).map((section: string) => (
            <li
              className={`${
                currentSection === section
                  ? "text-primary"
                  : "text-white cursor-pointer"
              }`}
              key={section}
              onClick={() => onSelectSection(section as keyof profileSections)}
            >
              {profileSections[section as keyof profileSections]}
              <span className="w-2 h-2 rounded-full ml-4 bg-[#8F8F8E] inline-block" />
            </li>
          ))}
        </ul>
        <div className="p-8">
          <Formik
            enableReinitialize
            initialValues={
              (intialFormikValues as any)[currentSection]
              // intialFormikValues[
              //   currentSection as keyof userProfileInterface
              // ] as any
            }
            onSubmit={onSubmit}
            validationSchema={validationSchema[currentSection]}
          >
            {({ isSubmitting, values, ...actions }) => (
              <Form>
                <div className="py-2">
                  {_renderSection(currentSection, values, actions)}
                </div>
                <div className="m-2 flex justify-center">
                  <Button
                    disabled={
                      (currentSection as keyof profileSections) ===
                        "profileImages" &&
                      !values.banner_img &&
                      !values.profile_img
                    }
                    type="submit"
                    label="Save"
                    className="w-1/5"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default requireAuthentication(Page);
