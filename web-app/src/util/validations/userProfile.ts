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
    username: Yup.string().max(28, "Can't exceed 28 characters"),
    socials: Yup.object({
      instagram: Yup.string().matches(/(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-._]+)/i,'Invalid Instagram URL'),
      linkedin: Yup.string().matches(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/gm,'Invalid Linkedin URL'),
      facebook: Yup.string().matches(/(?:(?:http|https):\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/i,'Invalid Facebook URL'),
      x: Yup.string().matches(/(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,"Invalid Twitter URL"),
      website:Yup.string().matches(/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,'Invalid Website URL' )
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
