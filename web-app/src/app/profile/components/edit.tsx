import { axiosPut } from "@/axios/config";
import { selectUserDetail, setUserDetail } from "@/redux/ducks/user.duck";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sections } from "./sections";
import { Form, Formik, FormikHelpers } from "formik";
import { validationSchema } from "@/util/validations/userProfile";
import { responseCodes } from "@/util/constant";
import { showToast } from "@/components/toast";

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
}: Props) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUserDetail);
  const userId: string | undefined = loggedInUser?._id;
  let message = `Failed to save user profile [${currentSection}]`;

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
      setCurrentSection("education");
    } catch (err) {
      showToast.error(message);
      console.log(message, err);
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
        setIsListView(true);
        setCurrentSection("certifications");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      showToast.error(message);
      console.log(message, err);
    }
  };

  const handleDocsSection = async (values: userDocs, doc_type: string) => {
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
        setIsListView(true);
        setCurrentSection(
          doc_type === "license" ? "profileImages" : "licenses"
        );
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      showToast.error(message);
      console.log(message, err);
    }
  };

  const handleProfileImages = async (values: profileImages) => {
    try {
      if (!values.profile_img && !values.banner_img) return;
      const formData = new FormData();
      Object.keys(values).forEach((key) =>
        formData.set(key, values[key as keyof profileImages])
      );
      formData.append("data", JSON.stringify({ userId }));
      const response = await axiosPut("/user/profile", formData);
      if (response?.status === responseCodes.SUCCESS) {
        dispatch(
          setUserDetail({
            ...loggedInUser,
            profile_img: response?.data?.data?.user?.profile_img,
          })
        );
        showToast?.success("Profile updated successfully");
        editModal?.closeModal();
      } else throw new Error("Something went wrong");
    } catch (err) {
      showToast.error(message);
      console.log(message, err);
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
      await update(values, doc_type);
      actions.setSubmitting(false);
    } catch (err) {
      showToast.error("Something went wrong");
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
      />
    );
  };

  // fetch docs if user gose to tab by query string
  // useEffect(() => {
  //   if (
  //     !currentSection ||
  //     (currentSection !== "certifications" && currentSection !== "licenses")
  //   )
  //     return;
  //   let doc_type = currentSection === "licenses" ? "license" : "certificate";
  //   const fetchData = async () => {
  //     await fetchUserDocuments(doc_type);
  //   };
  //   fetchData();
  // }, [currentSection]);

  useEffect(() => {
    return () => {
      setCurrentSection(
        Object.keys(profileSections)[0] as keyof profileSections
      );
    };
  }, []);

  if (!userData) return null;

  return (
    <div className="flex-auto flex flex-col p-4 pt-2">
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
