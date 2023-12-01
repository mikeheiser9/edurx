import * as Yup from "yup";
import { validateField } from "../constant";

// will return schema based on the selected section from about, education.. etc.

const { stringPrefixJoiValidation, email } = validateField;

const userDocValidation = {
  doc_type: Yup.string().oneOf(["license", "certificate"]),
  doc_name: validateField.stringPrefixJoiValidation.required(
    "This field is required"
  ),
  issuer_organization: validateField.stringPrefixJoiValidation.required(
    "This field is required"
  ),
  issue_date: Yup.date().required(),
  expiration_date: Yup.date(),
  has_no_expiry: Yup.boolean(),
  doc_id: validateField.stringPrefixJoiValidation.nullable(),
  doc_image: validateField.stringPrefixJoiValidation.nullable(),
  doc_url: validateField.stringPrefixJoiValidation.nullable(),
};

const validationSchema: Yup.AnyObject = {
  about: Yup.object({
    contact_email: Yup.string().email("Please enter a valid email"),
    personal_bio: Yup.string().max(1000, "Can't exceed 1000 characters"),
    socials: Yup.object({
      instagram: Yup.string().max(100, "Can't exceed 100 characters"),
      linkedin: Yup.string().max(100, "Can't exceed 100 characters"),
      facebook: Yup.string().max(100, "Can't exceed 100 characters"),
      twitter: Yup.string().max(100, "Can't exceed 100 characters"),
    }),
  }),

  education: Yup.object({
    school_name: stringPrefixJoiValidation.required("School name is required"),
    degree: stringPrefixJoiValidation,
    field_of_study: stringPrefixJoiValidation.required(
      "Field of study is required"
    ),
    start_date: stringPrefixJoiValidation.required("Start date is required"),
    end_date: Yup.date(),
    is_in_progress: Yup.boolean().default(false),
    activities: Yup.string().nullable(),
  }),
  certifications: Yup.object(userDocValidation),
  licenses: Yup.object(userDocValidation),
};

export { validationSchema };
