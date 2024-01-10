import { axiosPut } from "@/axios/config";
import { selectUserDetail, setUserDetail } from "@/redux/ducks/user.duck";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sections } from "./sections";
import { Form, Formik, FormikHelpers } from "formik";
import { validationSchema } from "@/util/validations/userProfile";
import { responseCodes } from "@/util/constant";

interface Props {
  setCurrentSection: React.Dispatch<
    React.SetStateAction<keyof profileSections>
  >;
  currentSection: keyof profileSections;
  profileSections: profileSections;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
  isListView: boolean;
  editModal: UseModalType;
  saveAndExitButtonPressed: boolean;
  setSaveAndExitButtonPressed: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({
  profileSections,
  currentSection,
  setCurrentSection,
  userData,
  setUserData,
  setIsListView,
  isListView,
  editModal,
  saveAndExitButtonPressed,
  setSaveAndExitButtonPressed,
}: Props) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const [saveAndAddAnotherButtonPressed, setSaveAndAddAnotherButtonPressed] =
    useState(false);
  const saveAndAddAnotherButtonPressedRef =
    useRef<React.LegacyRef<HTMLButtonElement> | null>(null);
  const [availableFor, setAvailableFor] = useState({
    Mentorship: userData.Mentorship ? userData.Mentorship : false,
    Research: userData.Research ? userData.Research : false,
    Collaboration: userData.Collaboration ? userData.Collaboration : false,
  });
  const userId: string | undefined = loggedInUser?._id;
  let message = `Failed to save user profile [${currentSection}]`;

  const intialFormikValues: userProfileInterface = {
    about: {
      personal_bio: userData?.personal_bio || "",
      contact_email: userData?.contact_email || "",
      username: userData?.username || "",
      socials: {
        instagram: userData?.socials?.instagram || "",
        x: userData?.socials?.x || "",
        facebook: userData?.socials?.facebook || "",
        linkedin: userData?.socials?.linkedin || "",
        website: userData?.socials?.website || "",
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

  const handleAboutSection = async (values: about) => {
    try {
      setUserData((preData) => {
        return {
          ...(preData as UserData),
          ...values,
        };
      });
      const response = await axiosPut("/user/profile", {
        userId,
        ...values,
      });
      if (response.status !== responseCodes.SUCCESS)
        throw new Error("Unable to update profile");
    } catch (err) {
      throw "";
    }
  };

  const handleEducation = async (values: education) => {
    try {
      let editId = values?._id,
        payload: education[] = [...(userData?.educations || [])];
      if (editId) {
        payload = userData?.educations?.filter(
          (item: education) => item._id !== editId
        ) as education[];
      }
      delete values?._id;
      if (values.is_in_progress) {
        values.end_date = "";
      }
      const res = await axiosPut("/user/profile", {
        userId,
        educations: [...payload, values],
      });
      if (res.status === responseCodes.SUCCESS) {
        setUserData((preData) => {
          return {
            ...preData,
            ...res?.data?.data?.user,
          };
        });
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      throw new Error("error");
    }
  };

  const handleDocsSection = async (values: userDocs, doc_type: string) => {
    if (values.has_no_expiry) {
      values.expiration_date = "";
    }
    const payload = {
      ...values,
      doc_type,
      userId,
    };
    const editId = values?._id;
    try {
      const response = await axiosPut(`/user/${userId}/documents`, payload);
      if (response.status === responseCodes.SUCCESS) {
        let key = doc_type === "license" ? "licenses" : "certificates";
        setUserData((preData: any) => {
          let data = preData?.[key] || [];
          data = data.filter((item: userDocs) => item._id !== editId);
          return {
            ...preData,
            [key]: [...data, response.data.data],
          };
        });
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      throw new Error("error");
    }
  };

  const handleProfileImages = async (values: profileImages) => {
    try {
      if (!values.profile_img && !values.banner_img && Object.keys(availableFor).every((key)=>!(availableFor as any)[key])) return;
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key != "availableFor") {
          formData.set(
            key,
            values[key as keyof profileImages] as string | Blob
          );
        }
      });
      formData.append("data", JSON.stringify({ userId, availableFor }));
      const response = await axiosPut("/user/profile", formData);
      if (response?.status === responseCodes.SUCCESS) {
        dispatch(
          setUserDetail({
            ...loggedInUser,
            profile_img: response?.data?.data?.user?.profile_img,
          })
        );
        setUserData((preData: any) => {
          return {
            ...preData,
            profile_img: response?.data?.data?.user?.profile_img,
            banner_img: response?.data?.data?.user?.banner_img,
            Collaboration: response?.data?.data?.user?.Collaboration,
            Mentorship: response?.data?.data?.user?.Mentorship,
            Research: response?.data?.data?.user?.Research,
          };
        });
      } else throw new Error("Something went wrong");
    } catch (err) {
      throw new Error("error");
    }
  };

  const onSubmit = async (
    values: education & about & userDocs & profileImages,
    actions: FormikHelpers<about & education & userDocs & profileImages>
  ) => {
    try {
      const updateCalls = {
        about: handleAboutSection,
        education: handleEducation,
        certifications: handleDocsSection,
        licenses: handleDocsSection,
        profileImages: handleProfileImages,
      };
      const update = updateCalls[currentSection as keyof typeof updateCalls];
      let doc_type = currentSection === "licenses" ? "license" : "certificate";
      actions.setSubmitting(true);
      if (currentSection == "education") {
        if (!values.is_in_progress && values.end_date <= values.start_date) {
          actions.setFieldError(
            "end_date",
            "End date must be after start date"
          );
          return;
        }
      } else if (["certifications", "licenses"].includes(currentSection)) {
        if (
          !values.has_no_expiry &&
          values?.issue_date &&
          values.expiration_date <= values?.issue_date
        ) {
          actions.setFieldError(
            "expiration_date",
            "Expiration date must be after Issue date"
          );
          return;
        }
      }
      await update(values, doc_type);
      if (saveAndExitButtonPressed) {
        setSaveAndExitButtonPressed(false);
        editModal.closeModal();
      } else if (saveAndAddAnotherButtonPressed) {
        setSaveAndAddAnotherButtonPressed(false);
        actions.resetForm();
      } else {
        setCurrentSection((currentSection) => {
          if (currentSection == "about") {
            return "education";
          } else if (currentSection == "education") {
            return "certifications";
          } else if (currentSection == "certifications") {
            return "licenses";
          } else if (currentSection == "licenses") {
            return "profileImages";
          } else {
            return "about";
          }
        });
      }
      actions.setSubmitting(false);
    } catch (err) {
      console.log(message, err);
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
        setSaveAndAddAnotherButtonPressed={setSaveAndAddAnotherButtonPressed}
        saveAndAddAnotherButtonPressedRef={saveAndAddAnotherButtonPressedRef}
        availableFor={availableFor}
        setAvailableFor={setAvailableFor}
      />
    );
  };

  useEffect(() => {
    return () => {
      setCurrentSection(
        Object.keys(profileSections)[0] as keyof profileSections
      );
    };
  }, []);

  if (!userData) return null;

  return (
    <div className="flex-auto flex flex-col pt-2">
      <Formik
        enableReinitialize
        initialValues={(intialFormikValues as any)[currentSection]}
        onSubmit={onSubmit}
        validationSchema={validationSchema[currentSection]}
      >
        {({ isSubmitting, values, ...actions }) => (
          <Form id={userData?._id}>
            <div className="py-2">
              {_renderSection(currentSection, values, actions)}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;
